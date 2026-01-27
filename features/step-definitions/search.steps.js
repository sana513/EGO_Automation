const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const SearchPage = require("../../pages/searchPage");
const { testData } = require("../../config/testData");
const { SearchLocators } = require("../../locators/searchLocators");

Given("I navigate to the homepage", async function () {
    this.searchPage = new SearchPage(this.page);
    await this.searchPage.ensureHomeAndReady();
});

When("I search for {string}", async function (keyword) {
    const term = keyword === "valid" ? testData.search.keywords.valid : keyword;
    await this.searchPage.performSearch(term);
});

When("I search for a valid product", async function () {
    await this.searchPage.performSearch(testData.search.keywords.valid);
});

When("I search for an invalid product", async function () {
    await this.searchPage.performSearch(testData.search.keywords.invalid);
});

Then("I should see search results", async function () {
    await this.searchPage.verifySearchResults();
});

Then("I should see a no results message", async function () {
    await this.searchPage.verifyNoResults();
});

When("I type {string} in the search box", async function (keyword) {
    const term = keyword === "valid" ? testData.search.keywords.valid : keyword;
    await this.searchPage.typeAndSeeSuggestions(term);
});

When("I type a valid keyword in the search box", async function () {
    await this.searchPage.typeAndSeeSuggestions(testData.search.keywords.valid);
});

When("I click on the search input", async function () {
    await this.searchPage.toggleSearch();
    await this.searchPage.clickSearchInput();
});

Then("the search suggestion box should appear", async function () {
    await this.searchPage.verifySuggestionsVisible();
});

Then("the trending categories menu should be visible", async function () {
    await this.searchPage.verifyTrendingCategories();
});

When("I close the search overlay", async function () {
    await this.searchPage.closeSearchOverlay();
});

When("I click on the search icon again", async function () {
    await this.searchPage.toggleSearch();
});

Then("the search bar should be visible", async function () {
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

Then("the search bar should be visible and aligned in the header", async function () {
    await this.searchPage.verifySearchBarVisibility();
});

Then("the placeholder text in the search bar should be correct", async function () {
    await this.searchPage.verifyPlaceholder();
});
