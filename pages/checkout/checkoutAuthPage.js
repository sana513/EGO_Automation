const BasePage = require('../basePage');
const { CheckoutLocators } = require('../../locators/checkoutLocators');
const { settle } = require('../../utils/dynamicWait');
const { testData } = require('../../config/testData');
const { CHECKOUT_AUTH_TIMEOUTS } = require('../../config/constants');
const { checkoutAuthLogs } = require('../../config/egoLogs');
const { checkoutAuthLabels } = require('../../config/egoLabels');

class CheckoutAuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.timeouts = CHECKOUT_AUTH_TIMEOUTS;
    this.logs = checkoutAuthLogs;
    this.labels = checkoutAuthLabels;
    this.guestEmailInput = CheckoutLocators.checkoutAsGuestEmailInput;
    this.guestButton = CheckoutLocators.checkoutAsGuestButton;
    this.signInEmailInput = CheckoutLocators.signInEmailInput;
    this.signInPasswordInput = CheckoutLocators.signInPasswordInput;
    this.signInButton = CheckoutLocators.signInAndCheckoutButton;
  }

  /**
   * Checks if we're on the checkout authentication page
   * @returns {Promise<boolean>}
   */
  async isOnAuthPage() {
    const guestButton = this.page.locator(this.guestButton);
    return await guestButton.isVisible({ timeout: this.timeouts.authPageCheck }).catch(() => false);
  }

  /**
   * Enters email and proceeds as guest
   * @param {string} email - Guest email address
   */
  async checkoutAsGuest(email) {
    console.log(this.logs.proceedingAsGuest);

    const emailInput = this.page.locator(this.guestEmailInput);
    await emailInput.waitFor({ state: 'visible', timeout: this.timeouts.inputVisible });
    await emailInput.fill(email);
    console.log(`${this.logs.enteredEmail} ${email}`);

    await settle(this.page, this.timeouts.settle);

    const guestBtn = this.page.locator(this.guestButton);
    await guestBtn.waitFor({ state: 'visible', timeout: this.timeouts.inputVisible });

    await this.page.waitForFunction(
      (buttonText) => {
        const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
        const guestBtn = btns.find(btn => btn.textContent.includes(buttonText));
        return guestBtn && !guestBtn.disabled;
      },
      this.labels.guestButtonText,
      { timeout: this.timeouts.buttonEnabled }
    );

    await guestBtn.click();
    console.log(this.logs.clickedGuestButton);

    await this.page.waitForURL(/checkout/, { timeout: this.timeouts.urlNavigation }).catch(() => {
      console.warn(this.logs.urlNotChanged);
    });

    await this.page.waitForLoadState('networkidle', { timeout: this.timeouts.networkIdle }).catch(() => {
      console.log(this.logs.networkNotIdle);
    });

    await settle(this.page, this.timeouts.postNavigationSettle);
    console.log(this.logs.navigatedToCheckout);
    console.log(`${this.logs.finalUrl} ${this.page.url()}`);
  }

  /**
   * Signs in and proceeds to checkout
   * @param {string} email - Customer email
   * @param {string} password - Customer password
   */
  async signInAndCheckout(email, password) {
    console.log(this.logs.signingIn);

    const emailInput = this.page.locator(this.signInEmailInput);
    await emailInput.waitFor({ state: 'visible', timeout: this.timeouts.inputVisible });
    await emailInput.fill(email);
    console.log(`${this.logs.enteredEmail} ${email}`);

    const passwordInput = this.page.locator(this.signInPasswordInput);
    await passwordInput.waitFor({ state: 'visible', timeout: this.timeouts.inputVisible });
    await passwordInput.fill(password);
    console.log(this.logs.enteredPassword);

    await settle(this.page, this.timeouts.settle);

    const signInBtn = this.page.locator(this.signInButton);
    await signInBtn.waitFor({ state: 'visible', timeout: this.timeouts.inputVisible });

    await this.page.waitForFunction(
      (buttonText) => {
        const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
        const signInBtn = btns.find(btn => btn.textContent.includes(buttonText));
        return signInBtn && !signInBtn.disabled;
      },
      this.labels.signInButtonText,
      { timeout: this.timeouts.buttonEnabled }
    );

    await signInBtn.click();
    console.log(this.logs.clickedSignInButton);

    await this.page.waitForURL(/checkout/, { timeout: this.timeouts.urlNavigation });
    await settle(this.page, this.timeouts.signInSettle);
    console.log(this.logs.signInSuccess);
  }
}

module.exports = CheckoutAuthPage;
