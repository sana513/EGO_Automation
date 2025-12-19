const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const LoginPage = require("../../pages/loginPage");

Given("I open the website for {string}", async function (locale) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLocale(locale);
});

When("I perform login with valid credentials", async function () {
  await this.loginPage.openLoginModal();
  await this.loginPage.performLogin();
});

Then("I should be redirected to my account dashboard", async function () {
  expect(await this.loginPage.isOnAccountPage()).to.be.true;
});
