const { expect } = require('@playwright/test');
const { CheckoutLocators } = require('../locators/checkoutLocators');
const BasePage = require('./basePage');
const AddToCartPage = require('./addToCartPage');
const { testData } = require('../config/testData');

class CheckoutPage extends BasePage {
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
        await this.page.fill(CheckoutLocators.emailInput, email);
    }

    async clickContinue() {
        await this.page.click(CheckoutLocators.continueButton);
    }

    async fillShippingAddress(data) {
        console.log('Waiting for shipping form...');
        await this.page.waitForTimeout(3000);

        // Check for "Enter address manually" link/button and click it if present
        const manualEntrySelectors = testData.checkout.manualEntryLabels;

        for (const selector of manualEntrySelectors) {
            if (await this.page.isVisible(selector)) {
                console.log(`Clicking manual address entry: ${selector}`);
                await this.page.click(selector);
                await this.page.waitForTimeout(1000);
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

        await this.page.waitForTimeout(1000);

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

        await this.page.waitForTimeout(2000);

        const continueBtn = this.page.locator(CheckoutLocators.shipping.shippingContinueButton);
        await continueBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });

        // Wait for button to be enabled (not loading)
        await this.page.waitForFunction(
            (btn) => !btn.disabled && !btn.classList.contains('is-loading'),
            await continueBtn.elementHandle(),
            { timeout: 30000 }
        );

        await continueBtn.click();
        console.log('✓ Clicked shipping continue button');

        await this.page.waitForTimeout(2000);
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
        try {
            const methodsContinueBtn = this.page.locator('button[data-testid="shipping-method-continue"], button:has-text("Continue to payment"), #checkout-shipping-method-continue');

            if (await methodsContinueBtn.isVisible({ timeout: 5000 })) {
                console.log('Found Shipping Method step. Clicking continue...');
                await methodsContinueBtn.click();
            } else {
                console.log('No specific Shipping Method step found, assuming proceed to payment.');
            }
        } catch (e) {
            console.log('Error handling shipping method:', e.message);
        }
    }

    async fillCardDetails(card) {
        console.log('Filling card details...');
        await this.page.waitForTimeout(2000);

        const frame = this.page.frameLocator(CheckoutLocators.payment.stripeIframe).first();

        await this.page.waitForSelector(CheckoutLocators.payment.stripeIframe, { timeout: 20000 });

        try {
            await frame.locator(CheckoutLocators.payment.cardNumberInput).waitFor({ state: 'visible', timeout: 10000 });
            await frame.locator(CheckoutLocators.payment.cardNumberInput).fill(card.number);
            await frame.locator(CheckoutLocators.payment.cardExpiryInput).fill(card.expiry);
            await frame.locator(CheckoutLocators.payment.cardCvcInput).fill(card.cvc);

            if (await frame.locator(CheckoutLocators.payment.cardNameInput).isVisible().catch(() => false)) {
                await frame.locator(CheckoutLocators.payment.cardNameInput).fill(card.name);
            } else {
                const nameInput = this.page.locator('#card-name');
                if (await nameInput.isVisible()) await nameInput.fill(card.name);
            }

            console.log('✓ Filled card details');
        } catch (e) {
            console.error('✗ Failed to fill card details:', e.message);
        }
    }

    async clickPayNow() {
        await this.page.waitForTimeout(1000);
        await this.page.click(CheckoutLocators.payment.payNowButton);
    }

    async verifyOrderConfirmation() {
        await expect(this.page).toHaveTitle(new RegExp(testData.checkout.expectedTitles.confirmation, 'i'));
    }
}

module.exports = CheckoutPage;
