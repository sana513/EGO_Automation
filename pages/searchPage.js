const BasePage = require("./basePage");
const { SearchLocators } = require("../locators/searchLocators");
const { testData } = require("../config/testData");
const { expect } = require("@playwright/test");
const { settle } = require("../utils/dynamicWait");

class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async toggleSearch() {
    const input = this.page.locator(SearchLocators.searchInput).first();
    if (!(await input.isVisible().catch(() => false))) {
      await this.page.locator(SearchLocators.searchTrigger).first().click();
      await input.waitFor({ state: "visible", timeout: 10000 });
    }
  }

  async clickSearchInput() {
    const input = this.page.locator(SearchLocators.searchInput).first();
    await this.click(input);
  }

  async performSearch(keyword) {
    await this.closeModalIfPresent();
    await this.toggleSearch();

    const input = this.page.locator(SearchLocators.searchInput).first();
    await this.fill(input, keyword);

    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState('domcontentloaded', { timeout: testData.timeouts.large });

    try {
      await Promise.any([
        this.page.locator(SearchLocators.productResultItems).first().waitFor({ state: "visible", timeout: testData.timeouts.xlarge }),
        this.page.locator(SearchLocators.noResultsMessage).first().waitFor({ state: "visible", timeout: testData.timeouts.xlarge })
      ]);
    } catch {
      console.warn("No search results or no-results message appeared within expected time.");
    }
  }

  async typeAndSeeSuggestions(keyword) {
    await this.toggleSearch();
    await settle(this.page, 300);

    const input = this.page.locator(SearchLocators.searchInput).first();
    await input.waitFor({ state: "visible", timeout: testData.timeouts.medium });
    await this.fill(input, keyword);
    await settle(this.page, 500);

    await this.page.locator(SearchLocators.suggestionItems).first().waitFor({
      state: "visible",
      timeout: testData.timeouts.medium
    });
  }

  async verifySuggestionsVisible() {
    const suggestions = this.page.locator(SearchLocators.suggestionItems).first();
    await expect(suggestions).toBeVisible();
  }

  async verifySearchResults() {
    const results = this.page.locator(SearchLocators.productResultItems);
    await expect(results.first()).toBeVisible({ timeout: testData.timeouts.large });
    expect(await results.count()).toBeGreaterThan(0);
  }

  async verifyNoResults() {
    await this.closeModalIfPresent();
    const noResults = this.page.locator(SearchLocators.noResultsMessage);
    const count = await noResults.count();

    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await noResults.nth(i).innerText();
      if (text.toLowerCase().includes("0 styles") || text.toLowerCase().includes("no products")) {
        found = true;
        break;
      }
    }

    if (!found) {
      await expect(noResults.first()).toBeVisible({ timeout: testData.timeouts.large });
    }
  }

  async verifyTrendingCategories() {
    await this.toggleSearch();
    await settle(this.page, 600);

    const items = this.page.locator(SearchLocators.trendingItems);
    const header = this.page.locator(SearchLocators.trendingHeader);

    await Promise.any([
      header.first().waitFor({ state: "visible", timeout: 15000 }),
      items.first().waitFor({ state: "visible", timeout: 15000 })
    ]).catch(() => {
      throw new Error("Neither trending header nor items appeared in search overlay");
    });
  }

  async verifySearchBarVisibility() {
    await expect(this.page.locator(SearchLocators.searchInput).first()).toBeVisible();
  }

  async verifyPlaceholder() {
    const input = this.page.locator(SearchLocators.searchInput).first();
    const placeholder = await input.getAttribute("placeholder");
    expect(placeholder).toBe(testData.search.placeholder);
  }

  async closeSearchOverlay() {
    const closeBtn = this.page.locator(SearchLocators.closeSuggestions).first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.click(closeBtn);
    } else {
      await this.page.keyboard.press("Escape");
    }
    await settle(this.page, 400);
  }

  async openProductFromResultByIndex(index = 0) {
    const results = this.page.locator(SearchLocators.productResultItems);
    await results.first().waitFor({ state: "visible", timeout: testData.timeouts.large });

    const count = await results.count();
    if (count === 0) throw new Error("No search results found to open");
    if (index >= count) index = count - 1;

    await results.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: testData.timeouts.large });
  }
}

module.exports = SearchPage;
