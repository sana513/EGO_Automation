const BasePage = require("./BasePage");
const locators = require("../locators/EGO_Locators").LoginLocators;

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.accountIcon = page.locator(locators.accountIcon);
    this.emailInput = page.locator(locators.emailInput);
    this.passwordInput = page.locator(locators.passwordInput);
    this.submitButton = page.locator(locators.submitButton);

    this.popups = {
      closeModalBtn: page.locator(locators.popups.closeModalBtn),
      declineOfferBtn: page.locator(locators.popups.declineOfferBtn),
      button3: page.locator(locators.popups.button3)
    };

    this.errorMessage = page.locator(locators.errorMessage);
    this.logoutIndicator = page.locator(locators.logoutIndicator);
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
    await this.closeModalIfPresent();
    await this.accountIcon.first().click({ force: true });
    await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
  }

  async performLogin(email = "naveed.chughtai@rltsquare.com", password = "Rlt@20250101") {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL("**/my-account/**", { timeout: 20000 });
  }

  async isOnAccountPage() {
    return this.page.url().includes("my-account");
  }
}

module.exports = LoginPage;
