const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const HomePageLocators = require('../locators/EGO_Locators').HomePageLocators;

class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }
  async goToHomePage(url) {
    await this.navigate(url); 
  }
  async clickLogo() {
    await this.click(HomePageLocators.LOGO);
  }

  async verifySearchBarVisible() {
    await expect(this.page.locator(HomePageLocators.SEARCH_BAR)).toBeVisible();
  }

  async verifyBannerVisible(text) {
    const banner = this.page.locator(`:has-text("${text}")`);
    await expect(banner).toBeVisible();
  }

  async clickMainCategory(name) {
    const selector = HomePageLocators.getCategoryLink(name);
    await this.click(selector);
  }
  async scrollToWhatsHotSection() {
    await this.page.locator(HomePageLocators.WHATS_HOT_SECTION).scrollIntoViewIfNeeded();
  }

  async verifyWhatsHotProductsVisible() {
    const productCards = this.page.locator(HomePageLocators.PRODUCT_CARD);
    await expect(productCards.first()).toBeVisible();

    const productNames = this.page.locator(HomePageLocators.PRODUCT_NAME);
    await expect(productNames.first()).toBeVisible();

    const productPrices = this.page.locator(HomePageLocators.PRODUCT_PRICE);
    await expect(productPrices.first()).toBeVisible();

    const addButtons = this.page.locator(HomePageLocators.ADD_BUTTON);
    await expect(addButtons.first()).toBeVisible();
  }
  async scrollDown(pixels = 500) {
    await this.page.evaluate((px) => window.scrollBy(0, px), pixels);
  }

  async scrollUp(pixels = 500) {
    await this.page.evaluate((px) => window.scrollBy(0, -px), pixels);
  }
}

module.exports = HomePage;
