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
    await this.checkoutPage.fillShippingAddress(testData.checkout.shipping);
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
