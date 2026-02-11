const CheckoutPage = require('./checkoutPage');
const { settle } = require('../../utils/dynamicWait');
const timeouts = require('../../config/testData').testData.timeouts;

class GuestCheckoutPage extends CheckoutPage {
  constructor(page) {
    super(page);
  }

  /* ---------- GUEST SPECIFIC STEPS ---------- */

  async enterEmail(email) {
    await this.page.waitForLoadState('networkidle', { timeout: this.config.waitTimes.networkIdle }).catch(() => { });
    await settle(this.page, this.config.waitTimes.emailEntry);

    const emailInput = this.page.locator(this.locators.emailInput);
    await emailInput.waitFor({ state: 'visible', timeout: timeouts.large });
    await emailInput.fill(email);
    console.log(`Guest email entered`);
  }

  async clickContinueToShipping() {
    console.log("Looking for continue button to shipping form...");
    const continueBtn = this.page.locator(this.locators.continueToShipping);
    await continueBtn.waitFor({ state: 'visible', timeout: timeouts.large });
    await continueBtn.click();

    console.log("Waiting for shipping form to load...");
    let found = false;
    for (const selector of this.locators.shippingFormSelectors) {
      if (await this.page.locator(selector).first().isVisible({ timeout: timeouts.medium }).catch(() => false)) {
        console.log(`Shipping form detected via: ${selector}`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.warn("Shipping form visibility not confirmed - continuing anyway");
    }

    await settle(this.page, this.config.waitTimes.shippingFormLoad);
  }

  async fillShippingAddress(data) {
    console.log("Filling guest shipping address...");
    await this.closeModalIfPresent();

    const manualBtn = this.page.locator(this.locators.shipping.manualAddressLink).first();
    if (await manualBtn.isVisible({ timeout: timeouts.small }).catch(() => false)) {
      await manualBtn.click();
      await settle(this.page, this.config.waitTimes.manualAddressExpand);
    }

    const safeFill = async (selector, value, label) => {
      const el = this.page.locator(selector).first();
      if (await el.isVisible({ timeout: timeouts.medium }).catch(() => false)) {
        await el.fill(value);
        await el.dispatchEvent('blur');
        await settle(this.page, this.config.waitTimes.fieldBlur);
        console.log(`${label} filled`);
      }
    };

    await safeFill(this.locators.shipping.firstNameInput, data.firstName, "First Name");
    await safeFill(this.locators.shipping.lastNameInput, data.lastName, "Last Name");
    await safeFill(this.locators.shipping.addressLine1Input, data.addressLine1, "Address Line 1");
    if (data.addressLine2) await safeFill(this.locators.shipping.addressLine2Input, data.addressLine2, "Address Line 2");
    await safeFill(this.locators.shipping.cityInput, data.city, "City");
    await safeFill(this.locators.shipping.postCodeInput, data.postCode, "Post Code");

    console.log(`Selecting country: ${data.countryCode}`);
    await this.page.selectOption(this.locators.shipping.countrySelect, data.countryCode);
    await settle(this.page, this.config.waitTimes.countryChange);

    await this.selectProvince(data.province);
    await safeFill(this.locators.shipping.phoneInput, data.phoneNumber, "Phone Number");
    console.log("Shipping address form filled");
  }

  buildShippingData() {
    return {
      firstName: this.config.shipping.firstName,
      lastName: this.config.shipping.lastName,
      addressLine1: this.config.shipping.addressLine1,
      city: this.config.shipping.city,
      postCode: this.config.shipping.postCode,
      countryCode: this.config.shipping.countryCode,
      phoneNumber: this.config.shipping.phoneNumber,
      province: this.config.shipping.state
    };
  }

  async completeGuestCheckout(email, card) {
    console.log("\n--- Starting Guest Checkout Flow ---");
    await this.enterEmail(email);
    await this.clickContinueToShipping();
    await this.fillShippingAddress(this.buildShippingData());
    await this.clickShippingContinue();
    await this.selectShippingMethod();
    await this.continueToPayment();
    await this.fillCardDetails(card);
    await this.clickPayNow();
    await this.verifyOrderConfirmation();
    console.log("--- Guest Checkout Flow Completed ---\n");
  }
}

module.exports = GuestCheckoutPage;