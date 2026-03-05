const CheckoutPage = require('./checkoutPage');
const { settle } = require('../../utils/dynamicWait');
const { TIMEOUTS, CHECKOUT_WAIT_TIMES } = require('../../config/constants');
const { customerCheckoutLogs } = require('../../config/egoLogs');

class CustomerCheckoutPage extends CheckoutPage {
  constructor(page) {
    super(page);
    this.timeouts = TIMEOUTS;
    this.waits = CHECKOUT_WAIT_TIMES;
    this.logs = customerCheckoutLogs;
  }

  /* ---------- CUSTOMER SPECIFIC STEPS ---------- */

  async enterEmail(email) {
    const emailInput = this.page.locator(this.locators.emailInput);
    await emailInput.waitFor({ state: 'visible', timeout: this.timeouts.large });
    await emailInput.fill(email);
    console.log(this.logs.emailEntered);
  }

  async clickSignIn() {
    const signInBtn = this.page.locator(this.locators.signInButton).first();
    await signInBtn.waitFor({ state: 'visible', timeout: this.timeouts.large });
    await signInBtn.click();
    console.log(this.logs.clickedSignIn);
  }

  async enterPassword(password) {
    const passwordInput = this.page.locator(this.locators.passwordInput).first();
    await passwordInput.waitFor({ state: 'visible', timeout: this.timeouts.large });
    await passwordInput.fill(password);
    console.log(this.logs.passwordEntered);

    await passwordInput.press('Enter').catch(async () => {
      const signInBtn = this.page.locator(this.locators.signInButton).first();
      if (await signInBtn.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
        await signInBtn.click();
      }
    });

    await this.page.waitForLoadState('networkidle', { timeout: this.waits.authentication });
    console.log(this.logs.loginCompleted);
  }

  async selectSavedAddress() {
    const savedAddress = this.page.locator(this.locators.savedAddress).first();

    if (await savedAddress.isVisible({ timeout: this.timeouts.medium }).catch(() => false)) {
      await savedAddress.click();
      console.log(this.logs.selectedSavedAddress);
    } else {
      console.warn(this.logs.noSavedAddress);
    }

    await settle(this.page, this.waits.autofillWait);
  }

  async verifyLoggedInState() {
    const savedAddressVisible = await this.page.locator(this.locators.savedAddress).first()
      .isVisible({ timeout: this.timeouts.medium }).catch(() => false);

    const shippingMethodVisible = await this.page.locator(this.locators.shippingMethodStep)
      .isVisible({ timeout: this.timeouts.medium }).catch(() => false);

    if (savedAddressVisible || shippingMethodVisible) {
      console.log(this.logs.loggedInCheckout);
      return true;
    }

    console.warn(this.logs.loginUncertain);
    return false;
  }

  async completeCustomerCheckout(email, password, cardDetails) {
    console.log(this.logs.flowStart);
    await this.enterEmail(email);
    await this.clickSignIn();
    await this.enterPassword(password);
    await settle(this.page, this.waits.autofillWait);
    await this.selectSavedAddress();
    await this.clickShippingContinue();
    await this.selectShippingMethod();
    await this.continueToPayment();
    await this.fillCardDetails(cardDetails);
    await this.clickPayNow();
    await this.verifyOrderConfirmation();
    console.log(this.logs.flowComplete);
  }
}

module.exports = CustomerCheckoutPage;