const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const LoginPage = require("../../pages/LoginPage");

When("I perform login with valid credentials", async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.openLoginModal();
  await this.loginPage.performLogin();
});

Then("I should be redirected to my account dashboard", async function () {
  expect(await this.loginPage.isOnAccountPage()).to.be.true;
});
