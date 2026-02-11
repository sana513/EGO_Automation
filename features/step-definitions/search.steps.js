const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const SearchPage = require("../../pages/searchPage");
const { testData } = require("../../config/testData");
const { SearchLocators } = require("../../locators/searchLocators");

When("I search for {string}", async function (keyword) {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  const term = keyword === "valid" ? testData.search.keywords.valid : keyword;
  await this.searchPage.performSearch(term);
});

When("I type {string} in the search box", async function (keyword) {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  const term = keyword === "valid" ? testData.search.keywords.valid : keyword;
  await this.searchPage.typeAndSeeSuggestions(term);
});

When("I type a valid keyword in the search box", async function () {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  await this.searchPage.typeAndSeeSuggestions(testData.search.keywords.valid);
});

When("I search for a valid product", async function () {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  await this.searchPage.performSearch(testData.search.keywords.valid);
});

When("I search for an invalid product", async function () {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  await this.searchPage.performSearch(testData.search.keywords.invalid);
});

When("I click on the search input", async function () {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  await this.searchPage.toggleSearch();
  await this.searchPage.clickSearchInput();
});

When("I close the search overlay", async function () {
  await this.searchPage.closeSearchOverlay();
});

When("I click on the search icon again", async function () {
  await this.searchPage.toggleSearch();
});

Then("the search bar should be visible", async function () {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  await this.searchPage.verifySearchBarVisibility();
});

Then("the search input should still contain {string}", async function (expectedText) {
  const term = expectedText === "valid" ? testData.search.keywords.valid : expectedText;
  const value = await this.page.locator(SearchLocators.searchInput).first().inputValue();
  expect(value).toBe(term);
});

Then("the search input should still contain the valid keyword", async function () {
  const term = testData.search.keywords.valid;
  const value = await this.page.locator(SearchLocators.searchInput).first().inputValue();
  expect(value).toBe(term);
});

Then("the search suggestion box should appear", async function () {
  await this.searchPage.verifySuggestionsVisible();
});

Then("the trending categories menu should be visible", async function () {
  await this.searchPage.verifyTrendingCategories();
});

Then("I should see search results", async function () {
  await this.searchPage.verifySearchResults();
});

Then("I should see a no results message", async function () {
  await this.searchPage.verifyNoResults();
});

Then("the search bar should be visible and aligned in the header", async function () {
  if (!this.searchPage) {
    this.searchPage = new SearchPage(this.page);
  }
  await this.searchPage.verifySearchBarVisibility();
});

Then("the placeholder text in the search bar should be correct", async function () {
  await this.searchPage.verifyPlaceholder();
});
