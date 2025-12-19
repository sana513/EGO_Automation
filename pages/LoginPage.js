const BasePage = require("./BasePage");
const locators = require("../locators/loginLocators");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    // Assign locators
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
    await this.navigate(`https://vsfstage.egoshoes.com/${locale}`);
    await this.page.waitForLoadState("domcontentloaded");
    await this.closePopupIfPresent();
  }

  async closePopupIfPresent() {
    for (const popup of Object.values(this.popups)) {
      if (await popup.isVisible().catch(() => false)) {
        await popup.click().catch(() => {});
        await this.page.waitForTimeout(500);
        break;
      }
    }
  }

  async openLoginModal() {
    await this.accountIcon.click();
    await this.emailInput.waitFor({ state: "visible", timeout: 10000 });
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
