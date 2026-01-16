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
  HERO_BANNER: '//*[@id="splide01-slide01"]/div',
  PRODUCT_GRID_MAIN: 'div[title="Shop By Trend"][heading="Shop By Trend"]',
  CATEGORY_CARDS: {
    CO_ORDS: '.item a[href*="co-ords"]',
    TOPS: '.item a[href*="/c/clothing/tops"]',
    DRESSES: '.item a[href*="/c/clothing/dresses"]',
    LOUNGEWEAR: '.item a[href*="loungwear-co-ords"]'
  },
  POPULAR_CATEGORY_HEADING: 'h2:has-text("Popular Categories")',
  WHATS_HOT_HEADING: 'h2:has-text("What\'s Hot!")',
  WHATS_HOT_SECTION: 'section:has(h2:has-text("What\'s Hot!"))',
  WHATS_HOT_ADD_BUTTONS:
    'button[data-testid="quick-add-button"]',
  SIZE_CONTAINER: 'div.flex.flex-col.h-full.overflow-y-auto',
  SIZE_OPTIONS:
    'div.flex.flex-col.h-full.overflow-y-auto ul li > button',
  ADD_TO_BAG_BUTTON: 'button:has-text("Add to Bag")',
  SIZE_BY_TEXT: (size) =>
    `div.flex.flex-col.h-full.overflow-y-auto ul li > button:has(span:text("${size}"))`,
};
const PLPLocators = {
  pageTitle: 'h1',
  pageDescription: '.catalog-page-content p, h1 + div',
  productTile: '[data-testid="product-card-vertical"]',
  productTitle: 'a[data-testid="link"] span',
  productPrice: '[data-testid="special-price"], [data-testid="regular-price"]',
  productImage: 'img[data-testid="image-slot"]',
  wishlistIcon: 'button[aria-label="Add to Wishlist"]',
  loadMoreButton: '[data-testid="pagination-next"]',
  mainCategoryLinks: 'a.trigger-nav-level-1',
  subCategoryLinks: 'a.capitalize',
};


const AddToCartLocators = {
  Update_quantity: '[data-testid="cart-product-card-quantity-select"]',
  Update_size: '[data-testid="cart-product-card-size-select"]',
  Delete_Product: '[data-testid="cart-product-card-remove-button !align-top"]',
  Add_to_Wishlist: 'button[aria-label="Add to Wishlist"]',
  Coupon_Input: 'input#discont-field[data-testid="input-field"]',
  Submit_button: '[data-testid="button"][aria-label="Submit"]',
  Checkout_button: '[data-testid="go-to-checkout"][aria-label="Go to Checkout"]'
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
const CommonLocators = {
  modals: {
    closeButtons: [
      'button[aria-label="Close Modal"]',
      'button:has-text("Decline offer")',
      '#button3',
      'button[aria-label="Close"]',
      '.fb_lightbox button.close',
      '[class*="close-button"]',
      '.fb_lightbox-overlay',
      '.preloaded_lightbox [aria-label="Close"]'
    ],
    overlays: [
      '[id*="lightbox"]',
      '[class*="lightbox"]',
      '[class*="overlay-fixed"]',
      '[id*="sidebar-overlay"]',
      '.fb_lightbox',
      '.fb_lightbox-overlay'
    ]
  },
  cookieConsent: {
    acceptButtons: [
      '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
      '#CybotCookiebotDialogBodyButtonAccept',
      '#CybotCookiebotDialogBodyLevelButtonAccept',
      'a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
      'button:has-text("Accept All")',
      'button:has-text("Accept all")',
      'button:has-text("Allow All")',
      'button:has-text("Allow all")',
      '#onetrust-accept-btn-handler',
      'button#accept-recommended-btn-handler',
      'button[id*="cookie"][id*="accept"]',
      'button[class*="cookie"][class*="accept"]',
      'button[aria-label*="Accept"]',
      'button[aria-label*="cookie"]',
      'button:has-text("Decline")',
      'a:has-text("Decline")'
    ],
    overlays: [
      '#CybotCookiebotDialog',
      '#CybotCookiebotDialogBodyUnderlay',
      '[id*="cookie"][id*="overlay"]',
      '[class*="cookie"][class*="overlay"]',
      '[id*="CookieConsent"]',
      '.cookie-banner',
      '.cookie-consent'
    ]
  }
};

module.exports = {
  LoginLocators,
  SignupLocators,
  HomePageLocators,
  CheckoutLocators,
  PLPLocators,
  AddToCartLocators,
  CommonLocators
};
