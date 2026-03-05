// ==============================
// GLOBAL WAIT TIMES
// ==============================

const WAIT_TIMES = {
  QUICK: 500,
  SHORT: 1000,
  MEDIUM: 2000,
  LONG: 3000,
  FORM_SUBMIT: 2000,
  PROVINCE_LOAD: 3000,
  COUNTRY_CHANGE: 4000,
  PAYMENT_LOAD: 5000,
  NETWORK_IDLE: 10000
};

// ==============================
// TIMEOUTS (from testData.timeouts)
// ==============================

const TIMEOUTS = {
  small: 2000,
  medium: 5000,
  large: 15000,
  xlarge: 25000,
  huge: 30000,
  extreme: 45000
};

// ==============================
// CHECKOUT WAIT TIMES
// ==============================

const CHECKOUT_WAIT_TIMES = {
  networkIdle: 20000,
  emailEntry: 3000,
  shippingFormLoad: 2000,
  manualAddressExpand: 2000,
  fieldBlur: 1000,
  countryChange: 3000,
  provinceStabilize: 4000,
  provinceOptionsLoad: 2000,
  provinceDropdownClick: 2000,
  provinceSelection: 2500,
  provinceInputFill: 1500,
  shippingContinue: 2000,
  shippingMethodLoad: 3000,
  shippingMethodSelection: 1500,
  paymentStepLoad: 3000,
  paymentFormLoad: 5000,
  modalClose: 1000,
  signIn: 5000,
  passwordEntry: 3000,
  authentication: 15000,
  addressSuggestionsLoad: 2500,
  addressSuggestionSelect: 3000,
  autofillWait: 1000,
  buttonPollInterval: 2000
};

// ==============================
// CHECKOUT AUTH TIMEOUTS
// ==============================

const CHECKOUT_AUTH_TIMEOUTS = {
  authPageCheck: 3000,
  inputVisible: 5000,
  buttonEnabled: 5000,
  settle: 500,
  urlNavigation: 15000,
  networkIdle: 15000,
  postNavigationSettle: 3000,
  signInSettle: 2000
};

// ==============================
// PDP WAIT TIMES
// ==============================

const PDP_WAIT_TIMES = {
  productSettle: 1500,
  backNavSettle: 1000,
  networkSettle: 6000,
  addToBagSettle: 400,
  cartSettle: 200,
  productVisible: 8000,
  sizeVisible: 5000,
  cartClick: 5000
};

// ==============================
// REGISTRATION WAIT TIMES
// ==============================

const REGISTRATION_WAIT_TIMES = {
  cookieSettle: 500,
  formSettle: 300,
  navigationTimeout: 10000,
  addressSuggestionTimeout: 3000
};

// ==============================
// RETRY CONFIG
// ==============================

const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY_BETWEEN_RETRIES: 500
};

// ==============================
// VIEWPORT
// ==============================

const VIEWPORT = {
  DESKTOP: { width: 1440, height: 900 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 }
};

// ==============================
// BROWSER CONFIG
// ==============================

const BROWSER_CONFIG = {
  SLOW_MO: 50,
  DEFAULT_TIMEOUT: 30000
};

module.exports = {
  WAIT_TIMES,
  TIMEOUTS,
  CHECKOUT_WAIT_TIMES,
  CHECKOUT_AUTH_TIMEOUTS,
  PDP_WAIT_TIMES,
  REGISTRATION_WAIT_TIMES,
  RETRY_CONFIG,
  VIEWPORT,
  BROWSER_CONFIG
};
