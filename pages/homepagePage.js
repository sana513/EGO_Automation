const { expect } = require("@playwright/test");
const basePage = require("./basePage");
const { HomePageLocators } = require("../locators/homePageLocators");
const { testData } = require("../config/testData");
const { settle } = require("../utils/dynamicWait");

class HomePage extends basePage {
  constructor(page) {
    super(page);
  }

  async open(country = null) {
    // Use LOCALE from environment if set, otherwise use country parameter or default to 'us'
    const locale = process.env.LOCALE || country || 'us';
    await this.navigate(this.getBaseUrl(locale));
  }

  async verifyAllHomepageElements() {
    const locale = process.env.LOCALE || 'us';
    await this.open(locale);
    await this.page.waitForLoadState("domcontentloaded");
    await this.closeModalIfPresent();

    await expect(this.page.locator(HomePageLocators.LOGO)).toBeVisible();
    await expect(this.page.locator(HomePageLocators.HERO_BANNER)).toBeVisible();

    await this.page.mouse.wheel(0, 800);
    await settle(this.page, 300);
    await this.closeModalIfPresent();

    const productGrid = this.page.locator(HomePageLocators.PRODUCT_GRID_MAIN);
    await productGrid.scrollIntoViewIfNeeded();
    await expect(productGrid).toBeVisible();

    for (const locator of Object.values(HomePageLocators.CATEGORY_CARDS)) {
      await expect(this.page.locator(locator)).toBeVisible();
    }

    const popularHeading = this.page.locator(HomePageLocators.POPULAR_CATEGORY_HEADING);
    await popularHeading.scrollIntoViewIfNeeded();
    await settle(this.page, 300);
    await this.closeModalIfPresent();
    await expect(popularHeading).toBeVisible();

    const whatsHotHeading = this.page.locator(HomePageLocators.WHATS_HOT_HEADING);
    await whatsHotHeading.scrollIntoViewIfNeeded();
    await settle(this.page, 300);
    await this.closeModalIfPresent();
    await expect(whatsHotHeading).toBeVisible();
  }

  async verifyHeroBanner() {
    await expect(this.page.locator(HomePageLocators.HERO_BANNER)).toBeVisible();
  }

  async scrollToProductGrid() {
    const grid = this.page.locator(HomePageLocators.PRODUCT_GRID_MAIN);
    await this.page.mouse.wheel(0, 1200);
    await settle(this.page, 400);
    await this.closeModalIfPresent();
    await grid.waitFor({ state: "visible", timeout: testData.timeouts.extreme });
    await grid.scrollIntoViewIfNeeded();
  }

  async verifyCategory(category) {
    const locator = HomePageLocators.CATEGORY_CARDS[category];
    await expect(this.page.locator(locator).first()).toBeVisible();
  }

  async verifyPopularCategories() {
    const heading = this.page.locator(HomePageLocators.POPULAR_CATEGORY_HEADING);
    await heading.scrollIntoViewIfNeeded();
    await this.closeModalIfPresent();
    await expect(heading).toBeVisible();
  }

  async verifyWhatsHotSection() {
    const heading = this.page.locator(HomePageLocators.WHATS_HOT_HEADING);
    await heading.scrollIntoViewIfNeeded();
    await this.closeModalIfPresent();
    await expect(heading).toBeVisible();
  }

  async clickRandomAddFromWhatsHot() {
    const heading = this.page.locator(HomePageLocators.WHATS_HOT_HEADING);
    const buttons = this.page.locator(HomePageLocators.WHATS_HOT_ADD_BUTTONS);

    await heading.scrollIntoViewIfNeeded();
    await settle(this.page, 400);
    await this.closeModalIfPresent();

    let visibleIndexes = [];
    let attempts = 0;

    while (!visibleIndexes.length && attempts < 15) {
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        if (await buttons.nth(i).isVisible().catch(() => false)) {
          visibleIndexes.push(i);
        }
      }

      if (!visibleIndexes.length) {
        await this.page.mouse.wheel(0, 700);
        await settle(this.page, 300);
        await this.closeModalIfPresent();
        attempts++;
      }
    }

    if (!visibleIndexes.length) throw new Error("No visible ADD CTA found in What's Hot section");

    const randomIndex = visibleIndexes[Math.floor(Math.random() * visibleIndexes.length)];
    await buttons.nth(randomIndex).click();
  }

  async selectAnySize() {
    const preferredSizes = testData.homepage.preferredSizes;
    const container = this.page.locator(HomePageLocators.SIZE_CONTAINER);
    await container.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.closeModalIfPresent();

    for (const size of preferredSizes) {
      const btn = this.page.locator(HomePageLocators.SIZE_BY_TEXT(size));
      if (await btn.first().isVisible().catch(() => false)) {
        await btn.first().click();
        return;
      }
    }

    const allSizes = this.page.locator(HomePageLocators.SIZE_OPTIONS);
    await allSizes.first().click();
  }

  async addToBag() {
    const addBtn = this.page.locator(HomePageLocators.ADD_TO_BAG_BUTTON);
    await addBtn.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await settle(this.page, 200);
    await this.closeModalIfPresent();
    await addBtn.click();
  }
}

module.exports = HomePage;
