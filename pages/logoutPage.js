const BasePage = require("./basePage");
const LoginPage = require("./loginPage");
const { LogoutLocators } = require("../locators/logoutLocators");
const { LoginLocators } = require("../locators/loginLocators");
const { testData } = require("../config/testData");
const { TIMEOUTS } = require("../config/constants");
const { settle } = require("../utils/dynamicWait");
const { isLocaleInList } = require("../features/support/utils");

class LogoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.accountIcon = page.locator(LoginLocators.accountIcon);
  }

  async login() {
    await this.loginPage.openLoginModal();
    await this.loginPage.performLogin();
    await this.ensureDashboardDisplayed();
  }

  async ensureDashboardDisplayed() {
    const baseUrl = this.getBaseUrl(process.env.LOCALE || "us").replace(/\/$/, "");
    await this.page.goto(`${baseUrl}${LogoutLocators.dashboardPath}`, {
      waitUntil: "load",
      timeout: TIMEOUTS.large
    });
    await this.page.waitForLoadState("networkidle");
    await this.closeModalIfPresent();
    await this.page.locator(LogoutLocators.dashboardReady).first()
      .waitFor({ state: "visible", timeout: TIMEOUTS.large });
    await settle(this.page, 500);
  }

  async clickLogout() {
    const isUK = isLocaleInList(process.env.LOCALE || "us", ["uk", "eu"]);
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await settle(this.page, isUK ? 800 : 500);

    const timeout = isUK ? TIMEOUTS.large : TIMEOUTS.medium;
    const candidates = [
      this.page.locator(LogoutLocators.logoutListItem).first(),
      this.page.locator(LogoutLocators.logoutIcon).first()
    ];

    for (const el of candidates) {
      if (await el.isVisible({ timeout }).catch(() => false)) {
        await el.scrollIntoViewIfNeeded();
        await settle(this.page, 200);
        await el.click();
        await settle(this.page, 500);
        await this.page.waitForURL(u => !u.href.includes("my-account"), { timeout: TIMEOUTS.large });
        return;
      }
    }

    throw new Error("Logout button not found.");
  }

  async performLogout() {
    await this.ensureDashboardDisplayed();
    await this.clickLogout();
  }

  async verifyLoggedOut() {
    return !this.page.url().includes("my-account");
  }

  async verifyRedirectedToHomepage() {
    const baseUrl = this.getBaseUrl(process.env.LOCALE || "us").replace(/\/$/, "");
    const url = this.page.url();
    return !url.includes("my-account") &&
      (url === baseUrl || url.startsWith(baseUrl + "/") || url.startsWith(baseUrl + "?"));
  }

  async verifyLoggedIn() {
    return this.page.url().includes("my-account") ||
      await this.accountIcon.first().isVisible({ timeout: 2000 }).catch(() => false);
  }
}

module.exports = LogoutPage;
