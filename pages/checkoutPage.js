const { expect } = require('@playwright/test');
const locators = require('../locators/EGO_Locators').CheckoutLocators;
const BasePage = require('../pages/BasePage');

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async navigateToCheckoutPage() {
        await this.page.goto('https://vsfstage.egoshoes.com/us/checkout');
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
        await this.page.fill(locators.firstNameInput, data.firstName);
        await this.page.fill(locators.lastNameInput, data.lastName);
        await this.page.fill(locators.addressLine1Input, data.addressLine1);

        if (data.addressLine2) {
            await this.page.fill(locators.addressLine2Input, data.addressLine2);
        }

        await this.page.fill(locators.cityInput, data.city);
        await this.page.fill(locators.postCodeInput, data.postCode);
        await this.page.selectOption(locators.countryCodeSelect, data.countryCode);
        await this.page.selectOption(locators.provinceSelect, data.province);
        await this.page.fill(locators.phoneInput, data.phoneNumber);

        await this.page.click(locators.shippingContinueButton);
    }

    async fillCardDetails(card) {
        const frame = this.page.frameLocator(locators.stripeIframe);

        await frame.locator(locators.cardNumberInput).fill(card.number);
        await frame.locator(locators.cardExpiryInput).fill(card.expiry);
        await frame.locator(locators.cardCvcInput).fill(card.cvc);
        await frame.locator(locators.cardNameInput).fill(card.name);
    }

    async clickPayNow() {
        await this.page.click(locators.payNowButton);
    }

    async verifyOrderConfirmation() {
        await expect(this.page).toHaveTitle('Order Confirmation - EGO');
    }
}

module.exports = CheckoutPage;
