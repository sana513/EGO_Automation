const LoginLocators = {
  accountIcon: '[aria-label="Account"]',
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  submitButton: '[data-testid="submit-button"]',

  popups: {
    closeModalBtn: '[aria-label="Close Modal"]',
    declineOfferBtn: 'button:has-text("Decline offer")',
    button3: '#button3'
  },

  errorMessage: ".error-message, [role='alert'], .text-red-500",
  logoutIndicator: "text=Logout, [aria-label='Logout']"
};

const SignupLocators = {
  signupPage: {
    accountIcon: '[aria-label="Account"]',
    signupLink: 'span.underline.cursor-pointer',
    initialEmailInput: '[data-testid="email-input"]',
    continueButton: 'button:has-text("Continue")',
    firstName: '[data-testid="first-name-input"]',
    lastName: '[data-testid="last-name-input"]',
    password: '[data-testid="password-input"]',
    confirmPassword: '[data-testid="confirm-password-input"]',
    street: 'input[placeholder="Street Name"]',
    city: 'input[placeholder="City"]',
    postCode: 'input[placeholder="Post Code"]',
    addressLookup: 'input[placeholder="Start typing your address..."]',
    dob: {
      day: 'select[data-testid="select-input"]:nth-child(0)',
      month: 'select[data-testid="select-input"]:nth-child(1)',
      year: 'select[data-testid="select-input"]:nth-child(2)',
    },
    country: 'select[data-testid="country-select"]',
    enterAddressManually: 'text=Or Enter Your Address Manually',
    addressSuggestions: '[role="option"]',
    marketing: {
      email: 'input[data-testid="checkbox"]:nth-child(0)',
      text: 'input[data-testid="checkbox"]:nth-child(1)',
      post: 'input[data-testid="checkbox"]:nth-child(2)',
    },
    submitButton: 'button:has-text("Create Account")',
    errorMessage: '.error-message, [role="alert"]'
  }
};

const HomePageLocators = {
  LOGO: '[data-testid="logo"]',
  SEARCH_BAR: 'input[data-testid="input-field"][aria-label="Search"]:visible',
  USER_ICON: 'svg[id="Acount icon"]',
  CART_ICON: 'svg[id="Bag icon"]',
  STORE_SWITCHER: 'button[class*="store"], button:has-text("USD")',
  NAV_CATEGORY: (name) => `nav >> text="${name}"`, 
  WHATS_HOT_SECTION: '#whats-hot-section',
  PRODUCT_CARD: '.product-card',
  PRODUCT_NAME: '.product-card .product-name',
  PRODUCT_PRICE: '.product-card .product-price',
  ADD_BUTTON: '.product-card button:has-text("Add")',

  // Dynamic selectors
  getCategoryLink: (text) => `a[data-v-497370f6]:has-text("${text}")`,
  getProductByIndex: (index) => `[class*="product-card"]:nth(${index})`,
  getProductByName: (name) => `:has-text("${name}")`,
};
const AddToCartLocators = {
  Update_quantity : '[data-testid="cart-product-card-quantity-select"]',
  Update_size: '[data-testid="cart-product-card-size-select"]',
  Delete_Product: '[data-testid="cart-product-card-remove-button !align-top"]',
  Add_to_Wishlist: 'button[aria-label="Add to Wishlist"]',
  Applied_Coupon: 'input[data-testid="input-field"][aria-label="Discount Code"]',
  Submit_button: '[data-testid="button"][aria-label="Submit"]',
  Checkout_button: '[data-testid="go-to-checkout"]'
};

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
module.exports = {
  LoginLocators,
  SignupLocators,
  HomePageLocators,
  CheckoutLocators,
  AddToCartLocators
};
