const { expect } = require('@playwright/test');
const locators = require('../locators/EGO_Locators').CheckoutLocators;
const BasePage = require('../pages/BasePage');
const AddToCartPage = require('../pages/AddToCartPgae');

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
        await expect(this.page).toHaveTitle('Checkout - EGO');
    }

    async enterEmail(email) {
        await this.page.fill(locators.emailInput, email);
    }

    async clickContinue() {
        await this.page.click(locators.continueButton);
    }

    async fillShippingAddress(data) {
        console.log('Waiting for shipping form...');
        await this.page.waitForTimeout(3000);

        // Check for "Enter address manually" link/button and click it if present
        const manualEntrySelectors = [
            'button:has-text("Enter address manually")',
            'a:has-text("Enter address manually")',
            'span:has-text("Enter address manually")',
            'text=Or Enter Your Address Manually'
        ];

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
                // Wait specifically for this field
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

        await safeFill(locators.shipping.firstNameInput, data.firstName, 'First Name');
        await safeFill(locators.shipping.lastNameInput, data.lastName, 'Last Name');
        await safeFill(locators.shipping.addressLine1Input, data.addressLine1, 'Address Line 1');

        if (data.addressLine2) {
            await safeFill(locators.shipping.addressLine2Input, data.addressLine2, 'Address Line 2');
        }

        await safeFill(locators.shipping.cityInput, data.city, 'City');
        await safeFill(locators.shipping.postCodeInput, data.postCode, 'Post Code');
        await safeSelect(locators.shipping.countryCodeSelect, data.countryCode, 'Country');

        // Handle Province/State - critical for US/CA
        await this.page.waitForTimeout(1000); // Wait for state field to update based on country

        const provinceSelectors = [
            locators.shipping.provinceSelect,
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
                    // Try by value or label (e.g. "NY" or "New York")
                    // Often value is region ID integer, so label is safer if text
                    // But safeSelect uses selectOption which handles value/label/index
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
            console.log('⚠ Warning: Could not find visible Province/State field. Form submission might fail.');
        }

        await safeFill(locators.shipping.phoneInput, data.phoneNumber, 'Phone');

        await this.page.waitForTimeout(2000);

        const continueBtn = this.page.locator(locators.shipping.shippingContinueButton);
        await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
        await continueBtn.click();
        console.log('✓ Clicked shipping continue button');

        // Check for error messages
        await this.page.waitForTimeout(2000);
        const errorMsg = this.page.locator('.message-error, .error-message, [role="alert"]').first();
        if (await errorMsg.isVisible()) {
            const text = await errorMsg.textContent();
            console.error(`✗ Error after clicking continue: "${text}"`);
            throw new Error(`Shipping form submission failed: ${text}`);
        }

        // Handle potential Shipping Method step
        await this.handleShippingMethod();
    }

    async handleShippingMethod() {
        console.log('Checking for Shipping Method step...');
        try {
            // Wait to see if we are on shipping method step
            // Common selector for shipping method continue button
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

        const frame = this.page.frameLocator(locators.payment.stripeIframe).first();

        // Wait for iframe to be attached
        await this.page.waitForSelector(locators.payment.stripeIframe, { timeout: 20000 });

        try {
            await frame.locator(locators.payment.cardNumberInput).waitFor({ state: 'visible', timeout: 10000 });
            await frame.locator(locators.payment.cardNumberInput).fill(card.number);
            await frame.locator(locators.payment.cardExpiryInput).fill(card.expiry);
            await frame.locator(locators.payment.cardCvcInput).fill(card.cvc);

            // Name might be outside iframe or different
            // Try inside iframe first
            if (await frame.locator(locators.payment.cardNameInput).isVisible().catch(() => false)) {
                await frame.locator(locators.payment.cardNameInput).fill(card.name);
            } else {
                // Try outside
                const nameInput = this.page.locator('#card-name'); // Guessing
                if (await nameInput.isVisible()) await nameInput.fill(card.name);
            }

            console.log('✓ Filled card details');
        } catch (e) {
            console.error('✗ Failed to fill card details:', e.message);
            // Don't throw, let clickPayNow try
        }
    }

    async clickPayNow() {
        await this.page.waitForTimeout(1000);
        await this.page.click(locators.payment.payNowButton);
    }

    async verifyOrderConfirmation() {
        await expect(this.page).toHaveTitle('Order Confirmation - EGO');
    }
}

module.exports = CheckoutPage;
