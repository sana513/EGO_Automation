const BasePage = require("./basePage");
const LoginPage = require("./loginPage");
const { LogoutLocators } = require("../locators/logoutLocators");
const { LoginLocators } = require("../locators/loginLocators");
const { testData } = require("../config/testData");
const { settle } = require("../utils/dynamicWait");

class LogoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.accountIcon = page.locator(LoginLocators.accountIcon);
    this.loginPage = new LoginPage(page);
  }

  async login() {
    await this.loginPage.openLoginModal();
    await this.loginPage.performLogin();
    await this.ensureDashboardDisplayed();
  }

  async openAccountMenu() {
    await this.closeModalIfPresent();
    const icon = this.accountIcon.first();
    await icon.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await icon.click();
    await settle(this.page, 400);
  }

  async ensureDashboardDisplayed() {
    const locale = process.env.LOCALE || "us";
    const baseUrl = this.getBaseUrl(locale).replace(/\/$/, "");
    const url = `${baseUrl}${LogoutLocators.dashboardPath}`;
    await this.page.goto(url, { waitUntil: "load", timeout: testData.timeouts.large });
    await this.page.waitForLoadState("networkidle");
    await this.closeModalIfPresent();
    const ready = this.page.locator(LogoutLocators.dashboardReady).first();
    await ready.waitFor({ state: "visible", timeout: testData.timeouts.large });
    await settle(this.page, 500);
  }

  async clickLogout() {
    const isUK = ["uk", "eu"].includes(process.env.LOCALE || "us");
    const waitMs = isUK ? 800 : 500;

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await settle(this.page, waitMs);

    const timeout = isUK ? testData.timeouts.large : testData.timeouts.medium;
    let clicked = false;

    const listItem = this.page.locator(LogoutLocators.logoutListItem).first();
    if (await listItem.isVisible({ timeout }).catch(() => false)) {
      await listItem.scrollIntoViewIfNeeded();
      await settle(this.page, 200);
      await listItem.click();
      clicked = true;
    }

    if (!clicked) {
      const icon = this.page.locator(LogoutLocators.logoutIcon).first();
      if (await icon.isVisible({ timeout }).catch(() => false)) {
        await icon.scrollIntoViewIfNeeded();
        await settle(this.page, 200);
        await icon.evaluate(el => { const li = el.closest("li"); (li || el).click(); });
        clicked = true;
      }
    }

    if (!clicked) {
      throw new Error("Logout button not found. Tried: list-item:has(logout), [data-testid=logout] and parent li.");
    }

    await settle(this.page, 500);
    await this.page.waitForURL(u => !u.href.includes("my-account"), { timeout: testData.timeouts.large });
  }

  async performLogout() {
    await this.ensureDashboardDisplayed();
    await this.clickLogout();
  }

  async verifyLoggedOut() {
    const url = this.page.url();
    return !url.includes("my-account");
  }

  async verifyRedirectedToHomepage() {
    const locale = process.env.LOCALE || "us";
    const baseUrl = this.getBaseUrl(locale).replace(/\/$/, "");
    const url = this.page.url();
    if (url.includes("my-account")) return false;
    return url === baseUrl || url.startsWith(baseUrl + "/") || url.startsWith(baseUrl + "?");
  }

  async verifyLoggedIn() {
    const url = this.page.url();
    const hasAccount = await this.accountIcon.first().isVisible({ timeout: 2000 }).catch(() => false);
    return url.includes("my-account") || hasAccount;
  }
}

module.exports = LogoutPage;
