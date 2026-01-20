const testData = {
    login: {
        email: process.env.TEST_USER_EMAIL || "naveed.chughtai@rltsquare.com",
        password: process.env.TEST_USER_PASSWORD || "Rlt@20250101"
    },
    checkout: {
        email: process.env.CHECKOUT_EMAIL || "sana.zafar@rltsquare.com",
        shipping: {
            firstName: "John",
            lastName: "Doe",
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "New York",
            postCode: "10001",
            countryCode: "US",
            province: "NY",
            phoneNumber: "1234567890"
        },
        payment: {
            cardNumber: process.env.PAYMENT_CARD_NUMBER || "4242424242424242",
            expiry: "12/30",
            cvc: process.env.PAYMENT_CVC || "123",
            cardName: "John Doe"
        },
        couponCode: process.env.COUPON_CODE || "R5D48EF48",
        expectedTitles: {
            checkout: "Checkout - EGO",
            confirmation: "Order Confirmation - EGO"
        },
        manualEntryLabels: [
            'button:has-text("Enter address manually")',
            'a:has-text("Enter address manually")',
            'span:has-text("Enter address manually")',
            'text=Or Enter Your Address Manually'
        ]
    },
    plp: {
        productLimit: 40,
        loadMoreTimeout: 20000,
        subCategoryFilter: "NEW IN",
        categoryUrlIdentifier: "/c/",
        productUrlIdentifier: "/p/",
        navigationTimeout: 5000,
        defaultProductIndex: 3,
        subCategoryFilterIgnore: "NEW IN"
    },
    homepage: {
        preferredSizes: ["UK 6", "UK 7", "UK 5"],
        categories: ["CO_ORDS", "TOPS", "DRESSES", "LOUNGEWEAR"],
        categoryNames: {
            "CO_ORDS": "Co-Ords",
            "TOPS": "Tops",
            "DRESSES": "Dresses",
            "LOUNGEWEAR": "Loungewear"
        }
    },
    registration: {
        personalDetails: {
            firstName: "Naveed",
            lastName: "Chughtai",
            password: process.env.TEST_USER_PASSWORD || "Rlt@20250101",
            confirmPassword: process.env.TEST_USER_PASSWORD || "Rlt@20250101"
        },
        dob: {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        },
        locales: {
            uk: {
                country: "United Kingdom",
                phone: "7400123456",
                address: {
                    street: "Longford Trading Estate",
                    city: "Manchester",
                    postCode: "M32 0JT"
                }
            },
            eu: {
                country: "Ireland",
                phone: "871234567",
                address: {
                    street: "123 Dublin St",
                    city: "Dublin",
                    postCode: "D01 A1B2"
                }
            },
            us: {
                country: "United States",
                phone: "2125551234",
                address: {
                    street: "123 New York St",
                    city: "New York",
                    postCode: "10001"
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
        couponCode: process.env.COUPON_CODE || "R5D48EF48"
    },
    timeouts: {
        small: 2000,
        medium: 5000,
        large: 10000,
        xlarge: 15000,
        huge: 20000,
        extreme: 30000
    }
};

module.exports = { testData };
