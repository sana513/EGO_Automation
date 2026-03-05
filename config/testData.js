const { TIMEOUTS, CHECKOUT_WAIT_TIMES } = require('./constants');
const { checkoutLabels, searchLabels, homepageLabels, cartLabels, registrationLabels, pdpLabels } = require('./egoLabels');
const { checkoutLogs, guestCheckoutLogs } = require('./egoLogs');

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

const ADDRESSES = {
  US: {
    street: "123 Main Street",
    city: "New York",
    postCode: "10001",
    state: "NY",
    provinceCode: "NY",
    countryCode: "US",
    phone: "2125551234"
  },
  UK: {
    street: "10 Downing Street",
    city: "London",
    postCode: "SW1A 2AA",
    state: "",
    provinceCode: "",
    countryCode: "GB",
    phone: "02079251234"
  },
  EU: {
    street: "Rue de la Loi 175",
    city: "Brussels",
    postCode: "1040",
    state: "",
    provinceCode: "",
    countryCode: "BE",
    phone: "025551234"
  },
  CA: {
    street: "123 Maple Street",
    city: "Toronto",
    postCode: "M5H 2N2",
    state: "ON",
    provinceCode: "ON",
    countryCode: "CA",
    phone: "4165551234"
  },
  AU: {
    street: "123 George Street",
    city: "Sydney",
    postCode: "2000",
    state: "NSW",
    provinceCode: "NSW",
    countryCode: "AU",
    phone: "0291234567"
  }
};
const DEFAULT_ADDRESS_US = ADDRESSES.US;


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
  ...searchLabels
};

// ==============================
// TEST DATA
// ==============================

const testData = {
  timeouts: TIMEOUTS,
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
    couponCode: ENV.COUPON_CODE,

    defaultProvinceInput: "NY",

    regex: {
      paymentPage: /\/checkout\/payment/i,
      shippingPage: /\/checkout\/shipping/i,
      cartPage: /\/cart/i,
      confirmationPage: /order-confirmation|thank-you|success/i,
      emailDomain: /@[\w.-]+\.[a-z]{2,}$/i
    },

    shipping: {
      ...DEFAULT_USER,
      ...DEFAULT_ADDRESS_US,
      addressLine1: DEFAULT_ADDRESS_US.street,
      addressLine2: "",
      phoneNumber: DEFAULT_ADDRESS_US.phone
    },

    payment: {
      cardNumber: ENV.PAYMENT_CARD_NUMBER,
      expiry: "12/30",
      cvc: ENV.PAYMENT_CVC,
      cardName: `${DEFAULT_USER.firstName} ${DEFAULT_USER.lastName}`
    },

    paymentMethods: checkoutLabels.paymentMethods,

    manualEntryLabels: checkoutLabels.manualEntryLabels,

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
      inputLabels: checkoutLabels.inputLabels
    },

    expectedTitles: checkoutLabels.expectedTitles,

    stripeInputNames: {
      cardNumber: "cardnumber",
      expDate: "exp-date",
      cvc: "cvc"
    },

    logs: checkoutLogs,

    guestCheckout: {
      logs: guestCheckoutLogs
    }
  },

  checkoutAuth: {
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
    categoryNames: homepageLabels.categoryNames
  },

  registration: {
    personalDetails: {
      firstName: "Naveed",
      lastName: "Chughtai",
      password: ENV.TEST_USER_PASSWORD,
      confirmPassword: ENV.TEST_USER_PASSWORD
    },
    dob: {
      months: registrationLabels.months
    },
    locales: {
      us: {
        country: registrationLabels.countries.us,
        phone: "2125551234",
        address: {
          street: "123 Main Street",
          city: "New York",
          postCode: "10001",
          state: "NY"
        }
      },
      uk: {
        country: registrationLabels.countries.uk,
        phone: "07123456789",
        address: {
          street: "10 High Street",
          city: "London",
          postCode: "SW1A 1AA"
        }
      },
      au: {
        country: registrationLabels.countries.au,
        phone: "0412345678",
        address: {
          street: "1 George Street",
          city: "Sydney",
          postCode: "2000",
          state: "New South Wales"
        }
      },
      eu: {
        country: registrationLabels.countries.eu,
        phone: "0470123456",
        address: {
          street: "Rue de la Loi 175",
          city: "Brussels",
          postCode: "1040"
        }
      }
    }
  },

  pdp: {
    maxCategoryRetries: 2,
    maxProductRetries: 5,
    maxSearchRetries: 3,
    maxSearchIndex: 5,
    oosMessages: ['out of stock', 'sold out', 'currently unavailable', 'not available', 'please select another']
  },

  cart: {
    labels: cartLabels,
    couponCode: ENV.COUPON_CODE
  },

  search
};

/**
 * Get shipping address data for a specific locale
 * @param {string} locale - Locale code (US, UK, EU, CA, AU)
 * @returns {Object} Address data for the locale
 */
function getAddressByLocale(locale = 'US') {
  const localeUpper = locale.toUpperCase();
  return ADDRESSES[localeUpper] || ADDRESSES.US;
}

module.exports = {
  testData,
  ADDRESSES,
  getAddressByLocale
};
