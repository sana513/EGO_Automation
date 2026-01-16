const { Given, When, Then } = require('@cucumber/cucumber');
const CheckoutPage = require('../../pages/checkoutPage');

When('I enter email {string} for checkout', async function (email) {
    this.checkoutPage = new CheckoutPage(this.page);
    await this.checkoutPage.enterEmail(email);
});

When('I continue to shipping', async function () {
    await this.checkoutPage.clickContinue();
});

When('I fill in shipping details', async function () {
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

When('I enter valid card details', async function () {
    await this.checkoutPage.fillCardDetails({
        number: '4242424242424242',
        expiry: '12/30',
        cvc: '123',
        name: 'John Doe'
    });
});

When('I click on Pay Now', async function () {
    await this.checkoutPage.clickPayNow();
});

Then('the order should be placed successfully', async function () {
    await this.checkoutPage.verifyOrderConfirmation();
});
