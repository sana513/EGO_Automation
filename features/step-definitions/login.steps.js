const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const LoginPage = require("../../pages/loginPage.js");

When("I perform login with valid credentials from test data", async function () {
  this.loginPage = new LoginPage(this.page);
  const locale = process.env.LOCALE || 'us';
  await this.loginPage.navigate(this.loginPage.getBaseUrl(locale));
  await this.loginPage.openLoginModal();
  await this.loginPage.performLogin();
});

When("I perform login with valid credentials", async function () {
  this.loginPage = new LoginPage(this.page);
  const locale = process.env.LOCALE || 'us';
  await this.loginPage.navigate(this.loginPage.getBaseUrl(locale));
  await this.loginPage.openLoginModal();
  await this.loginPage.performLogin();
});

Then("I should be redirected to my account dashboard", async function () {
  expect(await this.loginPage.isOnAccountPage()).to.be.true;
});
