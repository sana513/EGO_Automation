const CheckoutLocators = {
    /* ---------- PAGE ---------- */
    checkoutPageContainer: '[data-test="checkout-page-container"]',
    checkoutApp: '#checkout-app',

    /* ---------- CUSTOMER ---------- */
    customerStep: '[data-test="checkout-customer-info"]',
    emailInput: 'input[name="email"], #email',
    continueToShipping: '#checkout-customer-continue',
    signInButton: 'button:has-text("Sign in"), a:has-text("Sign in"), [data-test="customer-continue-button"]',
    passwordInput: 'input[name="password"]',

    /* ---------- SHIPPING ---------- */
    shippingStep: '[data-test="checkout-shipping"]',

    shipping: {
        firstNameInput: '#firstNameInput, [name="shippingAddress.firstName"], [data-test="firstNameInput-text"]',
        lastNameInput: '#lastNameInput, [name="shippingAddress.lastName"], [data-test="lastNameInput-text"]',
        addressLine1Input: '#addressLine1Input, [name="shippingAddress.address1"], [data-test="addressLine1Input-text"]',
        addressLine2Input: '#addressLine2Input, [name="shippingAddress.address2"], [data-test="addressLine2Input-text"]',
        cityInput: '#cityInput, [name="shippingAddress.city"], [data-test="cityInput-text"]',
        postCodeInput: '#postCodeInput, [name="shippingAddress.postalCode"], [data-test="postCodeInput-text"]',
        countrySelect: '#countryCodeInput, [name="shippingAddress.countryCode"], [data-test="countryCodeInput-select"]',
        provinceSelect: '#provinceInput, [name="shippingAddress.stateOrProvince"], [data-test="provinceInput-text"]',
        phoneInput: '#phoneInput, [name="shippingAddress.phone"], [data-test="phoneInput-text"]',
        /** Continue button (shipping form submit). <button id="checkout-shipping-continue" ...>Continue</button> */
        continueToShippingMethod: '#checkout-shipping-continue'
    },
    shippingContinueFallback: 'button:has-text("Continue"), button:has-text("CONTINUE")',
    shippingMethodOrContinue: '[data-test="checkout-shipping-method"], .shipping-method, #checkout-shipping-method-continue',
    shippingMethodRadio: '[data-test="checkout-shipping-method"] [role="radio"], .shipping-method, input[type="radio"]',
    savedAddress: '.address-item, [data-test="address-card"], .address-info',
    shippingError: '.message-error, .error-message, [role="alert"]',
    provinceSelectors: [
        '#provinceInput',
        'select[name="shippingAddress.stateOrProvince"]',
        'select[name="stateOrProvince"]',
        '#provinceInput, [name="shippingAddress.stateOrProvince"], [data-test="provinceInput-text"]',
        'input[name="shippingAddress.stateOrProvince"]',
        'input[data-test="provinceInput-text"]',
        'select[name="region_id"]',
        'select[name="region"]',
        'input[name="region"]',
        'select[id^="region_id"]',
        'select[name="county"]',
        'select[aria-label*="State" i]',
        'select[aria-label*="Province" i]',
        'select[aria-label*="County" i]'
    ],

    /* ---------- SHIPPING METHOD ---------- */
    shippingMethodStep: '[data-test="checkout-shipping-method"]',
    /** Selectors for picking a shipping option (try in order). */
    shippingMethodSelectors: [
        '[data-test="checkout-shipping-method"] [role="radio"]',
        '[data-test="checkout-shipping-method"] input[type="radio"]',
        '[data-test="shipping-method-radio"]',
        '[data-test="consignment-item"]',
        '[data-test="checkout-shipping-method"] label',
        '.shipping-method input[type="radio"]',
        '.consignment input[type="radio"]',
        '.shippingMethodOption',
        'input[name="shippingMethodId"]',
        'input[type="radio"][name*="shipping"]',
        'input[type="radio"][id*="shipping"]',
        '[data-test="checkout-shipping-method"] .form-field:has(input[type="radio"]) label',
        '.shipping-method'
    ],
    shippingMethodRadio: '[data-test="checkout-shipping-method"] [role="radio"], .shipping-method, input[type="radio"]',
    shippingMethodContinue: '#checkout-shipping-method-continue',
    shippingMethodContinueFallback: 'button:has-text("Continue"), button:has-text("CONTINUE")',
  
    /* ---------- PAYMENT ---------- */
    paymentStep: '[data-test="payment-form"]',
  
    payment: {
      payNowButton: '#checkout-payment-continue',
  
      /* Stripe / Hosted Fields */
      stripeIframe: 'iframe[name^="__privateStripeFrame"]',
  
      hostedFields: {
        cardNumberFrame: 'iframe[title="Secure card number input frame"]',
        cardExpiryFrame: 'iframe[title="Secure expiration date input frame"]',
        cardCvcFrame: 'iframe[title="Secure CVC input frame"]',
        cardNameFrame: 'iframe[title="Secure card name input frame"]'
      },
  
      hostedFieldInput: 'input',
  
      /* Payment methods */
      methods: {
        card: '[data-test="payment-method-credit_card"]',
        paypal: '[data-test="payment-method-paypalcommerce"]',
        klarna: '[data-test="payment-method-klarna"]',
        afterpay: '[data-test="payment-method-pay_by_installment"]',
        clearpay: '[data-test="payment-method-clearpay"]'
      }
    },
  
    /* ---------- CART ---------- */
    cart: '[data-test="cart"]',
    cartItem: '[data-test="cart-item"]',
    cartEditLink: '[data-test="cart-edit-link"]',
    cartSubtotal: '[data-test="cart-subtotal"]',
    cartShipping: '[data-test="cart-shipping"]',
    cartTotal: '[data-test="cart-total"]',
  
    /* ---------- HEADER ---------- */
    checkoutHeaderLogo: '.checkoutHeader-logo'
  };
  
  module.exports = { CheckoutLocators };
  