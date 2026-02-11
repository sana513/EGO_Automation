// ==============================
// ENV + GLOBAL CONSTANTS
// ==============================

const ENV = {
  CHECKOUT_EMAIL: process.env.CHECKOUT_EMAIL || "sana.zafar@rltsquare.com",
  CHECKOUT_PASSWORD: process.env.CHECKOUT_PASSWORD || "Sana@321",
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || "naveed.chughtai@rltsquare.com",
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || "Rlt@20250101",
  COUPON_CODE: process.env.COUPON_CODE || "R5D48EF48",
  PAYMENT_CARD_NUMBER: process.env.PAYMENT_CARD_NUMBER || "4242424242424242",
  PAYMENT_CVC: process.env.PAYMENT_CVC || "123"
};

const DEFAULT_USER = {
  firstName: "John",
  lastName: "Doe"
};

const DEFAULT_ADDRESS_US = {
  street: "123 Main Street",
  city: "New York",
  postCode: "10001",
  state: "NY",
  provinceCode: "NY",
  countryCode: "US"
};

// ==============================
// TIMEOUTS
// ==============================

const timeouts = {
  small: 2000,
  medium: 5000,
  large: 15000,
  xlarge: 25000,
  huge: 30000,
  extreme: 45000
};

// ==============================
// SEARCH
// ==============================

const search = {
  keywords: {
    valid: "dress",
    invalid: "nonexistentproductxyz",
    partial: "dres",
    suggestionTrigger: "dress",
    oos: "sold out",
    trending: "Trending",
    randomKeywords: [
      "dress", "tops", "shoes", "boots", "heels",
      "sandals", "accessories", "jewelry", "bikini", "skirt"
    ]
  },
  placeholder: "Search...",
  noResultsMessage: "Products Matching|0 STYLES",
  trendingHeader: "Trending Categories|Trending",
  outOfStockPattern: "Sold Out|Out of Stock"
};

// ==============================
// TEST DATA
// ==============================

const testData = {
  e2e: {
    registrationLocale: "uk",
    checkoutEmail: ENV.CHECKOUT_EMAIL,
    couponCode: ENV.COUPON_CODE
  },

  login: {
    email: ENV.TEST_USER_EMAIL,
    password: ENV.TEST_USER_PASSWORD
  },

  checkout: {
    email: ENV.CHECKOUT_EMAIL,
    password: ENV.CHECKOUT_PASSWORD,
    defaultLocale: "us",

    waitTimes: {
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
    },

    regex: {
      paymentPage: /\/checkout\/payment/i,
      shippingPage: /\/checkout\/shipping/i,
      cartPage: /\/cart/i,
      confirmationPage: /order-confirmation|thank-you|success/i,
      emailDomain: /@[\w.-]+\.[a-z]{2,}$/i
    },

    defaultProvinceInput: "NY",

    shipping: {
      ...DEFAULT_USER,
      ...DEFAULT_ADDRESS_US,
      addressLine1: DEFAULT_ADDRESS_US.street,
      addressLine2: "",
      phoneNumber: "1234567890"
    },

    payment: {
      cardNumber: ENV.PAYMENT_CARD_NUMBER,
      expiry: "12/30",
      cvc: ENV.PAYMENT_CVC,
      cardName: `${DEFAULT_USER.firstName} ${DEFAULT_USER.lastName}`
    },

    paymentMethods: {
      default: "card",
      card: "Card",
      paypal: "PayPal",
      klarna: "Klarna",
      testprovider: "Test Provider",
      bank: "Bank Transfer",
      afterpay: "Afterpay",
      clearpay: "Clearpay"
    },

    couponCode: ENV.COUPON_CODE,

    manualEntryLabels: [
      'button:has-text("Enter address manually")',
      'a:has-text("Enter address manually")',
      'button:has-text("Manual entry")',
      '[data-test="manual-address-entry"]',
      '.manual-address-link',
      'button:has-text("Enter manually")'
    ],

    stateMappings: {
      US: {
        NY: "New York",
        CA: "California",
        TX: "Texas",
        FL: "Florida",
        IL: "Illinois",
        PA: "Pennsylvania",
        OH: "Ohio",
        GA: "Georgia",
        NC: "North Carolina",
        MI: "Michigan"
      }
    },

    labels: {
      inputLabels: {
        firstName: "First Name",
        lastName: "Last Name",
        address1: "Address Line 1",
        address2: "Address Line 2",
        city: "City",
        postCode: "Post Code",
        country: "Country",
        phone: "Phone Number",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvc: "CVC"
      }
    },

    expectedTitles: {
      checkout: "Checkout - EGO",
      confirmation: "Order Confirmation - EGO"
    },

    stripeInputNames: {
      cardNumber: "cardnumber",
      expDate: "exp-date",
      cvc: "cvc"
    },

    confirmationUrlPattern: "order-confirmation|thank-you|success"
  },

  plp: {
    productLimit: 40,
    loadMoreTimeout: 20000,
    subCategoryFilter: "NEW IN",
    categoryUrlIdentifier: "/c/",
    productUrlIdentifier: "/p/",
    navigationTimeout: 5000,
    defaultProductIndex: 3
  },

  homepage: {
    preferredSizes: ["UK 6", "UK 7", "UK 5"],
    categories: ["CO_ORDS", "TOPS", "DRESSES", "LOUNGEWEAR"],
    categoryNames: {
      CO_ORDS: "Co-Ords",
      TOPS: "Tops",
      DRESSES: "Dresses",
      LOUNGEWEAR: "Loungewear"
    }
  },

  registration: {
    personalDetails: {
      firstName: "Naveed",
      lastName: "Chughtai",
      password: ENV.TEST_USER_PASSWORD,
      confirmPassword: ENV.TEST_USER_PASSWORD
    },
    dob: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    locales: {
      us: {
        country: "United States",
        phone: "2125551234",
        address: {
          street: "123 Main Street",
          city: "New York",
          postCode: "10001",
          state: "NY"
        }
      },
      uk: {
        country: "United Kingdom",
        phone: "07123456789",
        address: {
          street: "10 High Street",
          city: "London",
          postCode: "SW1A 1AA"
        }
      },
      au: {
        country: "Australia",
        phone: "0412345678",
        address: {
          street: "1 George Street",
          city: "Sydney",
          postCode: "2000",
          state: "New South Wales"
        }
      }
    }
  },

  pdp: {
    labels: {
      selectSize: "Select a Size",
      notifyMe: "Notify Me",
      addToBag: "Add to Bag"
    }
  },

  cart: {
    labels: {
      outOfStock: "out of stock"
    },
    couponCode: ENV.COUPON_CODE
  },

  timeouts,
  search
};

module.exports = { testData };
