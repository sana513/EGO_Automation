const { Given, When, Then } = require('@cucumber/cucumber');
const CheckoutPage = require('../../pages/checkoutPage');
const { testData } = require('../../config/testData');

When('I enter email for checkout', async function () {
    this.checkoutPage = new CheckoutPage(this.page);
    await this.checkoutPage.enterEmail(testData.checkout.email);
});

When('I enter email {string} for checkout', async function (email) {
    this.checkoutPage = new CheckoutPage(this.page);
    await this.checkoutPage.enterEmail(email);
});

When('I continue to shipping', async function () {
    await this.checkoutPage.clickContinue();
});

When('I fill in shipping details', async function () {
    const locale = this.config.locale || 'us';
    const addressData = testData.registration.locales[locale] || testData.registration.locales['us'];

    // Map registration address structure to checkout shipping structure
    const shippingData = {
        firstName: testData.checkout.shipping.firstName,
        lastName: testData.checkout.shipping.lastName,
        addressLine1: addressData.address.street,
        addressLine2: "",
        city: addressData.address.city,
        postCode: addressData.address.postCode,
        countryCode: addressData.countryCode || "US",
        province: addressData.address.state || addressData.address.city, // Fallback if no state
        phoneNumber: addressData.phone
    };

    console.log(`[DEBUG] Shipping Data: ${JSON.stringify(shippingData)}`);

    await this.checkoutPage.fillShippingAddress(shippingData);
});

When('Select the shipping method', async function () {
    await this.checkoutPage.selectShippingMethod();
});

When('Click on continue to payment', async function () {
    await this.checkoutPage.continueToPayment();
});

When('select the saved address', async function () {
    await this.checkoutPage.selectSavedAddress();
});

When('I click on sign in', async function () {
    await this.checkoutPage.clickSignIn();
});

When('I enter password for checkout', async function () {
    await this.checkoutPage.enterPassword(testData.login.password);
});

When('I enter valid card details', async function () {
    await this.checkoutPage.fillCardDetails({
        number: testData.checkout.payment.cardNumber,
        expiry: testData.checkout.payment.expiry,
        cvc: testData.checkout.payment.cvc,
        name: testData.checkout.payment.cardName
    });
});

When('I click on Pay Now', async function () {
    await this.checkoutPage.clickPayNow();
});

Then('the order should be placed successfully', async function () {
    await this.checkoutPage.verifyOrderConfirmation();
});
