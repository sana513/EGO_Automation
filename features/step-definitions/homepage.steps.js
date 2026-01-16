const { Given, When, Then } = require("@cucumber/cucumber");
const HomePage = require("../../pages/homepagePage");

Given("I open the homepage for {string}", async function (country) {
  this.homePage = new HomePage(this.page);

  // If global ENV or LOCALE is set via command line, use global config
  const useGlobalConfig = process.env.ENV || process.env.LOCALE;

  if (useGlobalConfig) {
    await this.homePage.open(); // Uses global locale
  } else {
    await this.homePage.open(country); // Uses locale from feature file
  }
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

Then("I should see Co-Ords category", async function () {
  await this.homePage.verifyCategory("CO_ORDS");
});

Then("I should see Tops category", async function () {
  await this.homePage.verifyCategory("TOPS");
});

Then("I should see Dresses category", async function () {
  await this.homePage.verifyCategory("DRESSES");
});

Then("I should see Loungewear category", async function () {
  await this.homePage.verifyCategory("LOUNGEWEAR");
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
