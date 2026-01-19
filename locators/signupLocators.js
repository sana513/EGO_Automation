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
        phone: '[data-testid="phone-input"]',
        addressSuggestions: '[role="option"]',
        marketing: {
            email: 'input[data-testid="checkbox"]:nth-child(0)',
            text: 'input[data-testid="checkbox"]:nth-child(1)',
            post: 'input[data-testid="checkbox"]:nth-child(2)',
        },
        submitButton: 'button:has-text("Create Account")',
        errorMessage: '.error-message'
    }
};

module.exports = { SignupLocators };
