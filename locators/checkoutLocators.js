const CheckoutLocators = {
  /* ---------- PAGE ---------- */
  checkoutPageContainer: '[data-test="checkout-page-container"]',
  checkoutApp: '#checkout-app',

  /* ---------- CUSTOMER ---------- */
  customerStep: '[data-test="checkout-customer-info"]',
  emailInput: '[data-test="customer-email-input"], #email',
  continueToShipping: '[data-test="customer-continue-as-guest-button"], #checkout-customer-continue',
  signInButton: '[data-test="customer-continue-button"], button:has-text("Sign in")',
  passwordInput: '[data-test="customer-password-input"], input[name="password"]',

  /* ---------- SHIPPING ---------- */
  shippingStep: '[data-test="checkout-shipping"]',

  shipping: {
    manualAddressLink: '[data-test="manual-address-link"], button:has-text("Enter address manually")',
    firstNameInput: '[data-test="firstNameInput-text"]',
    lastNameInput: '[data-test="lastNameInput-text"]',
    addressLine1Input: '[data-test="addressLine1Input-text"]',
    addressLine2Input: '[data-test="addressLine2Input-text"]',
    cityInput: '[data-test="cityInput-text"]',
    postCodeInput: '[data-test="postCodeInput-text"]',
    countrySelect: '[data-test="countryCodeInput-select"]',
    provinceSelect: '[data-test="provinceInput-text"], #provinceInput',
    phoneInput: '[data-test="phoneInput-text"]',
    continueToShippingMethod: '[data-test="checkout-shipping-continue"], #checkout-shipping-continue, button[type="submit"]:has-text("Continue"), .form-actions button[type="submit"]'
  },

  shippingError: '[data-test="checkout-shipping-error"], .message-error, [role="alert"]',

  provinceSelectors: [
    '#provinceCodeInput',
    '[data-test="provinceCodeInput-select"]',
    '[data-test="provinceInput-text"]',
    '#provinceInput',
    'select[name="shippingAddress.stateOrProvince"]',
    'select[aria-label*="State" i]',
    'select[aria-label*="Province" i]'
  ],

  shippingFormSelectors: [
    '[data-test="firstNameInput-text"]',
    '[data-test="checkout-shipping"]',
    '.checkout-step--shipping'
  ],

  /* ---------- SHIPPING METHOD ---------- */
  shippingMethodStep: '[data-test="checkout-shipping-method"]',
  shippingMethodRadio: '[data-test="checkout-shipping-method"] [role="radio"], .shipping-method, input[type="radio"]',
  shippingMethodContinue: '[data-test="checkout-shipping-method-continue"], #checkout-shipping-method-continue, .form-actions button.optimizedCheckout-buttonPrimary[type="submit"], button.button--primary:has-text("Continue"), button[type="submit"]:has-text("Continue")',

  /* ---------- PAYMENT ---------- */
  paymentStep: '[data-test="payment-form"]',

  payment: {
    payNowButton: '[data-test="checkout-payment-continue"], #checkout-payment-continue, button[type="submit"]:has-text("Place Order"), button[type="submit"]:has-text("Pay Now"), button.optimizedCheckout-buttonPrimary',

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
    },

    methods: {
      card: '[data-test="payment-method-credit_card"]',
      paypal: '[data-test="payment-method-paypalcommerce"]',
      klarna: '[data-test="payment-method-klarna"]',
      afterpay: '[data-test="payment-method-pay_by_installment"]',
      clearpay: '[data-test="payment-method-clearpay"]'
    }
  },

  /* ---------- UTILITY ---------- */
  modalCloseSelectors: [
    '[data-test="modal-close"]',
    '.modal-header .close',
    'button.close'
  ],

  addressAutocomplete: {
    container: '[data-test="address-autocomplete"], .pac-container, .suggestions-container',
    item: '[data-test="address-autocomplete-item"], .pac-item, .suggestion-item'
  },

  /* ---------- CART ---------- */
  cart: '[data-test="cart"]',
  cartItem: '[data-test="cart-item"]',
  cartTotal: '[data-test="cart-total"]',

  /* ---------- HEADER ---------- */
  checkoutHeaderLogo: '.checkoutHeader-logo'
};

module.exports = { CheckoutLocators };
