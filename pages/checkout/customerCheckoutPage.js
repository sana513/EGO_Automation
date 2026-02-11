const CheckoutPage = require('./checkoutPage');
const { settle } = require('../../utils/dynamicWait');

class CustomerCheckoutPage extends CheckoutPage {
  constructor(page) {
    super(page);
  }

  /* ---------- CUSTOMER SPECIFIC STEPS ---------- */

  async enterEmail(email) {
    const emailInput = this.page.locator(this.locators.emailInput);
    await emailInput.waitFor({ state: 'visible', timeout: this.timeouts.large });
    await emailInput.fill(email);
    console.log(`Customer email entered`);
  }

  async clickSignIn() {
    const signInBtn = this.page.locator(this.locators.signInButton).first();
    await signInBtn.waitFor({ state: 'visible', timeout: this.timeouts.large });
    await signInBtn.click();
    console.log("Clicked sign in button");
  }

  async enterPassword(password) {
    const passwordInput = this.page.locator(this.locators.passwordInput).first();
    await passwordInput.waitFor({ state: 'visible', timeout: this.timeouts.large });
    await passwordInput.fill(password);
    console.log("Password entered");

    await passwordInput.press('Enter').catch(async () => {
      const signInBtn = this.page.locator(this.locators.signInButton).first();
      if (await signInBtn.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
        await signInBtn.click();
      }
    });

    await this.page.waitForLoadState('networkidle', { timeout: this.config.waitTimes.authentication });
    console.log("Login completed");
  }

  async selectSavedAddress() {
    const savedAddress = this.page.locator(this.locators.savedAddress).first();

    if (await savedAddress.isVisible({ timeout: this.timeouts.medium }).catch(() => false)) {
      await savedAddress.click();
      console.log("Selected saved address");
    } else {
      console.warn("No saved address found or visible");
    }

    await settle(this.page, this.config.waitTimes.autofillWait);
  }

  async verifyLoggedInState() {
    const savedAddressVisible = await this.page.locator(this.locators.savedAddress).first()
      .isVisible({ timeout: this.timeouts.medium }).catch(() => false);

    const shippingMethodVisible = await this.page.locator(this.locators.shippingMethodStep)
      .isVisible({ timeout: this.timeouts.medium }).catch(() => false);

    if (savedAddressVisible || shippingMethodVisible) {
      console.log("User is logged in and on checkout page");
      return true;
    }

    console.warn("User may not be logged in properly");
    return false;
  }

  async completeCustomerCheckout(email, password, cardDetails) {
    console.log("\n--- Starting Customer Checkout Flow ---");
    await this.enterEmail(email);
    await this.clickSignIn();
    await this.enterPassword(password);
    await settle(this.page, this.config.waitTimes.autofillWait);
    await this.selectSavedAddress();
    await this.clickShippingContinue();
    await this.selectShippingMethod();
    await this.continueToPayment();
    await this.fillCardDetails(cardDetails);
    await this.clickPayNow();
    await this.verifyOrderConfirmation();
    console.log("--- Customer Checkout Flow Completed ---\n");
  }
}

module.exports = CustomerCheckoutPage;
