const { Given, When, Then } = require("@cucumber/cucumber");
const HomePage = require("../../pages/homepagePage");
const { testData } = require("../../config/testData");

Given("I open the homepage for {string}", async function (country) {
  this.homePage = new HomePage(this.page);

  // Use LOCALE from environment if set, otherwise use the country parameter
  const locale = process.env.LOCALE || country;
  await this.homePage.open(locale);
});

Given("I open the homepage", async function () {
  this.homePage = new HomePage(this.page);
  // Use LOCALE from environment if set, otherwise default to 'us'
  const locale = process.env.LOCALE || 'us';
  await this.homePage.open(locale);
});

Then("I verify all homepage elements", async function () {
  this.homePage = new HomePage(this.page);
  await this.homePage.verifyAllHomepageElements();
});

Then("I should see the hero banner", async function () {
  await this.homePage.verifyHeroBanner();
});

When("I scroll down and verify product category grid", async function () {
  await this.homePage.scrollToProductGrid();
});

Then("I should see all configured categories", async function () {
  const categories = testData.homepage.categories;
  for (const category of categories) {
    await this.homePage.verifyCategory(category);
  }
});

Then("I should see Popular Categories section", async function () {
  await this.homePage.verifyPopularCategories();
});

Then("I should see What's Hot section", async function () {
  await this.homePage.verifyWhatsHotSection();
});

When("I click any random Add CTA from What's Hot section", async function () {
  await this.homePage.clickRandomAddFromWhatsHot();
});

When("I select any available size from the quick-add modal", async function () {
  await this.homePage.selectAnySize();
});

Then("I add the product to the bag from the homepage section", async function () {
  await this.homePage.addToBag();
});
