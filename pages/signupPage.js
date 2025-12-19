const BasePage = require("./BasePage");
const locators = require("../locators/EGO_Locators").SignupLocators;

class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    if (!page) throw new Error("Page instance is required to initialize SignupPage");
    this.page = page;
    this.l = locators.signupPage;

    // Register drawer root locator
    this.registerDrawer = () => this.page.locator('[data-testid="register-page"]');

    // Top-level navigation
    this.accountIcon = page.locator(this.l.accountIcon);
    this.signupLink = page.locator(this.l.signupLink);

    // Marketing checkboxes
    this.marketing = {
      email: page.locator(this.l.marketing.email),
      text: page.locator(this.l.marketing.text),
      post: page.locator(this.l.marketing.post),
    };

    this.errorMessage = page.locator(this.l.errorMessage);
  }

  // Ensure drawer and all fields are ready
  async setActiveForm() {
    if (!this.page) throw new Error("Page is not initialized");

    const drawer = this.registerDrawer();
    await drawer.waitFor({ state: "visible", timeout: 30000 });
    this.activeForm = drawer;

    // Scoped locators
    this.firstNameInput = this.activeForm.locator(this.l.firstName);
    this.lastNameInput = this.activeForm.locator(this.l.lastName);
    this.passwordInput = this.activeForm.locator(this.l.password);
    this.confirmPasswordInput = this.activeForm.locator(this.l.confirmPassword);
    this.streetInput = this.activeForm.locator(this.l.street);
    this.cityInput = this.activeForm.locator(this.l.city);
    this.postCodeInput = this.activeForm.locator(this.l.postCode);
    this.addressLookupInput = this.activeForm.locator(this.l.addressLookup);
    this.addressSuggestions = this.activeForm.locator(this.l.addressSuggestions);
    this.submitButton = this.activeForm.locator(this.l.submitButton);
    this.country = this.activeForm.locator(this.l.country);
    this.enterAddressManually = this.activeForm.locator(this.l.enterAddressManually);
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
    await this.navigate("https://vsfstage.egoshoes.com/us");

    // Wait for top-level elements before clicking
    await this.accountIcon.waitFor({ state: "visible", timeout: 15000 });
    await this.accountIcon.click();

    await this.signupLink.waitFor({ state: "visible", timeout: 15000 });
    await this.signupLink.click();

    // Wait for drawer to appear
    await this.page.waitForSelector('[data-testid="register-page"]', { timeout: 30000 });
    await this.setActiveForm();
  }

  async enterInitialEmail(email) {
    if (!this.activeForm) await this.setActiveForm();

    const emailInput = this.activeForm.locator(this.l.initialEmailInput);
    await emailInput.waitFor({ state: "visible", timeout: 15000 });
    await emailInput.fill(email);

    const continueBtn = this.activeForm.locator(this.l.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: 10000 });
    await continueBtn.click();

    // Wait for first name input to appear after navigation
    await this.page.waitForSelector(this.l.firstName, { timeout: 30000 });
    await this.setActiveForm();
  }
  async enterUniqueEmail(email) {
    if (!this.activeForm) await this.setActiveForm();
    const emailInput = this.activeForm.locator(this.l.initialEmailInput);
    await emailInput.waitFor({ state: "visible", timeout: 15000 });
    await emailInput.fill(email);
    const continueBtn = this.activeForm.locator(this.l.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: 10000 });
    await continueBtn.click();
    await this.page.waitForSelector(this.l.firstName, { timeout: 30000 });
    await this.setActiveForm();
  }
  async clickContinue() {
    if (!this.activeForm) await this.setActiveForm();
    const continueBtn = this.activeForm.locator(this.l.continueButton);
    await continueBtn.waitFor({ state: "visible", timeout: 10000 });
    await continueBtn.click();

    await this.page.waitForSelector(this.l.firstName, { timeout: 15000 });
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

    await this.dob.day.selectOption("11");
    await this.dob.month.selectOption("December");
    await this.dob.year.selectOption("1998");
  }

  async selectCountry(countryName) {
    if (!this.activeForm) await this.setActiveForm();

    const countrySelect = this.activeForm.locator('select[data-testid="country-select"]');

    await countrySelect.waitFor({ state: "visible", timeout: 15000 });
    await countrySelect.selectOption({ label: countryName });

    // ⬇ After selecting a country, the phone input becomes visible
    this.phoneNumber = this.activeForm.locator('[data-testid="phone-input"]');

    await this.phoneNumber.waitFor({ state: "visible", timeout: 15000 });
  }

  async enterPhoneNumber(phoneNumber) {
    if (!this.activeForm) await this.setActiveForm();

    const phoneInput = this.activeForm.locator('[data-testid="phone-input"]');
    await phoneInput.waitFor({ state: "visible", timeout: 15000 });

    await phoneInput.fill(phoneNumber);
  }


  async chooseManualAddress() {
    if (!this.activeForm) await this.setActiveForm();
    await this.enterAddressManually.waitFor({ state: 'visible', timeout: 15000 });
    await this.enterAddressManually.click();
  }

  async enterAddress(details) {
    if (!this.activeForm) await this.setActiveForm();
    if (details.Street) await this.streetInput.fill(details.Street);
    if (details.City) await this.cityInput.fill(details.City);
    if (details["Post Code"]) await this.postCodeInput.fill(details["Post Code"]);
  }

  async addressLookup(postCode) {
    if (!this.activeForm) await this.setActiveForm();
    await this.addressLookupInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.addressLookupInput.fill(postCode);

    await this.addressSuggestions.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.addressSuggestions.first().click();
  }

  async disableMarketing() {
    const checkboxes = this.page.locator('[data-testid="checkbox"]');

    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      const isChecked = await checkbox.isChecked();

      if (isChecked) {
        await checkbox.uncheck();
      }
    }
  }

  async submitForm() {
    if (!this.activeForm) await this.setActiveForm();
    await this.submitButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.submitButton.click();
  }

  // async getErrorMessage() {
  //   if (!this.activeForm) await this.setActiveForm();
  //   return (await this.errorMessage.first().textContent())?.trim() || '';
  // }

  // async isRegistered() {
  //   await this.page.waitForLoadState('networkidle').catch(() => {});
  //   return this.page.url().includes("my-account");
  // }
}

module.exports = SignupPage;
