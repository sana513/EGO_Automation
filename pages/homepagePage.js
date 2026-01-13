const { expect } = require("@playwright/test");
const BasePage = require("./BasePage");
const { HomePageLocators } = require("../locators/EGO_Locators");

class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  async open(country) {
    await this.navigate(`https://vsfstage.egoshoes.com/${country}`);
  }

  async verifyHeroBanner() {
    await expect(this.page.locator(HomePageLocators.HERO_BANNER)).toBeVisible();
  }

  async scrollToProductGrid() {
    const grid = this.page.locator(HomePageLocators.PRODUCT_GRID_MAIN);

    await this.page.mouse.wheel(0, 1200);
    await this.page.waitForTimeout(800);
    await this.closeModalIfPresent();

    await grid.waitFor({ state: "visible", timeout: 30000 });
    await grid.scrollIntoViewIfNeeded();
  }

  async verifyCategory(category) {
    const locator = HomePageLocators.CATEGORY_CARDS[category];
    await expect(this.page.locator(locator)).toBeVisible();
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
    await this.page.waitForTimeout(600);
    await this.closeModalIfPresent();

    let visibleIndexes = [];
    let attempts = 0;

    while (visibleIndexes.length === 0 && attempts < 15) {
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        if (await buttons.nth(i).isVisible().catch(() => false)) {
          visibleIndexes.push(i);
        }
      }

      if (!visibleIndexes.length) {
        await this.page.mouse.wheel(0, 700);
        await this.page.waitForTimeout(500);
        await this.closeModalIfPresent();
        attempts++;
      }
    }

    if (!visibleIndexes.length) {
      throw new Error("No visible ADD CTA found in What's Hot section");
    }

    const randomIndex =
      visibleIndexes[Math.floor(Math.random() * visibleIndexes.length)];

    await buttons.nth(randomIndex).click();
  }

  async selectAnySize() {
    const preferredSizes = ["UK 6", "UK 7", "UK 5"];
    const container = this.page.locator(HomePageLocators.SIZE_CONTAINER);

    await container.waitFor({ state: "visible", timeout: 20000 });
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

    await addBtn.waitFor({ state: "visible", timeout: 20000 });
    await this.page.waitForFunction(
      el => !el.hasAttribute("disabled"),
      await addBtn.elementHandle()
    );

    await this.closeModalIfPresent();
    await addBtn.click();
  }
}

module.exports = HomePage;
