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
        await this.page.waitForTimeout(5000);

        const safeFill = async (selector, value) => {
            try {
                const element = this.page.locator(selector);
                const isVisible = await element.isVisible({ timeout: 2000 }).catch(() => false);
                if (isVisible) {
                    await element.fill(value);
                    console.log(`✓ Filled ${selector}`);
                    return true;
                } else {
                    console.log(`⊘ Skipped ${selector} (not visible)`);
                    return false;
                }
            } catch (error) {
                console.log(`✗ Error filling ${selector}:`, error.message);
                return false;
            }
        };

        const safeSelect = async (selector, value) => {
            try {
                const element = this.page.locator(selector);
                const isVisible = await element.isVisible({ timeout: 2000 }).catch(() => false);
                if (isVisible) {
                    await this.page.selectOption(selector, value);
                    console.log(`✓ Selected ${selector}`);
                    return true;
                } else {
                    console.log(`⊘ Skipped ${selector} (not visible)`);
                    return false;
                }
            } catch (error) {
                console.log(`✗ Error selecting ${selector}:`, error.message);
                return false;
            }
        };

        await safeFill(locators.shipping.firstNameInput, data.firstName);
        await safeFill(locators.shipping.lastNameInput, data.lastName);
        await safeFill(locators.shipping.addressLine1Input, data.addressLine1);
        if (data.addressLine2) {
            await safeFill(locators.shipping.addressLine2Input, data.addressLine2);
        }
        await safeFill(locators.shipping.cityInput, data.city);
        await safeFill(locators.shipping.postCodeInput, data.postCode);
        await safeSelect(locators.shipping.countryCodeSelect, data.countryCode);
        await safeSelect(locators.shipping.provinceSelect, data.province);
        await safeFill(locators.shipping.phoneInput, data.phoneNumber);

        await this.page.waitForTimeout(1000);

        const continueBtn = this.page.locator(locators.shipping.shippingContinueButton);
        if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await continueBtn.click();
            console.log('✓ Clicked shipping continue button');
        } else {
            console.log('⊘ Shipping continue button not visible');
        }
    }

    async fillCardDetails(card) {
        const frame = this.page.frameLocator(locators.payment.stripeIframe);

        await frame.locator(locators.payment.cardNumberInput).fill(card.number);
        await frame.locator(locators.payment.cardExpiryInput).fill(card.expiry);
        await frame.locator(locators.payment.cardCvcInput).fill(card.cvc);
        await frame.locator(locators.payment.cardNameInput).fill(card.name);
    }

    async clickPayNow() {
        await this.page.click(locators.payment.payNowButton);
    }

    async verifyOrderConfirmation() {
        await expect(this.page).toHaveTitle('Order Confirmation - EGO');
    }
}

module.exports = CheckoutPage;
