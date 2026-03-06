// ==============================
// EGO — CENTRALIZED UI LABELS
// ==============================

// ---------- CHECKOUT AUTH ----------
const checkoutAuthLabels = {
    guestButtonText: 'CHECKOUT AS A GUEST',
    signInButtonText: 'SIGN IN AND CHECKOUT'
};

// ---------- PDP ----------
const pdpLabels = {
    selectSize: 'Select a Size',
    notifyMe: 'Notify Me',
    addToBag: 'Add to Bag',
    soldOut: 'sold out',
    outOfStock: 'out of stock',
    itemOOS: 'Item Out Of Stock',
    addAllToBag: 'ADD ALL TO BAG'
};

// ---------- CHECKOUT ----------
const checkoutLabels = {
    manualEntryLabels: [
        'button:has-text("Enter address manually")',
        'a:has-text("Enter address manually")',
        'button:has-text("Manual entry")',
        '[data-test="manual-address-entry"]',
        '.manual-address-link',
        'button:has-text("Enter manually")'
    ],
    inputLabels: {
        firstName: "First Name",
        lastName: "Last Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        city: "City",
        postCode: "Post Code",
        country: "Country",
        phoneNumber: "Phone Number",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvc: "CVC",
        nameOnCard: "Name on Card",
        expiration: "Expiration",
        cvvStrict: "CVV"
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
    expectedTitles: {
        checkout: "Checkout - EGO",
        confirmation: "Order Confirmation - EGO"
    },
    threeDSecure: {
        urlKeywords: ['authentication', '3ds', '3dsecure'],
        titleKeywords: ['3DS', 'Authentication', 'Challenge'],
        secureCode: 'Checkout1!'
    },
    bigCommerceFieldPatterns: {
        number: ['cardNumber', 'cc-number', 'number'],
        expiry: ['expir', 'expiry', 'mm'],
        cvv: ['cvv', 'cvc', 'security'],
        name: ['cardholder', 'name']
    }
};

// ---------- SEARCH ----------
const searchLabels = {
    placeholder: "Search...",
    noResultsMessage: "Products Matching|0 STYLES",
    trendingHeader: "Trending Categories|Trending",
    outOfStockPattern: "Sold Out|Out of Stock",
    noResultsPatterns: {
        zeroStyles: "0 styles",
        noProducts: "no products"
    }
};

// ---------- HOMEPAGE ----------
const homepageLabels = {
    categoryNames: {
        CO_ORDS: "Co-Ords",
        TOPS: "Tops",
        DRESSES: "Dresses",
        LOUNGEWEAR: "Loungewear"
    }
};

// ---------- CART ----------
const cartLabels = {
    outOfStock: "out of stock"
};

// ---------- REGISTRATION ----------
const registrationLabels = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    countries: {
        us: "United States",
        uk: "United Kingdom",
        au: "Australia",
        eu: "Belgium"
    },
    fields: {
        email: "Email",
        firstName: "First Name",
        lastName: "Last Name",
        password: "Password",
        confirmPassword: "Confirm Password",
        street: "Street",
        city: "City",
        postCode: "Post Code",
        state: "State"
    },
    urls: {
        signupFragment: "/signup"
    }
};

// ---------- LOGIN ----------
const loginLabels = {
    locales: {
        uk: 'uk',
        eu: 'eu',
        au: 'au',
        us: 'us'
    },
    urls: {
        myAccount: '**/my-account/**'
    }
};

// ---------- ADD TO CART ----------
const addToCartLabels = {
    outOfStock: 'out of stock'
};

// ---------- PLP ----------
const plpLabels = {
    subCategoryFilterIgnore: /view all|shop all/i
};

module.exports = {
    checkoutAuthLabels,
    pdpLabels,
    checkoutLabels,
    searchLabels,
    homepageLabels,
    cartLabels,
    registrationLabels,
    loginLabels,
    addToCartLabels,
    plpLabels
};
