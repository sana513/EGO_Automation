const { expect } = require('@playwright/test');
const { CheckoutLocators } = require('../../locators/checkoutLocators');
const BasePage = require('../basePage');
const AddToCartPage = require('../addToCartPage');
const { testData } = require('../../config/testData');
const { settle } = require('../../utils/dynamicWait');

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.config = testData.checkout;
        this.locators = CheckoutLocators;
        this.timeouts = testData.timeouts;
        this.addToCartPage = new AddToCartPage(page);
    }

    /* ---------- SHARED CHECKOUT STEPS ---------- */

    async clickShippingContinue() {
        const btn = this.page.locator(this.locators.shipping.continueToShippingMethod);
        await btn.waitFor({ state: 'visible', timeout: this.timeouts.large });
        await btn.click();
        await this.page.waitForURL(new RegExp('shipping-method|payment', 'i'), { timeout: this.timeouts.large });
        console.log("Moved to next checkout step");
    }

    async selectShippingMethod() {
        console.log("Waiting for shipping methods to load...");
        const section = this.page.locator(this.locators.shippingMethodStep).first();
        await section.waitFor({ state: 'visible', timeout: this.timeouts.large }).catch(() => { });
        await settle(this.page, this.config.waitTimes.shippingMethodLoad);

        const methods = await this.page.locator(this.locators.shippingMethodRadio).all();
        if (methods.length === 1) {
            console.log("Only one shipping method available, selecting it");
            await methods[0].click({ force: true });
        } else if (methods.length > 1) {
            const randomIndex = Math.floor(Math.random() * methods.length);
            console.log(`Random shipping method selected: index ${randomIndex}`);
            await methods[randomIndex].click({ force: true });
        } else {
            console.warn("No shipping methods found - might be auto-selected or not required");
        }

        await settle(this.page, this.config.waitTimes.shippingMethodSelection);
    }

    async continueToPayment() {
        if (this.config.regex.paymentPage.test(this.page.url())) {
            console.log("Already on payment page, skipping continue button");
            return;
        }

        const pollInterval = this.config.waitTimes.buttonPollInterval;
        const retries = this.config.retries?.continueToPayment ?? 10;

        for (let i = 0; i < retries; i++) {
            console.log(`Attempt ${i + 1}/${retries} to find continue to payment button`);

            const methodsContinueBtn = this.page.locator(this.locators.shippingMethodContinue).first();
            const fallbackBtn = this.page.locator(this.locators.shippingMethodContinueFallback).first();

            let finalBtn = null;
            if (await methodsContinueBtn.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
                finalBtn = methodsContinueBtn;
                console.log("Found primary continue button");
            } else if (await fallbackBtn.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
                finalBtn = fallbackBtn;
                console.log("Found fallback continue button");
            }

            if (finalBtn) {
                const errorMsg = this.page.locator(this.locators.shippingError).first();
                if (await errorMsg.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
                    const errorText = await errorMsg.textContent().catch(() => '');
                    console.log(`Validation error found: ${errorText}`);
                }

                let isEnabled = false;
                for (let waitAttempt = 0; waitAttempt < 3; waitAttempt++) {
                    const buttonState = await finalBtn.evaluate(el => ({
                        disabled: el.disabled,
                        hasLoadingClass: el.classList.contains('is-loading'),
                        hasDisabledClass: el.classList.contains('disabled'),
                        ariaDisabled: el.getAttribute('aria-disabled')
                    })).catch(() => ({ disabled: true }));

                    if (!buttonState.disabled && !buttonState.hasLoadingClass) {
                        isEnabled = true;
                        break;
                    }
                    console.log(`Waiting for button to become enabled (${waitAttempt + 1}/3)`);
                    await settle(this.page, pollInterval);
                }

                if (isEnabled || i >= retries - 2) {
                    console.log(`Attempting to click button (enabled: ${isEnabled})`);
                    await finalBtn.click({ force: true }).catch(() => { });
                    console.log("Clicked continue to payment button");
                    await settle(this.page, this.config.waitTimes.paymentStepLoad);

                    const result = await Promise.race([
                        this.page.waitForURL(this.config.regex.paymentPage, { timeout: 10000 }).then(() => 'payment'),
                        this.page.waitForURL(this.config.regex.cartPage, { timeout: 10000 }).then(() => 'cart'),
                        this.page.locator(this.locators.paymentStep).waitFor({ state: 'visible', timeout: 10000 }).then(() => 'payment-form')
                    ]).catch(() => null);

                    if (result === 'payment' || result === 'payment-form') {
                        console.log("Successfully navigated to payment page");
                        return;
                    }
                    if (result === 'cart') throw new Error("Checkout reset to cart — possibly session timeout");
                }
            }
            await settle(this.page, pollInterval);
        }
        throw new Error("Failed to continue to payment step after multiple attempts");
    }

    async fillCardDetails(card) {
        await this.closeModalIfPresent();
        console.log("Starting card details entry...");

        await this.page.waitForLoadState('networkidle').catch(() => { });
        await settle(this.page, this.config.waitTimes.paymentFormLoad);

        const checkoutComCardNumber = await this.page.locator('#checkoutcom-credit_card-ccNumber').count();
        if (checkoutComCardNumber > 0) {
            console.log("Using Checkout.com payment iframes");
            await this.fillCheckoutComFields(card);
            return;
        }

        const bigCommerceFrames = await this.page.locator('iframe[src*="checkout/payment/hosted-field"]').count();
        if (bigCommerceFrames > 0) {
            console.log("Using BigCommerce hosted fields payment method");
            await this.fillBigCommerceHostedFields(card);
            return;
        }

        const stripeFrames = await this.page.locator(this.locators.payment.stripeIframe).count();
        if (stripeFrames > 0) {
            console.log("Using Stripe iframe payment method");
            await this.fillStripeFields(card);
            return;
        }

        const directInputs = await this.page.locator(this.locators.payment.directCardInputs.number).count();
        if (directInputs > 0) {
            console.log("Using direct card input method");
            await this.fillDirectCardInputs(card);
            return;
        }

        throw new Error("No payment fields found on the page");
    }

    async fillCheckoutComFields(card) {
        const iframes = this.locators.payment.checkoutComIframes;

        const cardNumberFrame = this.page.locator(iframes.cardNumber).contentFrame();
        await cardNumberFrame.getByRole('textbox', { name: this.config.labels.inputLabels.cardNumber }).waitFor({ timeout: this.timeouts.large });
        await cardNumberFrame.getByRole('textbox', { name: this.config.labels.inputLabels.cardNumber }).fill(card.number);
        console.log("Card number filled");

        const cardNameFrame = this.page.locator(iframes.cardName).contentFrame();
        await cardNameFrame.getByRole('textbox', { name: 'Name on Card' }).fill(card.name);
        console.log("Cardholder name filled");

        const expiryFrame = this.page.locator(iframes.expiry).contentFrame();
        await expiryFrame.getByRole('textbox', { name: 'Expiration' }).fill(card.expiry);
        console.log("Expiry date filled");

        const cvvFrame = this.page.locator(iframes.cvv).contentFrame();
        await cvvFrame.getByRole('textbox', { name: 'CVV' }).fill(card.cvc);
        console.log("CVV filled");
    }

    async fillBigCommerceHostedFields(card) {
        const allFrames = this.page.locator('iframe[src*="checkout/payment/hosted-field"]');
        const frameCount = await allFrames.count();

        for (let i = 0; i < frameCount; i++) {
            const frame = this.page.frameLocator('iframe[src*="checkout/payment/hosted-field"]').nth(i);
            const input = frame.locator('input').first();

            const isVisible = await input.isVisible({ timeout: this.timeouts.small }).catch(() => false);
            if (!isVisible) continue;

            const placeholder = await input.getAttribute('placeholder').catch(() => '');
            const name = await input.getAttribute('name').catch(() => '');
            const id = await input.getAttribute('id').catch(() => '');
            const ariaLabel = await input.getAttribute('aria-label').catch(() => '');
            const autocomplete = await input.getAttribute('autocomplete').catch(() => '');

            const fieldIdentifier = (placeholder + ' ' + name + ' ' + id + ' ' + ariaLabel + ' ' + autocomplete).toLowerCase();

            if (name === 'cardNumber' || autocomplete === 'cc-number' || (fieldIdentifier.includes('number') && !fieldIdentifier.includes('cvv'))) {
                await input.fill(card.number);
            } else if (fieldIdentifier.includes('expir') || fieldIdentifier.includes('expiry') || fieldIdentifier.includes('mm')) {
                await input.fill(card.expiry);
            } else if (fieldIdentifier.includes('cvv') || fieldIdentifier.includes('cvc') || fieldIdentifier.includes('security')) {
                await input.fill(card.cvc);
            } else if (fieldIdentifier.includes('cardholder') || fieldIdentifier.includes('name')) {
                await input.fill(card.name);
            }
        }
        console.log("BigCommerce hosted fields filled");
    }

    async fillStripeFields(card) {
        const frame = this.page.frameLocator(this.locators.payment.stripeIframe);
        const names = this.config.stripeInputNames;
        await frame.locator(`input[name="${names.cardNumber}"]`).fill(card.number);
        await frame.locator(`input[name="${names.expDate}"]`).fill(card.expiry);
        await frame.locator(`input[name="${names.cvc}"]`).fill(card.cvc);
        console.log("Stripe details filled");
    }

    async fillDirectCardInputs(card) {
        const locators = this.locators.payment.directCardInputs;
        await this.page.locator(locators.number).fill(card.number);
        await this.page.locator(locators.expiry).fill(card.expiry);
        await this.page.locator(locators.cvc).fill(card.cvc);
        console.log("Direct card inputs filled");
    }

    async clickPayNow() {
        console.log("Clicking Pay Now button...");
        const payBtn = this.page.locator(this.locators.payment.payNowButton);
        await payBtn.waitFor({ state: 'visible', timeout: this.timeouts.medium });
        await payBtn.click();

        await settle(this.page, this.config.waitTimes.paymentStepLoad);

        console.log("Waiting for navigation to confirmation page...");
        await Promise.race([
            this.page.waitForURL(this.config.regex.confirmationPage, { timeout: this.timeouts.huge }),
            this.page.waitForLoadState('networkidle', { timeout: this.timeouts.huge })
        ]).catch(() => {
            console.log("Did not detect confirmation page navigation");
        });
    }

    async verifyOrderConfirmation() {
        await this.page.waitForLoadState('networkidle', { timeout: this.timeouts.medium }).catch(() => { });
        const urlMatch = this.config.regex.confirmationPage.test(this.page.url());
        if (!urlMatch) {
            await expect(this.page).toHaveTitle(new RegExp(this.config.expectedTitles.confirmation, 'i'));
        }
        console.log("Order confirmed");
    }

    async closeModalIfPresent() {
        for (const selector of this.locators.modalCloseSelectors) {
            const modalClose = this.page.locator(selector).first();
            if (await modalClose.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
                await modalClose.click();
                await settle(this.page, this.config.waitTimes.modalClose);
                return;
            }
        }
    }

    async selectProvince(provinceFromData) {
        console.log("Waiting for province field to stabilize...");
        await settle(this.page, this.config.waitTimes.provinceStabilize);

        let dropdown = null;
        let foundSelector = null;

        for (const selector of this.locators.provinceSelectors) {
            const element = this.page.locator(selector).first();
            if (await element.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
                dropdown = element;
                foundSelector = selector;
                break;
            }
        }

        if (!dropdown) {
            console.log("Province field not found - skipping");
            return;
        }

        await settle(this.page, this.config.waitTimes.provinceOptionsLoad);
        const tagName = await dropdown.evaluate(el => el.tagName.toLowerCase()).catch(() => 'unknown');

        if (tagName === 'select') {
            await this.page.waitForFunction(sel => {
                const el = document.querySelector(sel);
                return el && el.options && el.options.length > 1;
            }, foundSelector, { timeout: this.timeouts.large }).catch(() => { });

            await dropdown.click();
            await settle(this.page, this.config.waitTimes.provinceDropdownClick);

            const options = await dropdown.evaluate(el =>
                Array.from(el.options)
                    .filter(o => o.value && !o.disabled)
                    .map(o => ({ value: o.value, text: o.textContent.trim() }))
            );

            if (options.length > 0) {
                await dropdown.selectOption(options[0].value);
                await settle(this.page, this.config.waitTimes.provinceSelection);
                console.log(`Province selected: ${options[0].text}`);
            }
        } else if (tagName === 'input') {
            await dropdown.fill(this.config.defaultProvinceInput);
            await settle(this.page, this.config.waitTimes.provinceInputFill);
            console.log("Province input filled");
        }
    }

    async selectPaymentMethod(methodKey) {
        const selector = this.locators.payment.methods[methodKey];
        if (!selector) throw new Error(`Unsupported payment method: ${methodKey}`);
        await this.page.locator(selector).first().click();
    }
}

module.exports = CheckoutPage;
