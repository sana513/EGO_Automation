const { expect } = require('@playwright/test');
const HomePageLocators = require('../locators/EGO_Locators');

class HomePage {
  constructor(page) {
    this.page = page;
  }

  // ======== Header Actions ========
  async goToHomePage(url) {
    await this.page.goto(url);
  }
async declineModalIfPresent() {
  const modalWrapper = this.page.locator(
    HomePageLocators.modal.BUTTON2_WRAPPER
  );

  const declineButton = this.page.locator(
    HomePageLocators.modal.BUTTON2
  );

  if (await modalWrapper.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Modal detected — declining');

    await declineButton.click();

    // Wait for modal to disappear
    await modalWrapper.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  } else {
    console.log('Modal not present — continuing');
  }
}


  async handlePromoBanner() {
    const banners = this.page.locator(HomePageLocators.PROMO_BANNERS);
    const count = await banners.count();
    if (count > 0) {
      console.log(`Found ${count} promo banner(s). Hiding them...`);
      await this.page.evaluate((selector) => {
        document.querySelectorAll(selector).forEach(el => (el.style.display = 'none'));
      }, HomePageLocators.PROMO_BANNERS);
      await this.page.waitForTimeout(500);
    }
  }

  async clickLogo() {
    await this.page.click(HomePageLocators.LOGO);
  }

  async searchFor(text) {
    const SEARCH_BAR = this.page.locator(HomePageLocators.SEARCH_BAR);
    await expect(SEARCH_BAR).toBeVisible();
    await SEARCH_BAR.fill(text);
    await this.page.click(HomePageLocators.SEARCH_ICON); // fixed double click
  }

  async verifySearchBarVisible() {
    await expect(this.page.locator(HomePageLocators.SEARCH_BAR)).toBeVisible();
  }

  async openCart() {
    await this.page.click(HomePageLocators.CART_ICON);
  }

  async openWishlist() {
    await this.page.click(HomePageLocators.WISHLIST_ICON);
  }

  // ======== Main Banner Actions ========
  async clickMainBanner(name, expectedUrlPart) {
    const selector = `a.main-banner-link:has-text("${name}")`;
    await Promise.all([
      this.page.waitForURL(`**${expectedUrlPart}**`),
      this.page.click(selector)
    ]);
  }

  // ======== Main Category Actions ========
  async clickMainCategory(name) {
    const selector = `span[data-v-497370f6]:has-text("${name}")`;
    await this.page.click(selector);
  }

  // ======== Subcategory Actions ========
  async clickSubCategory(name) {
    const selector = HomePageLocators.getCategoryLink(name);
    await this.page.click(selector);
  }

  // ======== What's Hot Section ========
  async scrollToWhatsHotSection() {
    await this.page.locator(HomePageLocators.WHATS_HOT_SECTION).scrollIntoViewIfNeeded();
  }

  async verifyWhatsHotProductsVisible() {
    const productCards = this.page.locator(HomePageLocators.PRODUCT_CARD);
    await expect(productCards.first()).toBeVisible();

    const productImages = this.page.locator(HomePageLocators.PRODUCT_IMAGE);
    await expect(productImages.first()).toBeVisible();

    const productNames = this.page.locator(HomePageLocators.PRODUCT_NAME);
    await expect(productNames.first()).toBeVisible();

    const productPrices = this.page.locator(HomePageLocators.PRODUCT_PRICE);
    await expect(productPrices.first()).toBeVisible();

    const addButtons = this.page.locator(HomePageLocators.ADD_BUTTON);
    await expect(addButtons.first()).toBeVisible();
  }

  // ======== Scroll Utilities ========
  async scrollDown(pixels = 500) {
    await this.page.evaluate((px) => window.scrollBy(0, px), pixels);
  }

  async scrollUp(pixels = 500) {
    await this.page.evaluate((px) => window.scrollBy(0, -px), pixels);
  }

  async scrollToElement(selector) {
    const element = await this.page.$(selector);
    if (element) {
      await element.scrollIntoViewIfNeeded();
    } else {
      throw new Error(`Element not found for selector: ${selector}`);
    }
  }

  // ======== Product Actions ========
  async clickProductByIndex(index) {
    const selector = HomePageLocators.getProductByIndex(index);
    const element = await this.page.$(selector);
    if (element) {
      await element.click();
    } else {
      throw new Error(`Product not found at index ${index}`);
    }
  }

  async clickProductByName(name) {
    const selector = HomePageLocators.getProductByName(name);
    const element = await this.page.$(selector);
    if (element) {
      await element.click();
    } else {
      throw new Error(`Product not found with name: ${name}`);
    }
  }

  async addToCartByIndex(index) {
    const selector = `${HomePageLocators.getProductByIndex(index)} button:has-text("Add to Bag")`;
    const element = await this.page.$(selector);
    if (element) {
      await element.click();
    } else {
      throw new Error(`Add to Bag button not found for product at index ${index}`);
    }
  }

  // ======== Assertions ========
  async verifyCategoryVisible(name) {
    const selector = `span[data-v-497370f6]:has-text("${name}")`;
    const element = await this.page.$(selector);
    if (element) {
      await expect(this.page.locator(selector)).toBeVisible();
    } else {
      throw new Error(`Category not visible: ${name}`);
    }
  }
}

module.exports = HomePage;
