const SignupLocators = {
    signupPage: {
        signupContainer: '[data-testid="register-page"]',
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
        state: 'select[data-testid="state-select"]',
        addressLookup: 'input[placeholder="Start typing your address..."]',
        dob: {
            day: 'select[data-testid="select-input"]:nth-child(1)',
            month: 'select[data-testid="select-input"]:nth-child(2)',
            year: 'select[data-testid="select-input"]:nth-child(3)',
            generic: 'select[data-testid="select-input"]'
        },
        country: 'select[data-testid="country-select"]',
        enterAddressManually: 'text=Or Enter Your Address Manually',
        phone: '[data-testid="phone-input"]',
        addressSuggestions: '[role="option"]',
        marketing: {
            email: 'input[data-testid="checkbox"]:nth-child(1)',
            text: 'input[data-testid="checkbox"]:nth-child(2)',
            post: 'input[data-testid="checkbox"]:nth-child(3)',
            generic: '[data-testid="checkbox"]'
        },
        submitButton: 'button:has-text("Create Account")',
        errorMessage: '.error-message',
        validationErrors: '.error, [class*="error"], [class*="invalid"]',
        errorSelectors: [
            '.error, [class*="error"], [class*="invalid"]',
            '.errorMessage',
            '.alert-danger',
            '[role="alert"]',
            '.form-error'
        ]
    }
};

module.exports = { SignupLocators };
