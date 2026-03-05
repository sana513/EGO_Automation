const PayByCardLocators = {
    checkoutComIframesContainer: '#checkoutcom-credit_card-ccNumber',
    bigCommerceIframes: 'iframe[src*="checkout/payment/hosted-field"]',
    bigCommerceInput: 'input',

    checkoutComIframes: {
        cardNumber: '#checkoutcom-credit_card-ccNumber iframe',
        cardName: '#checkoutcom-credit_card-ccName iframe',
        expiry: '#checkoutcom-credit_card-ccExpiry iframe',
        cvv: '#checkoutcom-credit_card-ccCvv iframe'
    },

    stripeIframe: 'iframe[name^="__privateStripeFrame"]',

    directCardInputs: {
        number: 'input[name="ccnumber"], [data-test="card-number-input"]',
        expiry: 'input[name="ccexp"], [data-test="card-expiry-input"]',
        cvc: 'input[name="cvv"], [data-test="card-cvc-input"]'
    }
};

module.exports = { PayByCardLocators };
