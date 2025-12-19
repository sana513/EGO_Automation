// loginPageLocators.js
module.exports = {
  accountIcon: '[aria-label="Account"]',

  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  submitButton: '[data-testid="submit-button"]',

  popups: {
    closeModalBtn: '[aria-label="Close Modal"]',
    declineOfferBtn: 'button:has-text("Decline offer")',
    button3: '#button3'
  },

  errorMessage: ".error-message, [role='alert'], .text-red-500",
  logoutIndicator: "text=Logout, [aria-label='Logout']"
};
