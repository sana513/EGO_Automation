const CheckoutPage = require('./checkoutPage');
const { CheckoutAuthPage } = require('./checkoutAuthPage');
const { settle } = require('../../utils/dynamicWait');

const { TIMEOUTS, CHECKOUT_WAIT_TIMES } = require('../../config/constants');

class GuestCheckoutPage extends CheckoutPage {
  constructor(page) {
    super(page);
    this.guestLogs = this.config.guestCheckout.logs;
    this.guestLabels = this.config.labels.inputLabels;
    this.waits = CHECKOUT_WAIT_TIMES;
    this.timeouts = TIMEOUTS;
  }

  /* ---------- GUEST SPECIFIC STEPS ---------- */

  /**
   * Enters guest email address in checkout form
   * On dev: Email already entered on auth page, skip this step
   * On stage/prod: Enter email on checkout page
   * @param {string} email - Guest email address
   * @returns {Promise<void>}
   */
  async enterEmail(email) {
    const env = process.env.ENV || 'stage';

    if (env === 'dev') {
      console.log('[DEV] Email already entered on authentication page, skipping enterEmail step');
      return;
    }

    await this.page.waitForLoadState('networkidle', { timeout: this.waits.networkIdle }).catch(() => { });
    await settle(this.page, this.waits.emailEntry);

    const emailInput = this.locators.emailInput;
    await this.fill(emailInput, email);
    console.log(this.guestLogs.enterEmailStart);
  }

  async clickContinueToShipping() {
    const env = process.env.ENV || 'stage';

    if (env === 'dev') {
      console.log('[DEV] Already on shipping form after authentication, skipping continue button');
      await this.page.locator(this.locators.shipping.firstNameInput).first().waitFor({ state: 'visible', timeout: this.timeouts.large }).catch(() => { });
      await settle(this.page, 2000);
      return;
    }

    console.log(this.guestLogs.lookingForContinueBtn);
    await this.click(this.locators.continueToShipping);

    console.log(this.guestLogs.waitingForShippingForm);
    let found = false;
    for (const selector of this.locators.shippingFormSelectors) {
      const locator = this.page.locator(selector).first();
      try {
        await locator.waitFor({ state: 'visible', timeout: this.timeouts.medium });
        console.log(`${this.guestLogs.shippingFormDetected} ${selector}`);
        found = true;
        break;
      } catch (e) {
        
      }
    }

    if (!found) {
      console.warn(this.guestLogs.shippingFormNotConfirmed);
    }

    await settle(this.page, this.waits.shippingFormLoad);
  }

  /**
   * Fills shipping address form with provided data
   * @param {Object} data - Shipping address data
   * ...
   */
  async fillShippingAddress(data) {
    console.log(this.guestLogs.fillingShippingAddress);
    await this.closeModalIfPresent();

    const manualBtn = this.page.locator(this.locators.shipping.manualAddressLink).first();
    const isManualBtnVisible = await manualBtn.isVisible().catch(() => false);

    if (isManualBtnVisible) {
      await manualBtn.click();
      await settle(this.page, this.waits.manualAddressExpand);
    }

    const safeFill = async (selector, value, label) => {
      const el = this.page.locator(selector).first();
      try {
        await el.waitFor({ state: 'visible', timeout: this.timeouts.medium });
        await el.fill(value);
        await el.dispatchEvent('blur');
        await settle(this.page, this.waits.fieldBlur);
        console.log(`${label} filled`);
      } catch (e) {
        console.warn(`Field ${label} not visible or interactable after timeout`);
      }
    };

    await this.fill(this.locators.shipping.firstNameInput, data.firstName);
    await this.fill(this.locators.shipping.lastNameInput, data.lastName);
    await this.fill(this.locators.shipping.addressLine1Input, data.addressLine1);
    if (data.addressLine2) await this.fill(this.locators.shipping.addressLine2Input, data.addressLine2);
    await this.fill(this.locators.shipping.cityInput, data.city);
    await this.fill(this.locators.shipping.postCodeInput, data.postCode);

    const countrySelect = this.page.locator(this.locators.shipping.countrySelect);

    console.log('Waiting for country dropdown...');
    await countrySelect.waitFor({ state: 'attached', timeout: 15000 });
    console.log('Country dropdown attached to DOM');

    await countrySelect.scrollIntoViewIfNeeded().catch(() => { });
    await settle(this.page, 1000);

    const isVisible = await countrySelect.isVisible();
    console.log(`Country dropdown visible: ${isVisible}`);

    if (!isVisible) {
      console.log('Country dropdown not visible, checking if it exists in DOM...');
      const count = await this.page.locator(this.locators.shipping.countrySelect).count();
      console.log(`Found ${count} country dropdowns`);
    }

    console.log(`${this.guestLogs.selectingCountry} ${data.countryCode}`);
    await this.stableAction(this.locators.shipping.countrySelect, 'click');
    await this.page.selectOption(this.locators.shipping.countrySelect, data.countryCode);
    await settle(this.page, this.waits.countryChange);

    await this.selectProvince(data.province);
    await this.fill(this.locators.shipping.phoneInput, data.phoneNumber);
    console.log(this.guestLogs.shippingAddressFilled);
  }

  /**
   * Builds shipping data object from test configuration
   * @returns {Object} Shipping address data
   */
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
    console.log(this.guestLogs.flowStart);
    await this.enterEmail(email);
    await this.clickContinueToShipping();
    await this.fillShippingAddress(this.buildShippingData());
    await this.clickShippingContinue();
    await this.selectShippingMethod();
    await this.continueToPayment();
    await this.fillCardDetails(card);
    await this.clickPayNow();
    await this.verifyOrderConfirmation();
    console.log(this.guestLogs.flowComplete);
  }
}

module.exports = GuestCheckoutPage;