// signupLocators.js
module.exports = {
  signupPage: {
    // Homepage / navigation
    accountIcon: '[aria-label="Account"]',
    signupLink: 'span.underline.cursor-pointer',

    // Initial email drawer
    initialEmailInput: '[data-testid="email-input"]',
    continueButton: 'button:has-text("Continue")',

    // Full registration form inputs
    firstName: '[data-testid="first-name-input"]',
    lastName: '[data-testid="last-name-input"]',
    password: '[data-testid="password-input"]',
    confirmPassword: '[data-testid="confirm-password-input"]',
    street: 'input[placeholder="Street Name"]',
    city: 'input[placeholder="City"]',
    postCode: 'input[placeholder="Post Code"]',
    addressLookup: 'input[placeholder="Start typing your address..."]',

    // DOB dropdowns
    dob: {
     day: 'select[data-testid="select-input"].nth(0)',
      month: 'select[data-testid="select-input"].nth(1)',
      year: 'select[data-testid="select-input"].nth(2)',
    },

    // Country selector
    country: 'select[data-testid="country-select"]',
    // phoneNumber: '[data-testid="phone-input"]',

    // Manual address entry
    enterAddressManually: 'text=Or Enter Your Address Manually',
    addressSuggestions: '[role="option"]',

    // Marketing checkboxes
    marketing: {
      email: 'input[data-testid="checkbox"].nth(0)',
      text: 'input[data-testid="checkbox"].nth(1)',
      post: 'input[data-testid="checkbox"].nth(2)',
    },

    // Buttons
    submitButton: 'button:has-text("Create Account")',

    // Error messages
    errorMessage: '.error-message, [role="alert"]'
  }
};
