const basePage = require("./basePage");
const { LoginLocators } = require("../locators/loginLocators");
const { testData } = require("../config/testData");

class loginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.accountIcon = page.locator(LoginLocators.accountIcon);
    this.emailInput = page.locator(LoginLocators.emailInput);
    this.passwordInput = page.locator(LoginLocators.passwordInput);
    this.submitButton = page.locator(LoginLocators.submitButton);

    this.popups = {
      closeModalBtn: page.locator(LoginLocators.popups.closeModalBtn),
      declineOfferBtn: page.locator(LoginLocators.popups.declineOfferBtn),
      button3: page.locator(LoginLocators.popups.button3)
    };

    this.errorMessage = page.locator(LoginLocators.errorMessage);
    this.logoutIndicator = page.locator(LoginLocators.logoutIndicator);
  }

  async navigateToLocale(locale) {
    const targetUrl = this.getBaseUrl(locale);
    console.log(`Navigating to dynamic URL: ${targetUrl}`);
    await this.navigate(targetUrl);
    await this.page.waitForLoadState("domcontentloaded");
    await this.closePopupIfPresent();
  }

  async closePopupIfPresent() {
    for (const popup of Object.values(this.popups)) {
      if (await popup.isVisible().catch(() => false)) {
        await popup.click().catch(() => { });
        await this.page.waitForTimeout(500);
        break;
      }
    }
  }

  async openLoginModal() {
    const currentLocale = process.env.LOCALE || 'us';

    // Explicitly wait for and handle cookies for UK/EU locales
    if (['uk', 'eu'].includes(currentLocale)) {
      console.log(`🔹 Locale is ${currentLocale}, waiting for cookie banner...`);
      await this.page.waitForTimeout(3000);
      await this.handleCookieConsent(5000);
    } else {
      await this.handleCookieConsent(1000);
    }

    await this.closeModalIfPresent();
    await this.accountIcon.first().click({ force: true });
    await this.emailInput.waitFor({ state: "visible", timeout: testData.timeouts.xlarge });
  }

  async performLogin(email = testData.login.email, password = testData.login.password) {
    console.log(`Performing login with: ${email}`);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL("**/my-account/**", { timeout: testData.timeouts.huge });
  }

  async isOnAccountPage() {
    return this.page.url().includes("my-account");
  }
}

module.exports = LoginPage;
