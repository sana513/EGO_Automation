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
  savedAddress: '[data-test="shipping-address-card"], .address-info',

  /* ---------- CHECKOUT AUTHENTICATION ---------- */
  checkoutAuthPage: 'h2:has-text("CHECKOUT AS A GUEST"), h2:has-text("SIGN IN AND CHECKOUT")',

  // Guest checkout form (left side)
  guestCheckoutSection: 'h2:has-text("CHECKOUT AS A GUEST")',
  checkoutAsGuestButton: 'button[type="submit"]:has-text("CHECKOUT AS A GUEST")',
  checkoutAsGuestEmailInput: 'h2:has-text("CHECKOUT AS A GUEST") ~ form input[data-testid="email-input"]',

  // Sign in form (right side)
  signInSection: 'h2:has-text("SIGN IN AND CHECKOUT")',
  signInAndCheckoutButton: 'button[type="submit"]:has-text("SIGN IN AND CHECKOUT")',
  signInEmailInput: 'h2:has-text("SIGN IN AND CHECKOUT") ~ form input[data-testid="email-input"]',
  signInPasswordInput: 'h2:has-text("SIGN IN AND CHECKOUT") ~ form input[data-testid="input-field"][type="password"]',

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
  paymentStep: '[data-test="checkout-payment"]',
  termsCheckbox: '#terms, input[name="terms"][type="checkbox"]',
  payNowButton: '[data-test="checkout-payment-continue"], button[type="submit"]:has-text("Pay Now"), #checkout-payment-continue, button[type="submit"]:has-text("Place Order"), button.optimizedCheckout-buttonPrimary',

  payment: {
    methods: {
      card: '[data-test="payment-method-credit_card"]',
      paypal: '[data-test="payment-method-paypalcommerce"]',
      klarna: '[data-test="payment-method-klarna"]',
      afterpay: '[data-test="payment-method-pay_by_installment"]',
      clearpay: '[data-test="payment-method-clearpay"]'
    }
  },

  threeDSecure: {
    iframes: [
      'iframe[name="cko-3ds2-iframe"]',
      'iframe[id="cko-3ds2-challenge-iframe"]',
      'iframe.challengeIframe',
      'iframe[name*="3ds"]',
      'iframe[id*="3ds"]'
    ],
    inputs: [
      'input[type="password"]',
      'input[name="password"]',
      'input[id*="password" i]',
      'input[placeholder*="password" i]',
      'input[placeholder*="code" i]',
      'input[name*="code" i]',
      'input[id*="code" i]',
      'input[type="text"]'
    ],
    submitButtons: [
      'button[type="submit"]',
      'button:has-text("Submit")',
      'button:has-text("Continue")',
      'input[type="submit"]',
      'button:has-text("Verify")',
      'button'
    ]
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
