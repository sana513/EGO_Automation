const { Given, When, Then } = require("@cucumber/cucumber");
const HomePage = require("../../pages/homepagePage");

Given("I open the homepage for {string}", async function (country) {
  this.homePage = new HomePage(this.page);
  await this.homePage.open(country);
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

When("I select any available size", async function () {
  await this.homePage.selectAnySize();
});

Then("I add the product to the bag", async function () {
  await this.homePage.addToBag();
});
