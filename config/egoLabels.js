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
    outOfStock: 'out of stock'
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
    outOfStockPattern: "Sold Out|Out of Stock"
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
    }
};

module.exports = {
    checkoutAuthLabels,
    pdpLabels,
    checkoutLabels,
    searchLabels,
    homepageLabels,
    cartLabels,
    registrationLabels
};
