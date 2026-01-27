const { expect } = require('@playwright/test');
const { CheckoutLocators } = require('../locators/checkoutLocators');
const basePage = require('./basePage');
const AddToCartPage = require('./addToCartPage');
const { testData } = require('../config/testData');
const { settle } = require('../utils/dynamicWait');

class CheckoutPage extends basePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.addToCartPage = new AddToCartPage(page);
    }

    async addProductToCartAndNavigateToCheckout() {
        await this.addToCartPage.openRandomProduct();
        await this.addToCartPage.selectSizeAndAddToBag();
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

    async enterEmail(email) {
        // Wait for navigation to checkout page (may redirect to external checkout domain)
        await this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.large }).catch(() => {});
        await settle(this.page, 1000);
        
        // Wait for email input to be visible with longer timeout for cross-domain navigation
        const emailInput = this.page.locator(CheckoutLocators.emailInput);
        await emailInput.waitFor({ state: 'visible', timeout: testData.timeouts.large });
        await settle(this.page, 300);
        await emailInput.fill(email);
        await settle(this.page, 200);
    }

    async clickContinue() {
        await this.closeModalIfPresent();
        const continueBtn = this.page.locator(CheckoutLocators.continueButton);
        await continueBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await continueBtn.waitFor({ state: 'attached' });
        await settle(this.page, 200);
        await continueBtn.click();
        
        await Promise.race([
            this.page.waitForURL(/\/checkout\/shipping/i, { timeout: testData.timeouts.medium }),
            this.page.locator(CheckoutLocators.shipping.firstNameInput).waitFor({ state: 'visible', timeout: testData.timeouts.medium })
        ]).catch(() => {});
        await settle(this.page, 300);
    }

    async fillShippingAddress(data) {
        console.log('Waiting for shipping form...');
        await this.page.locator(CheckoutLocators.shipping.firstNameInput).waitFor({ state: 'visible', timeout: testData.timeouts.medium }).catch(() => {});

        const manualEntrySelectors = testData.checkout.manualEntryLabels;

        for (const selector of manualEntrySelectors) {
            if (await this.page.locator(selector).first().isVisible().catch(() => false)) {
                console.log(`Clicking manual address entry: ${selector}`);
                await this.page.locator(selector).first().click();
                await settle(this.page, 300);
                break;
            }
        }

        const safeFill = async (selector, value, name) => {
            try {
                const element = this.page.locator(selector);
                await element.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

                if (await element.isVisible()) {
                    await element.fill(value);
                    console.log(`✓ Filled ${name}`);
                    return true;
                } else {
                    console.log(`⊘ Skipped ${name} (not visible)`);
                    return false;
                }
            } catch (error) {
                console.log(`✗ Error filling ${name}:`, error.message);
                return false;
            }
        };

        const safeSelect = async (selector, value, name) => {
            try {
                const element = this.page.locator(selector);
                await element.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

                if (await element.isVisible()) {
                    await this.page.selectOption(selector, value);
                    console.log(`✓ Selected ${name}`);
                    return true;
                } else {
                    console.log(`⊘ Skipped ${name} (not visible)`);
                    return false;
                }
            } catch (error) {
                console.log(`✗ Error selecting ${name}:`, error.message);
                return false;
            }
        };

        await safeFill(CheckoutLocators.shipping.firstNameInput, data.firstName, 'First Name');
        await safeFill(CheckoutLocators.shipping.lastNameInput, data.lastName, 'Last Name');
        await safeFill(CheckoutLocators.shipping.addressLine1Input, data.addressLine1, 'Address Line 1');

        if (data.addressLine2) {
            await safeFill(CheckoutLocators.shipping.addressLine2Input, data.addressLine2, 'Address Line 2');
        }

        await safeFill(CheckoutLocators.shipping.cityInput, data.city, 'City');
        await safeFill(CheckoutLocators.shipping.postCodeInput, data.postCode, 'Post Code');
        await safeSelect(CheckoutLocators.shipping.countryCodeSelect, data.countryCode, 'Country');

        await settle(this.page, 200);

        const provinceSelectors = [
            CheckoutLocators.shipping.provinceSelect,
            'select[name="region_id"]',
            'select[name="region"]',
            'input[name="region"]',
            'select[autocomplete="address-level1"]'
        ];

        let provinceFilled = false;
        for (const selector of provinceSelectors) {
            const el = this.page.locator(selector);
            if (await el.isVisible().catch(() => false)) {
                console.log(`Found Province field: ${selector}`);
                const tagName = await el.evaluate(e => e.tagName.toLowerCase());
                if (tagName === 'select') {
                    await el.selectOption({ label: data.province }).catch(async () => {
                        await el.selectOption({ value: data.province }).catch(() => { });
                    });
                    console.log(`✓ Selected Province via ${selector}`);
                } else {
                    await el.fill(data.province);
                    console.log(`✓ Filled Province via ${selector}`);
                }
                provinceFilled = true;
                break;
            }
        }

        if (!provinceFilled) {
            console.log('⚠ Warning: Could not find visible Province/State field.');
        }

        await safeFill(CheckoutLocators.shipping.phoneInput, data.phoneNumber, 'Phone');

        await settle(this.page, 300);

        const continueBtn = this.page.locator(CheckoutLocators.shipping.shippingContinueButton);
        await continueBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await this.page.waitForFunction(
            (sel) => {
                const el = document.querySelector(sel);
                return el && !el.disabled && !el.classList.contains('is-loading');
            },
            CheckoutLocators.shipping.shippingContinueButton,
            { timeout: 30000 }
        );

        await continueBtn.click();
        console.log('✓ Clicked shipping continue button');

        await settle(this.page, 400);
        const errorMsg = this.page.locator('.message-error, .error-message, [role="alert"]').first();
        if (await errorMsg.isVisible()) {
            const text = await errorMsg.textContent();
            console.error(`✗ Error after clicking continue: "${text}"`);
            throw new Error(`Shipping form submission failed: ${text}`);
        }

        await this.handleShippingMethod();
    }

    async handleShippingMethod() {
        console.log('Checking for Shipping Method step...');
        await settle(this.page, 500);
        
        try {
            const methodsContinueBtn = this.page.locator('button[data-testid="shipping-method-continue"], button:has-text("Continue to payment"), #checkout-shipping-method-continue');

            if (await methodsContinueBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
                console.log('Found Shipping Method step. Clicking continue...');
                await methodsContinueBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
                await settle(this.page, 200);
                await methodsContinueBtn.click();
                
                await Promise.race([
                    this.page.waitForURL(/\/checkout\/payment/i, { timeout: testData.timeouts.medium }),
                    this.page.locator(CheckoutLocators.payment.stripeIframe).waitFor({ state: 'attached', timeout: testData.timeouts.medium })
                ]).catch(() => {});
                await settle(this.page, 500);
            } else {
                console.log('No specific Shipping Method step found, assuming proceed to payment.');
            }
        } catch (e) {
            console.log('Error handling shipping method:', e.message);
        }
    }

    async fillCardDetails(card) {
        console.log('Filling card details...');
        await this.closeModalIfPresent();
        
        await this.page.waitForSelector(CheckoutLocators.payment.stripeIframe, { timeout: testData.timeouts.large });
        await settle(this.page, 500);

        const frame = this.page.frameLocator(CheckoutLocators.payment.stripeIframe).first();

        try {
            await frame.locator(CheckoutLocators.payment.cardNumberInput).waitFor({ state: 'visible', timeout: 15000 });
            await settle(this.page, 300);
            
            await frame.locator(CheckoutLocators.payment.cardNumberInput).fill(card.number);
            await settle(this.page, 200);
            
            await frame.locator(CheckoutLocators.payment.cardExpiryInput).waitFor({ state: 'visible', timeout: 5000 });
            await frame.locator(CheckoutLocators.payment.cardExpiryInput).fill(card.expiry);
            await settle(this.page, 200);
            
            await frame.locator(CheckoutLocators.payment.cardCvcInput).waitFor({ state: 'visible', timeout: 5000 });
            await frame.locator(CheckoutLocators.payment.cardCvcInput).fill(card.cvc);
            await settle(this.page, 200);

            if (await frame.locator(CheckoutLocators.payment.cardNameInput).isVisible({ timeout: 3000 }).catch(() => false)) {
                await frame.locator(CheckoutLocators.payment.cardNameInput).fill(card.name);
            } else {
                const nameInput = this.page.locator('#card-name');
                if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await nameInput.fill(card.name);
                }
            }

            await settle(this.page, 300);
            console.log('✓ Filled card details');
        } catch (e) {
            console.error('✗ Failed to fill card details:', e.message);
            throw e;
        }
    }

    async selectPaymentMethod(methodKey) {
        const selector = CheckoutLocators.payment.methods[methodKey];
        if (!selector) {
            throw new Error(`Unsupported payment method: ${methodKey}`);
        }
        const option = this.page.locator(selector).first();
        await option.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await settle(this.page, 200);
        await option.click();
        await settle(this.page, 400);
    }

    async selectCardPayment() {
        await this.selectPaymentMethod('card');
    }

    async selectPaypalPayment() {
        await this.selectPaymentMethod('paypal');
    }

    async selectKlarnaPayment() {
        await this.selectPaymentMethod('klarna');
    }

    async selectTestProviderPayment() {
        await this.selectPaymentMethod('testprovider');
    }

    async selectBankPayment() {
        await this.selectPaymentMethod('bank');
    }

    async selectAfterpayPayment() {
        await this.selectPaymentMethod('afterpay');
    }

    async selectClearpayPayment() {
        await this.selectPaymentMethod('clearpay');
    }

    async clickPayNow() {
        await this.closeModalIfPresent();
        const payBtn = this.page.locator(CheckoutLocators.payment.payNowButton);
        await payBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        
        await this.page.waitForFunction(
            (sel) => {
                const el = document.querySelector(sel);
                return el && !el.disabled && !el.classList.contains('is-loading');
            },
            CheckoutLocators.payment.payNowButton,
            { timeout: 10000 }
        ).catch(() => {});
        
        await settle(this.page, 200);
        await payBtn.click();
        
        await Promise.race([
            this.page.waitForURL(/order-confirmation|thank-you|success/i, { timeout: testData.timeouts.huge }),
            this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.huge })
        ]).catch(() => {});
        await settle(this.page, 1000);
    }

    async verifyOrderConfirmation() {
        await this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.medium }).catch(() => {});
        
        const titleMatch = await this.page.title().then(title => 
            new RegExp(testData.checkout.expectedTitles.confirmation, 'i').test(title)
        ).catch(() => false);
        
        const urlMatch = /order-confirmation|thank-you|success|confirmation/i.test(this.page.url());
        
        if (!titleMatch && !urlMatch) {
            await expect(this.page).toHaveTitle(new RegExp(testData.checkout.expectedTitles.confirmation, 'i'), { timeout: testData.timeouts.large });
        }
    }
}

module.exports = CheckoutPage;
