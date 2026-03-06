const BasePage = require("./basePage");
const { LoginLocators } = require("../locators/loginLocators");
const { testData } = require("../config/testData");
const { TIMEOUTS } = require("../config/constants");
const { loginLogs } = require("../config/egoLogs");
const { loginLabels } = require("../config/egoLabels");
const { isLocaleInList } = require("../features/support/utils");

class LoginPage extends BasePage {
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
    console.log(`${loginLogs.navigatingToUrl} ${targetUrl}`);
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
    const currentLocale = process.env.LOCALE || loginLabels.locales.us;

    if (isLocaleInList(currentLocale, [loginLabels.locales.uk, loginLabels.locales.eu, loginLabels.locales.au])) {
      console.log(`${loginLogs.waitingCookieBanner} ${currentLocale}, waiting for cookie banner...`);
      await this.page.waitForTimeout(3000);
      await this.handleCookieConsent(true);
    } else {
      await this.handleCookieConsent(false);
    }

    await this.closeModalIfPresent();
    await this.accountIcon.first().click({ force: true });
    await this.emailInput.first().waitFor({ state: "visible", timeout: TIMEOUTS.xlarge });
  }

  async performLogin(email = testData.login.email, password = testData.login.password) {
    console.log(`${loginLogs.performingLogin} ${email}`);
    await this.emailInput.first().fill(email);
    await this.passwordInput.first().fill(password);
    await this.submitButton.first().click();
    await this.page.waitForURL(loginLabels.urls.myAccount, { timeout: TIMEOUTS.huge });
  }

  async isOnAccountPage() {
    return this.page.url().includes(loginLabels.urls.myAccount.replace('**/', '').replace('/**', ''));
  }
}

module.exports = LoginPage;