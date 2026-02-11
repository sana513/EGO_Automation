const { Given, When, Then } = require('@cucumber/cucumber');
const CheckoutPage = require('../../pages/checkout/checkoutPage');
const GuestCheckoutPage = require('../../pages/checkout/guestCheckoutPage');
const CustomerCheckoutPage = require('../../pages/checkout/customerCheckoutPage');
const { testData } = require('../../config/testData');

When('I enter email for checkout', async function () {
    if (!this.guestCheckout) {
        this.guestCheckout = new GuestCheckoutPage(this.page);
    }
    if (!this.customerCheckout) {
        this.customerCheckout = new CustomerCheckoutPage(this.page);
    }
    
    await this.guestCheckout.enterEmail(testData.checkout.email);
});

When('I continue to shipping', async function () {
    this.isGuestFlow = true;
    await this.guestCheckout.clickContinueToShipping();
});

When('I fill in shipping details', async function () {
    const shippingData = this.guestCheckout.buildShippingData();
    await this.guestCheckout.fillShippingAddress(shippingData);
});

When('Select the shipping method', async function () {
    if (this.isGuestFlow) {
        await this.guestCheckout.selectShippingMethod();
    } else if (this.isCustomerFlow) {
        await this.customerCheckout.selectShippingMethod();
    }
});

When('Click on continue to payment', async function () {
    if (this.isGuestFlow) {
        await this.guestCheckout.continueToPayment();
    } else if (this.isCustomerFlow) {
        await this.customerCheckout.continueToPayment();
    }
});

When('select the saved address', async function () {
    await this.customerCheckout.selectSavedAddress();
});

When('I click on sign in', async function () {
    this.isCustomerFlow = true;
    await this.customerCheckout.clickSignIn();
});

When('I enter password for checkout', async function () {
    await this.customerCheckout.enterPassword(testData.checkout.password);
});

When('I enter valid card details', async function () {
    const cardDetails = {
        number: testData.checkout.payment.cardNumber,
        expiry: testData.checkout.payment.expiry,
        cvc: testData.checkout.payment.cvc,
        name: testData.checkout.payment.cardName
    };
    
    if (this.isGuestFlow) {
        await this.guestCheckout.fillCardDetails(cardDetails);
    } else if (this.isCustomerFlow) {
        await this.customerCheckout.fillCardDetails(cardDetails);
    }
});

When('I click on Pay Now', async function () {
    if (this.isGuestFlow) {
        await this.guestCheckout.clickPayNow();
    } else if (this.isCustomerFlow) {
        await this.customerCheckout.clickPayNow();
    }
});

Then('the order should be placed successfully', async function () {
    if (this.isGuestFlow) {
        await this.guestCheckout.verifyOrderConfirmation();
    } else if (this.isCustomerFlow) {
        await this.customerCheckout.verifyOrderConfirmation();
    }
});
