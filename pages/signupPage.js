const BasePage = require("./basePage");
const { SignupLocators } = require("../locators/signupLocators");
const { testData } = require("../config/testData");
const { TIMEOUTS, REGISTRATION_WAIT_TIMES } = require("../config/constants");
const { registrationLogs } = require("../config/egoLogs");
const { registrationLabels } = require("../config/egoLabels");
const { settle } = require("../utils/dynamicWait");

class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    if (!page) throw new Error("Page instance is required to initialize SignupPage");
    this.page = page;
    this.sl = SignupLocators.signupPage;
    this.logs = registrationLogs;
    this.labels = registrationLabels;
    this.waits = REGISTRATION_WAIT_TIMES;

    this.registerDrawer = () => this.page.locator(this.sl.signupContainer);
    this.accountIcon = page.locator(this.sl.accountIcon);
    this.signupLink = page.locator(this.sl.signupLink);
    this.marketing = {
      email: page.locator(this.sl.marketing.email),
      text: page.locator(this.sl.marketing.text),
      post: page.locator(this.sl.marketing.post),
    };

    this.errorMessage = page.locator(this.sl.errorMessage);
  }

  async setActiveForm() {
    if (!this.page) throw new Error("Page is not initialized");

    const drawer = this.registerDrawer();
    await drawer.waitFor({ state: "visible", timeout: TIMEOUTS.extreme });
    this.activeForm = drawer;
    this.firstNameInput = this.activeForm.locator(this.sl.firstName);
    this.lastNameInput = this.activeForm.locator(this.sl.lastName);
    this.passwordInput = this.activeForm.locator(this.sl.password);
    this.confirmPasswordInput = this.activeForm.locator(this.sl.confirmPassword);
    this.streetInput = this.activeForm.locator(this.sl.street);
    this.cityInput = this.activeForm.locator(this.sl.city);
    this.postCodeInput = this.activeForm.locator(this.sl.postCode);
    this.stateInput = this.activeForm.locator(this.sl.state);
    this.addressLookupInput = this.activeForm.locator(this.sl.addressLookup);
    this.addressSuggestions = this.activeForm.locator(this.sl.addressSuggestions);
    this.submitButton = this.activeForm.locator(this.sl.submitButton);
    this.country = this.activeForm.locator(this.sl.country);
    this.enterAddressManually = this.activeForm.locator(this.sl.enterAddressManually);
    this.phoneInput = this.activeForm.locator(this.sl.phone);

    this.dob = {
      day: this.activeForm.locator(this.sl.dob.generic).nth(0),
      month: this.activeForm.locator(this.sl.dob.generic).nth(1),
      year: this.activeForm.locator(this.sl.dob.generic).nth(2),
    };
  }

  async navigateToSignup() {
    if (!this.page) throw new Error("Page is not initialized");
    console.log(this.logs.navigating);
    await this.page.context().clearCookies();
    await this.page.evaluate(() => localStorage.clear());
    global.cookieHandled = false;

    const currentLocale = process.env.LOCALE || 'us';
    await this.navigate(this.getBaseUrl(currentLocale));

    if (['uk', 'eu'].includes(currentLocale)) {
      await this.handleCookieConsent(true);
      await settle(this.page, this.waits.cookieSettle);
    } else {
      await this.handleCookieConsent(false);
    }

    await this.accountIcon.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.accountIcon.click();

    await this.signupLink.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.signupLink.click();

    await this.page.waitForSelector(this.sl.signupContainer, { timeout: TIMEOUTS.extreme });
    await this.setActiveForm();
  }

  async enterInitialEmail(email) {
    if (!this.activeForm) await this.setActiveForm();

    const emailInput = this.activeForm.locator(this.sl.initialEmailInput);
    await emailInput.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await emailInput.fill(email);

    const continueBtn = this.activeForm.locator(this.sl.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await continueBtn.click();

    await this.page.waitForSelector(this.sl.firstName, { timeout: TIMEOUTS.extreme });
    await this.setActiveForm();
    console.log(this.logs.emailEntered);
  }

  async enterUniqueEmail(email) {
    await this.enterInitialEmail(email);
  }

  async clickContinue() {
    if (!this.activeForm) await this.setActiveForm();
    const continueBtn = this.activeForm.locator(this.sl.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await continueBtn.click();
    await this.page.waitForSelector(this.sl.firstName, { timeout: TIMEOUTS.medium });
    await this.setActiveForm();
  }

  async fillPersonalDetails(details) {
    if (details["Email"]) await this.enterInitialEmail(details["Email"]);
    if (!this.activeForm) await this.setActiveForm();

    if (details["First Name"]) await this.firstNameInput.fill(details["First Name"]);
    if (details["Last Name"]) await this.lastNameInput.fill(details["Last Name"]);
    if (details["Password"]) await this.passwordInput.fill(details["Password"]);
    if (details["Confirm Password"]) await this.confirmPasswordInput.fill(details["Confirm Password"]);
    console.log(this.logs.personalDetailsFilled);
  }

  async setDOB() {
    if (!this.activeForm) await this.setActiveForm();

    const dayVal = Math.floor(Math.random() * 28) + 1;
    const day = dayVal < 10 ? `0${dayVal}` : dayVal.toString();
    const months = this.labels.months;
    const month = months[Math.floor(Math.random() * months.length)];
    const year = (Math.floor(Math.random() * (2000 - 1950 + 1)) + 1950).toString();

    await this.dob.day.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.dob.day.selectOption(day);

    await this.dob.month.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.dob.month.selectOption({ label: month });

    await this.dob.year.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.dob.year.selectOption(year);

    console.log(`${this.logs.randomDob} ${day} ${month} ${year}`);
  }

  async selectCountry(countryName) {
    if (!this.activeForm) await this.setActiveForm();
    await this.country.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.country.selectOption({ label: countryName });

    await this.phoneInput.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    console.log(`${this.logs.countrySelected} ${countryName}`);
  }

  async enterPhoneNumber(phoneNumber) {
    if (!this.activeForm) await this.setActiveForm();
    await this.phoneInput.waitFor({ state: "visible", timeout: TIMEOUTS.medium });
    await this.phoneInput.fill(phoneNumber);
    console.log(this.logs.phoneEntered);
  }

  async chooseManualAddress() {
    if (!this.activeForm) await this.setActiveForm();
    await this.enterAddressManually.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await this.enterAddressManually.click();
    console.log(this.logs.manualAddress);
  }

  async enterAddress(details) {
    if (!this.activeForm) await this.setActiveForm();
    if (details["Street"]) await this.streetInput.fill(details["Street"]);
    if (details["City"]) await this.cityInput.fill(details["City"]);
    if (details["Post Code"]) await this.postCodeInput.fill(details["Post Code"]);

    if (details["State"]) {
      const stateVisible = await this.stateInput.isVisible().catch(() => false);
      if (stateVisible) {
        await this.stateInput.selectOption({ label: details["State"] });
      }
    }
    console.log(this.logs.addressFilled);
  }

  async addressLookup(postCode) {
    if (!this.activeForm) await this.setActiveForm();
    console.log(`${this.logs.addressLookup} ${postCode}`);
    await this.addressLookupInput.waitFor({ state: 'visible', timeout: TIMEOUTS.extreme });
    await this.addressLookupInput.fill(postCode);

    await this.addressSuggestions.first().waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await this.addressSuggestions.first().click();
  }

  async disableMarketing() {
    const checkboxes = this.activeForm.locator(this.sl.marketing.generic);
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isChecked()) await checkbox.uncheck();
    }
    console.log(this.logs.marketingDisabled);
  }

  async submitForm() {
    if (!this.activeForm) await this.setActiveForm();

    const errorElements = await this.page.locator(this.sl.validationErrors).all();
    if (errorElements.length > 0) {
      const errorTexts = await Promise.all(errorElements.map(async (el) => {
        const text = await el.textContent().catch(() => '');
        const isVisible = await el.isVisible().catch(() => false);
        return isVisible ? text : null;
      }));
      const visibleErrors = errorTexts.filter(t => t);
      if (visibleErrors.length > 0) {
        console.log(this.logs.preSubmitErrors, visibleErrors);
      }
    }

    await this.submitButton.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await this.submitButton.click();

    // Wait for URL to change away from signup
    console.log(this.logs.waitingForRedirect);
    try {
      await this.page.waitForURL(url => !url.href.includes('/signup'), {
        timeout: this.waits.navigationTimeout || 15000
      });
      console.log(this.logs.redirectSuccess, this.page.url());
    } catch (e) {
      const currentUrl = this.page.url();
      if (currentUrl.includes('/signup')) {
        console.error(this.logs.registrationTimeout);

        // Extract all visible error texts
        const errorSelectors = this.sl.errorSelectors;

        let foundErrors = [];
        for (const selector of errorSelectors) {
          const elements = await this.page.locator(selector).all();
          for (const el of elements) {
            if (await el.isVisible()) {
              const text = await el.textContent().catch(() => '');
              if (text && text.trim()) foundErrors.push(text.trim());
            }
          }
        }

        // De-duplicate errors
        foundErrors = [...new Set(foundErrors)];

        if (foundErrors.length > 0) {
          console.error(this.logs.validationErrorsFound, foundErrors);
          throw new Error(`Registration failed with errors: ${foundErrors.join(' | ')}`);
        } else {
          // If no errors found, log all visible text in the form container
          const formText = await this.activeForm.innerText().catch(() => 'Could not read form text');
          console.error(this.logs.formStateFailure, formText);
          throw new Error(this.logs.registrationFailed);
        }
      }
    }
    console.log(this.logs.submissionComplete);
  }
}

module.exports = SignupPage;