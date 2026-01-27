const BasePage = require("./basePage");
const { SearchLocators } = require("../locators/searchLocators");
const { testData } = require("../config/testData");
const { expect } = require("@playwright/test");
const { settle } = require("../utils/dynamicWait");

class SearchPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async toggleSearch() {
    const input = this.page.locator(SearchLocators.searchInput).first();
    if (!(await input.isVisible().catch(() => false))) {
      await this.click(this.page.locator(SearchLocators.searchTrigger).first());
      await input.waitFor({ state: "visible", timeout: testData.timeouts.large });
    }
  }

  async performSearch(keyword) {
    await this.closeModalIfPresent();
    await this.toggleSearch();

    const input = this.page.locator(SearchLocators.searchInput).first();
    await this.fill(input, keyword);
    await this.page.keyboard.press("Enter");

    try {
      await Promise.any([
        this.page.locator(SearchLocators.productResultItems).first().waitFor({ state: "visible", timeout: testData.timeouts.xlarge }),
        this.page.locator(SearchLocators.noResultsMessage).first().waitFor({ state: "visible", timeout: testData.timeouts.xlarge })
      ]);
    } catch {
    }
  }

  async verifySearchResults() {
    const results = this.page.locator(SearchLocators.productResultItems);
    await expect(results.first()).toBeVisible({ timeout: testData.timeouts.large });
    expect(await results.count()).toBeGreaterThan(0);
  }

  async verifyNoResults() {
    const noResults = this.page.locator(SearchLocators.noResultsMessage);
    const count = await noResults.count();

    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await noResults.nth(i).innerText();
      if (text.toLowerCase().includes('0 styles') || text.toLowerCase().includes('no products')) {
        found = true;
        break;
      }
    }

    if (!found) {
      await expect(noResults.first()).toBeVisible({ timeout: testData.timeouts.large });
    }
  }

  async verifyPlaceholder() {
    const input = this.page.locator(SearchLocators.searchInput).first();
    const placeholder = await input.getAttribute("placeholder");
    expect(placeholder).toBe(testData.search.placeholder);
  }

  async verifySearchBarVisibility() {
    await expect(this.page.locator(SearchLocators.searchInput).first()).toBeVisible();
  }

  async verifyTrendingCategories() {
    await this.closeModalIfPresent();
    await this.toggleSearch();

    const input = this.page.locator(SearchLocators.searchInput).first();
    await input.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await this.click(input);
    await settle(this.page, 600);

    const items = this.page.locator(SearchLocators.trendingItems);
    const header = this.page.locator(SearchLocators.trendingHeader);

    await Promise.any([
      header.first().waitFor({ state: 'visible', timeout: 15000 }),
      items.first().waitFor({ state: 'visible', timeout: 15000 })
    ]).catch(() => {
      throw new Error("Neither trending header nor items appeared in search overlay");
    });
  }

  async typeAndSeeSuggestions(keyword) {
    await this.closeModalIfPresent();
    await this.toggleSearch();
    await settle(this.page, 300);

    const input = this.page.locator(SearchLocators.searchInput).first();
    await input.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
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

  async selectFirstSuggestion() {
    const firstSuggestion = this.page.locator(SearchLocators.suggestionItems).first();
    await this.click(firstSuggestion);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clearSearchInput() {
    const input = this.page.locator(SearchLocators.searchInput).first();
    await this.fill(input, "");
    await expect(input).toHaveValue("");
  }

  async verifyOutOfStock() {
    const oos = this.page.locator(new RegExp(testData.search.outOfStockPattern, "i"));
    expect(await oos.count()).toBeGreaterThan(0);
  }

  async clickSearchInput() {
    await this.click(this.page.locator(SearchLocators.searchInput).first());
  }

  async clickBody() {
    await this.click("body");
  }

  async typeMore(text) {
    const input = this.page.locator(SearchLocators.searchInput).first();
    await input.type(text);
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

  async ensureHomeAndReady() {
    const currentUrl = this.page.url();
    const locale = process.env.LOCALE || 'us';
    const expectedBase = this.getBaseUrl(locale);
    const baseDomain = expectedBase.replace('https://', '').split('/')[0];
    
    // Only navigate if we're not already on the homepage
    // Check if URL contains the base domain and is not on a sub-page
    const isOnHomepage = currentUrl.includes(baseDomain) && 
                        !currentUrl.includes('/c/') && 
                        !currentUrl.includes('/p/') &&
                        !currentUrl.includes('/cart') &&
                        !currentUrl.includes('/checkout') &&
                        !currentUrl.includes('/my-account') &&
                        !currentUrl.includes('/search') &&
                        (currentUrl === expectedBase || currentUrl === expectedBase + '/');
    
    if (!isOnHomepage) {
      await super.ensureHomeAndReady(locale);
    } else {
      // Already on homepage, just ensure modals are closed
      await this.closeModalIfPresent();
      await settle(this.page, 200);
    }
  }
}

module.exports = SearchPage;
