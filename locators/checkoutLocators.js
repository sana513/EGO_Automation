const CheckoutLocators = {
    emailInput: 'input[name="email"]',
    continueButton: '#checkout-customer-continue',
    shipping: {
        firstNameInput: '#firstNameInput',
        lastNameInput: '#lastNameInput',
        addressLine1Input: '#addressLine1Input',
        addressLine2Input: '#addressLine2Input',
        cityInput: '#cityInput',
        postCodeInput: '#postCodeInput',
        countryCodeSelect: '#countryCodeInput',
        provinceSelect: '#provinceInput',
        phoneInput: '#phoneInput',
        shippingContinueButton: '#checkout-shipping-continue',
    },
    payment: {
        stripeIframe: 'iframe[name^="__privateStripeFrame"]',
        cardNumberInput: '#card-number',
        cardExpiryInput: '#card-expiry',
        cardCvcInput: '#card-cvc',
        cardNameInput: '#card-name',
        payNowButton: '#checkout-payment-continue'
    }
};

module.exports = { CheckoutLocators };
