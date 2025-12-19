const { Given, When, Then } = require('@cucumber/cucumber');
const CheckoutPage = require('../../pages/checkoutPage');

Given('the user is on the checkout page', async function () {
    this.checkoutPage = new CheckoutPage(this.page);
    await this.checkoutPage.navigateToCheckoutPage();
    await this.checkoutPage.verifyCheckoutPage();
});

When('the user enters a valid email', async function () {
    await this.checkoutPage.enterEmail('sana.zafar@rltsquare.com');
});

When('continues to shipping', async function () {
    await this.checkoutPage.clickContinue();
});

When('fills in shipping details', async function () {
    await this.checkoutPage.fillShippingAddress({
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        postCode: '10001',
        countryCode: 'US',
        province: 'NY',
        phoneNumber: '1234567890'
    });
});

When('enters valid card details', async function () {
    await this.checkoutPage.fillCardDetails({
        number: '4242424242424242',
        expiry: '12/30',
        cvc: '123',
        name: 'John Doe'
    });
});

When('clicks on Pay Now', async function () {
    await this.checkoutPage.clickPayNow();
});

Then('the order should be placed successfully', async function () {
    await this.checkoutPage.verifyOrderConfirmation();
});
