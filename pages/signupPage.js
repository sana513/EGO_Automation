const BasePage = require("./basePage");
const { SignupLocators } = require("../locators/signupLocators");
const { testData } = require("../config/testData");

class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    if (!page) throw new Error("Page instance is required to initialize SignupPage");
    this.page = page;
    this.sl = SignupLocators.signupPage;
    this.registerDrawer = () => this.page.locator('[data-testid="register-page"]');
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
    await drawer.waitFor({ state: "visible", timeout: testData.timeouts.extreme });
    this.activeForm = drawer;
    this.firstNameInput = this.activeForm.locator(this.sl.firstName);
    this.lastNameInput = this.activeForm.locator(this.sl.lastName);
    this.passwordInput = this.activeForm.locator(this.sl.password);
    this.confirmPasswordInput = this.activeForm.locator(this.sl.confirmPassword);
    this.streetInput = this.activeForm.locator(this.sl.street);
    this.cityInput = this.activeForm.locator(this.sl.city);
    this.postCodeInput = this.activeForm.locator(this.sl.postCode);
    this.addressLookupInput = this.activeForm.locator(this.sl.addressLookup);
    this.addressSuggestions = this.activeForm.locator(this.sl.addressSuggestions);
    this.submitButton = this.activeForm.locator(this.sl.submitButton);
    this.country = this.activeForm.locator(this.sl.country);
    this.enterAddressManually = this.activeForm.locator(this.sl.enterAddressManually);
    this.phoneInput = this.activeForm.locator(this.sl.phone);

    this.dob = {
      day: this.activeForm.locator('select[data-testid="select-input"]').nth(0),
      month: this.activeForm.locator('select[data-testid="select-input"]').nth(1),
      year: this.activeForm.locator('select[data-testid="select-input"]').nth(2),
    };
  }
  async navigateToSignup() {
    if (!this.page) throw new Error("Page is not initialized");
    await this.page.context().clearCookies();
    await this.page.evaluate(() => localStorage.clear());

    const currentLocale = process.env.LOCALE || 'us';
    await this.navigate(this.getBaseUrl(currentLocale));

    // Explicitly wait for and handle cookies for UK/EU locales
    if (['uk', 'eu'].includes(currentLocale)) {
      console.log(`🔹 Locale is ${currentLocale}, waiting for cookie banner...`);
      await this.page.waitForTimeout(3000);
      await this.handleCookieConsent(5000); // 5s timeout to wait for banner
    } else {
      await this.handleCookieConsent(1000);
    }

    await this.accountIcon.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.accountIcon.click();

    await this.signupLink.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.signupLink.click();

    await this.page.waitForSelector('[data-testid="register-page"]', { timeout: testData.timeouts.extreme });
    await this.setActiveForm();
  }
  async enterInitialEmail(email) {
    if (!this.activeForm) await this.setActiveForm();

    const emailInput = this.activeForm.locator(this.sl.initialEmailInput);
    await emailInput.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await emailInput.fill(email);

    const continueBtn = this.activeForm.locator(this.sl.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await continueBtn.click();

    await this.page.waitForSelector(this.sl.firstName, { timeout: testData.timeouts.extreme });
    await this.setActiveForm();
  }

  async enterUniqueEmail(email) {
    await this.enterInitialEmail(email);
  }

  async clickContinue() {
    if (!this.activeForm) await this.setActiveForm();
    const continueBtn = this.activeForm.locator(this.sl.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await continueBtn.click();
    await this.page.waitForSelector(this.sl.firstName, { timeout: testData.timeouts.medium });
    await this.setActiveForm();
  }

  async fillPersonalDetails(details) {
    if (details["Email"]) await this.enterInitialEmail(details["Email"]);
    if (!this.activeForm) await this.setActiveForm();

    if (details["First Name"]) await this.firstNameInput.fill(details["First Name"]);
    if (details["Last Name"]) await this.lastNameInput.fill(details["Last Name"]);
    if (details["Password"]) await this.passwordInput.fill(details["Password"]);
    if (details["Confirm Password"]) await this.confirmPasswordInput.fill(details["Confirm Password"]);
  }
  async setDOB() {
    if (!this.activeForm) await this.setActiveForm();

    const dayVal = Math.floor(Math.random() * 28) + 1;
    const day = dayVal < 10 ? `0${dayVal}` : dayVal.toString();
    const months = testData.registration.dob.months;
    const month = months[Math.floor(Math.random() * months.length)];
    const year = (Math.floor(Math.random() * (2000 - 1950 + 1)) + 1950).toString();

    await this.dob.day.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.dob.day.selectOption(day);

    await this.dob.month.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.dob.month.selectOption({ label: month });

    await this.dob.year.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.dob.year.selectOption(year);

    console.log(`Generated random DOB: ${day} ${month} ${year}`);
  }

  async selectCountry(countryName) {
    if (!this.activeForm) await this.setActiveForm();
    const countrySelect = this.activeForm.locator('select[data-testid="country-select"]');
    await countrySelect.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await countrySelect.selectOption({ label: countryName });

    await this.phoneInput.waitFor({ state: "visible", timeout: testData.timeouts.medium });
  }

  async enterPhoneNumber(phoneNumber) {
    if (!this.activeForm) await this.setActiveForm();
    await this.phoneInput.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.phoneInput.fill(phoneNumber);
  }

  async chooseManualAddress() {
    if (!this.activeForm) await this.setActiveForm();
    await this.enterAddressManually.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await this.enterAddressManually.click();
  }

  async enterAddress(details) {
    if (!this.activeForm) await this.setActiveForm();
    if (details["Street"]) await this.streetInput.fill(details["Street"]);
    if (details["City"]) await this.cityInput.fill(details["City"]);
    if (details["Post Code"]) await this.postCodeInput.fill(details["Post Code"]);
  }

  async addressLookup(postCode) {
    if (!this.activeForm) await this.setActiveForm();
    await this.addressLookupInput.waitFor({ state: 'visible', timeout: testData.timeouts.extreme });
    await this.addressLookupInput.fill(postCode);

    await this.addressSuggestions.first().waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await this.addressSuggestions.first().click();
  }

  async disableMarketing() {
    const checkboxes = this.page.locator('[data-testid="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isChecked()) await checkbox.uncheck();
    }
  }

  async submitForm() {
    if (!this.activeForm) await this.setActiveForm();
    await this.submitButton.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await this.submitButton.click();
  }
}

module.exports = SignupPage;