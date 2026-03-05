// ==============================
// EGO — CENTRALIZED LOG MESSAGES
// ==============================

// ---------- CHECKOUT AUTH ----------
const checkoutAuthLogs = {
    proceedingAsGuest: 'Checkout Authentication Page: Proceeding as guest',
    enteredEmail: 'Entered email:',
    clickedGuestButton: '✓ Clicked "CHECKOUT AS A GUEST" button',
    urlNotChanged: 'Warning: URL did not change to checkout',
    networkNotIdle: 'Network not idle, continuing anyway',
    navigatedToCheckout: '✓ Successfully navigated to checkout page',
    finalUrl: 'Final URL:',
    signingIn: 'Checkout Authentication Page: Signing in',
    enteredPassword: 'Entered password',
    clickedSignInButton: '✓ Clicked "SIGN IN AND CHECKOUT" button',
    signInSuccess: '✓ Successfully signed in and navigated to checkout'
};

// ---------- PDP ----------
const pdpLogs = {
    categoryAttempt: 'Category Attempt',
    productAttempt: 'Product Attempt in current category',
    productAvailable: 'Product is available and ready.',
    productUnavailable: 'Product unavailable. Going back to PLP...',
    noCategoryProducts: 'No available products found in this category. Trying different category...',
    searchAttempt: 'Search Product Attempt',
    searchProductAvailable: 'Product from search is available.',
    searchProductOOS: 'Product from search is Out of Stock. Retrying...',
    checkingAvailability: 'Checking product availability...',
    foundOOSMessage: 'Found OOS message:',
    noButtonsAppeared: 'Neither size selector nor Add to Bag button appeared.',
    productOOSButton: 'Product is OOS. Button text:',
    productInStock: 'Product appears to be in stock',
    startingSizeSelection: 'Starting size selection...',
    oneSizeProduct: "No size selector found, but 'Add to Bag' is visible. Assuming One Size product.",
    sizeNotFound: "Size selector not found and 'Add to Bag' is also not visible.",
    clickedSelectSize: "Clicked 'Select a Size' button",
    noAvailableSizes: 'No available sizes found in the dropdown.',
    noAvailableSizeError: 'No available size found (all sizes are "Notify Me" or disabled)',
    selectedSize: 'Selected size:',
    failedFindProduct: 'Failed to find an available product after',
    failedSearchProduct: 'Failed to find an available search product after'
};

// ---------- CHECKOUT ----------
const checkoutLogs = {
    startCardEntry: "Starting card details entry...",
    usingCheckoutCom: "Using Checkout.com payment iframes",
    usingBigCommerce: "Using BigCommerce hosted fields payment method",
    usingStripe: "Using Stripe iframe payment method",
    usingDirectCard: "Using direct card input method",
    noPaymentFields: "No payment fields found on the page",
    cardNumberFilled: "Card number filled",
    cardNameFilled: "Cardholder name filled",
    expiryFilled: "Expiry date filled",
    cvvFilled: "CVV filled",
    bigCommerceFilled: "BigCommerce hosted fields filled",
    stripeFilled: "Stripe details filled",
    directCardFilled: "Direct card inputs filled",
    movedToNextStep: "Moved to next checkout step",
    selectingShippingMethod: "Selecting shipping method...",
    noShippingMethods: "No shipping methods found",
    navigatedToPayment: "Navigated to payment step",
    payNowClicked: "Pay Now clicked",
    checking3DS: "Checking for 3D Secure authentication...",
    dsPageDetected: "3D Secure page detected - URL:",
    waiting3DSLoad: "Waiting for 3DS challenge page to fully load...",
    final3DSPage: "Final 3DS page - URL:",
    iframeFound: "3DS iframe found:",
    gotIframeContext: "Successfully got iframe context",
    inputFieldFound: "3D Secure input field found with selector:",
    enteredSecureCode: "Entered 3D Secure code:",
    submitted3DS: "Submitted 3D Secure authentication",
    inputNotFound: "3D Secure input field not found with any selector",
    authCompleted: "3D Secure authentication completed",
    noAuthRequired: "No 3D Secure authentication required",
    orderConfirmed: "Order confirmed",
    provinceStabilize: "Waiting for province field to stabilize...",
    provinceNotFound: "Province field not found - skipping",
    provinceSelected: "Province selected:",
    provinceInputFilled: "Province input filled",
    termsAccepted: "Terms & Conditions accepted",
    termsAlreadyChecked: "Terms & Conditions already checked",
    clickingTerms: "Clicking Terms & Conditions checkbox..."
};

// ---------- GUEST CHECKOUT ----------
const guestCheckoutLogs = {
    enterEmailStart: "Guest email entered",
    lookingForContinueBtn: "Looking for continue button to shipping form...",
    waitingForShippingForm: "Waiting for shipping form to load...",
    shippingFormDetected: "Shipping form detected via:",
    shippingFormNotConfirmed: "Shipping form visibility not confirmed - continuing anyway",
    fillingShippingAddress: "Filling guest shipping address...",
    selectingCountry: "Selecting country:",
    shippingAddressFilled: "Shipping address form filled",
    flowStart: "\n--- Starting Guest Checkout Flow ---",
    flowComplete: "--- Guest Checkout Flow Completed ---\n"
};

// ---------- CUSTOMER CHECKOUT ----------
const customerCheckoutLogs = {
    emailEntered: "Customer email entered",
    clickedSignIn: "Clicked sign in button",
    passwordEntered: "Password entered",
    loginCompleted: "Login completed",
    selectedSavedAddress: "Selected saved address",
    noSavedAddress: "No saved address found or visible",
    loggedInCheckout: "User is logged in and on checkout page",
    loginUncertain: "User may not be logged in properly",
    flowStart: "\n--- Starting Customer Checkout Flow ---",
    flowComplete: "--- Customer Checkout Flow Completed ---\n"
};

// ---------- REGISTRATION ----------
const registrationLogs = {
    randomDob: "Generated random DOB:",
    preSubmitErrors: "Validation errors found before submission:",
    postSubmitErrors: "Form submission failed with validation errors:",
    navigating: "Navigating to signup page...",
    formVisible: "Registration form visible",
    emailEntered: "Initial email entered",
    personalDetailsFilled: "Personal details filled",
    dobSelected: "DOB fields selected",
    countrySelected: "Country selected:",
    phoneEntered: "Phone number entered",
    manualAddress: "Choosing manual address entry",
    addressFilled: "Address details filled",
    addressLookup: "Looking up address with postcode:",
    marketingDisabled: "All marketing checkboxes disabled",
    submissionComplete: "Signup form submitted successfully",
    waitingForRedirect: "Waiting for registration to complete and redirect...",
    redirectSuccess: "Successfully redirected to:",
    registrationTimeout: "Registration failed: Still on signup page after timeout",
    validationErrorsFound: "Validation errors found:",
    formStateFailure: "Form state at failure:",
    registrationFailed: "Registration failed: Still on signup page without visible error messages."
};

module.exports = { checkoutAuthLogs, pdpLogs, checkoutLogs, guestCheckoutLogs, customerCheckoutLogs, registrationLogs };
