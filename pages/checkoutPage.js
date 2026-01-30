const { expect } = require('@playwright/test');
const { CheckoutLocators } = require('../locators/checkoutLocators');
const BasePage = require('./basePage');
const AddToCartPage = require('./addToCartPage');
const { testData } = require('../config/testData');
const { settle } = require('../utils/dynamicWait');

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.addToCartPage = new AddToCartPage(page);
    }

    /* ---------- CART / CHECKOUT ---------- */
    async addProductToCartAndNavigateToCheckout() {
        await this.addToCartPage.openRandomProduct();
        await this.addToCartPage.selectSizeAndAddToBag();
        await this.addToCartPage.openCart();
        await this.addToCartPage.proceedToCheckout();
    }

    async navigateToCheckoutPage() {
        await this.navigate(`${this.getBaseUrl()}/checkout`);
    }

    async verifyCheckoutPage() {
        await expect(this.page).toHaveTitle(/Checkout/i);
    }

    /* ---------- EMAIL & SIGN IN ---------- */
    async enterEmail(email) {
        const ms = testData.checkout.settleMs || {};
        await this.page.waitForLoadState('domcontentloaded', { timeout: testData.timeouts.large }).catch(() => {});
        const emailInput = this.page.locator(CheckoutLocators.emailInput);
        await emailInput.waitFor({ state: 'visible', timeout: testData.timeouts.xlarge });
        await settle(this.page, ms.afterEmail ?? testData.timeouts.small);
        await emailInput.fill(email);
        await settle(this.page, ms.afterEmail ?? testData.timeouts.small);
    }

    async clickContinue() {
        const ms = testData.checkout.settleMs || {};
        const continueBtn = this.page.locator(CheckoutLocators.continueToShipping);
        await continueBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await continueBtn.click();

        await Promise.race([
            this.page.waitForURL(/\/checkout\/shipping/i, { timeout: testData.timeouts.medium }),
            this.page.locator(CheckoutLocators.shipping.firstNameInput)
                .waitFor({ state: 'visible', timeout: testData.timeouts.medium })
        ]).catch(() => { });

        await settle(this.page, ms.afterContinue ?? testData.timeouts.small);
    }

    async clickSignIn() {
        const ms = testData.checkout.settleMs || {};
        const signInBtn = this.page.locator(CheckoutLocators.signInButton).first();
        await signInBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await signInBtn.click();
        await settle(this.page, ms.afterSignIn ?? testData.timeouts.medium);
    }

    async enterPassword(password) {
        const ms = testData.checkout.settleMs || {};
        const passwordInput = this.page.locator(CheckoutLocators.passwordInput).first();
        await passwordInput.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await passwordInput.fill(password);
        await settle(this.page, ms.afterPassword ?? testData.timeouts.medium);
    }

    async selectSavedAddress() {
        const ms = testData.checkout.settleMs || {};
        const savedAddress = this.page.locator(CheckoutLocators.savedAddress).first();
        if (await savedAddress.isVisible({ timeout: testData.timeouts.medium }).catch(() => false)) {
            await savedAddress.click();
            console.log("Selected saved address");
        } else {
            console.warn("No saved address found or visible.");
        }
        await settle(this.page, ms.afterSignIn ?? testData.timeouts.medium);
    }

    /* ---------- SHIPPING ---------- */
    async fillShippingAddress(data) {
        console.log("Starting to fill shipping address...");
        const ms = testData.checkout.settleMs || {};
        const manualLabels = testData.checkout.manualEntryLabels || [];
        const fieldTimeout = testData.timeouts.medium;
        const labels = testData.checkout.labels.inputLabels || {};

        // Click manual entry if present
        for (const label of manualLabels) {
            const btn = this.page.locator(label);
            if (await btn.isVisible({ timeout: testData.timeouts.small }).catch(() => false)) {
                console.log(`Found manual entry trigger: ${label}. Clicking...`);
                await btn.click();
                await settle(this.page, ms.afterSignIn ?? testData.timeouts.medium);
                break;
            }
        }

        const safeFill = async (selector, value, name) => {
            const el = this.page.locator(selector);
            await el.waitFor({ state: 'visible', timeout: fieldTimeout }).catch(() => {
                console.warn(`Field ${name} not visible, attempting to proceed...`);
            });
            if (await el.isVisible().catch(() => false)) {
                await el.fill(value);
                console.log(`Filled ${name}`);
            }
        };

        const safeSelect = async (selector, value, name) => {
            const el = this.page.locator(selector);
            await el.waitFor({ state: 'visible', timeout: fieldTimeout }).catch(() => {
                console.warn(`Dropdown ${name} not visible.`);
            });
            if (await el.isVisible().catch(() => false)) {
                await this.page.selectOption(selector, value);
                console.log(`Selected ${name}: ${value}`);
            }
        };

        // Fill basic address info
        await safeFill(CheckoutLocators.shipping.firstNameInput, data.firstName, labels.firstName || "First Name");
        await safeFill(CheckoutLocators.shipping.lastNameInput, data.lastName, labels.lastName || "Last Name");
        await safeFill(CheckoutLocators.shipping.addressLine1Input, data.addressLine1, labels.address1 || "Address Line 1");
        if (data.addressLine2) await safeFill(CheckoutLocators.shipping.addressLine2Input, data.addressLine2, labels.address2 || "Address Line 2");
        await safeFill(CheckoutLocators.shipping.cityInput, data.city, labels.city || "City");
        await safeFill(CheckoutLocators.shipping.postCodeInput, data.postCode, labels.postCode || "Post Code");

        // Select country first
        await safeSelect(CheckoutLocators.shipping.countrySelect, data.countryCode, labels.country || "Country");
        await settle(this.page, 1000); // wait for province options to render

        // Always handle province
        if (data.province) {
            await this.fillProvince(data.province, data.countryCode);
        }

        // Fill phone only after province
        await safeFill(CheckoutLocators.shipping.phoneInput, data.phoneNumber, labels.phone || "Phone Number");

        // Click continue to next step
        await this.clickShippingContinue();
    }

    async clickShippingContinue() {
        const ms = testData.checkout.settleMs || {};
        const continueBtn = this.page.locator(CheckoutLocators.shipping.continueToShippingMethod).first();
        const fallbackBtn = this.page.locator(CheckoutLocators.shippingContinueFallback).first();
        const nextStepReady = this.page.locator(CheckoutLocators.shippingMethodOrContinue).first();
        const retries = testData.checkout.retries?.shippingContinue ?? 5;
        const waitAfterClick = ms.shippingContinueWait ?? testData.timeouts.medium;
        const pollInterval = ms.buttonPollInterval ?? testData.timeouts.small;

        for (let i = 0; i < retries; i++) {
            if (await nextStepReady.isVisible().catch(() => false)) break;

            const primaryBtn = (await continueBtn.isVisible().catch(() => false)) ? continueBtn : fallbackBtn;
            const isDisabled = await primaryBtn.evaluate(el => el.disabled || el.classList.contains('is-loading'));

            if (!isDisabled) {
                await primaryBtn.click().catch(() => {});
                await settle(this.page, waitAfterClick);
                if (await nextStepReady.isVisible().catch(() => false)) break;
            }
            await settle(this.page, pollInterval);
        }

        const errorMsg = this.page.locator(CheckoutLocators.shippingError).first();
        if (await errorMsg.isVisible({ timeout: testData.timeouts.medium }).catch(() => false)) {
            const text = await errorMsg.textContent();
            throw new Error(`Shipping form submission failed: ${text}`);
        }
    }

    /* ---------- Province / State Handling ---------- */
    async fillProvince(province, countryCode) {
        const mappings = testData.checkout.stateMappings || {};
        const countryMap = mappings[countryCode] || {};
        const fullName = countryMap[province];
        const valuesToTry = [...new Set([province, fullName].filter(Boolean))];

        const selectors = CheckoutLocators.provinceSelectors || [CheckoutLocators.shipping.provinceSelect];
        const timeout = testData.timeouts.medium;

        for (const selector of selectors) {
            const el = this.page.locator(selector).first();
            if (!(await el.isVisible({ timeout }).catch(() => false))) continue;

            const tag = await el.evaluate(e => e.tagName.toLowerCase()).catch(() => '');
            if (tag === 'input') {
                const val = fullName || province;
                await el.fill(val);
                await el.dispatchEvent('change');
                await el.dispatchEvent('blur');
                await settle(this.page, 500);
                console.log(`Province filled (input): ${val}`);
                return;
            }

            if (tag !== 'select') continue;

            for (let attempt = 0; attempt < 3; attempt++) {
                await settle(this.page, 800);
                const options = await el.locator('option').allTextContents();
                if (options.length > 1) break;
            }

            const options = await el.locator('option').allTextContents();
            const opts = options.map(o => o.trim()).filter(o => o && !/^select\s|^choose\s|^--\s*$/i.test(o));

            let done = false;
            for (const v of valuesToTry) {
                try { await el.selectOption({ value: v }); done = true; break; } catch (_) {}
            }
            if (!done) {
                for (const v of valuesToTry) {
                    const byLabel = opts.find(o => o.toLowerCase() === v.toLowerCase());
                    if (byLabel) { await el.selectOption({ label: byLabel }); done = true; break; }
                }
            }
            if (!done) {
                for (const v of valuesToTry) {
                    const byPartial = opts.find(o => o.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(o.toLowerCase()));
                    if (byPartial) { await el.selectOption({ label: byPartial }); done = true; break; }
                }
            }
            if (!done && opts.length > 0) { await el.selectOption({ label: opts[0] }); done = true; }
            if (!done) { await el.selectOption({ index: 1 }).catch(() => {}); done = true; }

            if (done) {
                await el.dispatchEvent('change');
                await el.dispatchEvent('blur');
                await settle(this.page, 500);
                return;
            }
        }

        throw new Error('State/Province could not be filled. Tried all selectors.');
    }

    /* ---------- SHIPPING METHOD ---------- */
    async selectShippingMethod() {
        const ms = testData.checkout.settleMs || {};
        const wait = ms.afterShippingMethod ?? testData.timeouts.medium;

        const section = this.page.locator('[data-test="checkout-shipping-method"], .shipping-method').first();
        await section.waitFor({ state: 'visible', timeout: testData.timeouts.large }).catch(() => {});
        await settle(this.page, 2000);

        const methods = await this.page.locator(CheckoutLocators.shippingMethodRadio).all();
        if (methods.length === 1) {
            await methods[0].click({ force: true });
            console.log("Only one shipping method, auto-selected.");
        } else if (methods.length > 1) {
            const randomIndex = Math.floor(Math.random() * methods.length);
            await methods[randomIndex].click({ force: true });
            console.log(`Random shipping method selected: index ${randomIndex}`);
        }

        await this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.large }).catch(() => {});
        await settle(this.page, wait);
    }

    async continueToPayment() {
        const ms = testData.checkout.settleMs || {};
        const pollInterval = ms.buttonPollInterval ?? testData.timeouts.small;
        const retries = testData.checkout.retries?.continueToPayment ?? 5;

        const methodsContinueBtn = this.page.locator(CheckoutLocators.shippingMethodContinue).first();
        const fallbackBtn = this.page.locator(CheckoutLocators.shippingMethodContinueFallback).last();
        const finalBtn = (await methodsContinueBtn.isVisible().catch(() => false)) ? methodsContinueBtn : fallbackBtn;

        for (let i = 0; i < retries; i++) {
            const isDisabled = await finalBtn.evaluate(el => el.disabled || el.classList.contains('is-loading'));
            if (!isDisabled) {
                await finalBtn.click().catch(() => {});
                await settle(this.page, pollInterval);

                const result = await Promise.race([
                    this.page.waitForURL(/\/checkout\/payment/i, { timeout: 6000 }).then(() => 'payment'),
                    this.page.waitForURL(/\/cart/i, { timeout: 6000 }).then(() => 'cart')
                ]).catch(() => null);

                if (result === 'payment') return;
                if (result === 'cart') throw new Error("Checkout reset to cart — shipping data not accepted");
            }
            await settle(this.page, pollInterval);
        }

        throw new Error("Failed to continue to payment step after multiple attempts.");
    }

    /* ---------- PAYMENT ---------- */
    async fillCardDetails(card) {
        await this.closeModalIfPresent();
        console.log("Starting card details entry...");

        const paymentForm = this.page.locator(CheckoutLocators.paymentStep);
        await paymentForm.waitFor({ state: 'visible', timeout: testData.timeouts.large });

        const names = testData.checkout.stripeInputNames || { cardNumber: 'cardnumber', expDate: 'exp-date', cvc: 'cvc' };
        const frame = this.page.frameLocator(CheckoutLocators.payment.stripeIframe);
        await frame.locator(`input[name="${names.cardNumber}"]`).waitFor({ state: 'visible', timeout: testData.timeouts.large });

        const fillInput = async (name, value, label) => {
            const input = frame.locator(`input[name="${name}"]`);
            if (await input.isVisible({ timeout: testData.timeouts.medium }).catch(() => false)) {
                await input.fill(value);
                console.log(`Filled ${label}`);
                return true;
            }
            return false;
        };

        const labels = testData.checkout.labels.inputLabels || {};
        let cardFilled = await fillInput(names.cardNumber, card.number, labels.cardNumber || 'Card Number');
        let expiryFilled = await fillInput(names.expDate, card.expiry, labels.expiryDate || 'Expiry Date');
        let cvcFilled = await fillInput(names.cvc, card.cvc, labels.cvc || 'CVC');

        if (!cardFilled || !expiryFilled || !cvcFilled) {
            // Fallback to hosted frames
            const fillHosted = async (frameSelector, label, value) => {
                const hFrame = this.page.frameLocator(frameSelector);
                const input = hFrame.locator('input');
                if (await input.isVisible({ timeout: testData.timeouts.medium }).catch(() => false)) {
                    await input.fill(value);
                    console.log(`Filled ${label} in hosted frame`);
                    return true;
                }
                return false;
            };
            if (!cardFilled) cardFilled = await fillHosted(CheckoutLocators.payment.hostedFields.cardNumberFrame, labels.cardNumber || 'Card Number', card.number);
            if (!expiryFilled) expiryFilled = await fillHosted(CheckoutLocators.payment.hostedFields.cardExpiryFrame, labels.expiryDate || 'Expiry Date', card.expiry);
            if (!cvcFilled) cvcFilled = await fillHosted(CheckoutLocators.payment.hostedFields.cardCvcFrame, labels.cvc || 'CVC', card.cvc);
        }
    }

    async selectPaymentMethod(methodKey) {
        const selector = CheckoutLocators.payment.methods[methodKey];
        if (!selector) throw new Error(`Unsupported payment method: ${methodKey}`);
        await this.page.locator(selector).first().click();
    }

    async clickPayNow() {
        await this.closeModalIfPresent();
        const payBtn = this.page.locator(CheckoutLocators.payment.payNowButton);
        await payBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await payBtn.click();

        const pattern = testData.checkout.confirmationUrlPattern || 'order-confirmation|thank-you|success';
        await Promise.race([
            this.page.waitForURL(new RegExp(pattern, 'i'), { timeout: testData.timeouts.huge }),
            this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.huge })
        ]).catch(() => {});
    }

    async verifyOrderConfirmation() {
        await this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.medium }).catch(() => {});
        const pattern = testData.checkout.confirmationUrlPattern || 'order-confirmation|thank-you|success';
        const urlMatch = new RegExp(`${pattern}|confirmation`, 'i').test(this.page.url());
        if (!urlMatch) {
            await expect(this.page).toHaveTitle(new RegExp(testData.checkout.expectedTitles.confirmation, 'i'));
        }
    }
}

module.exports = CheckoutPage;
