const { Given, When, Then } = require("@cucumber/cucumber");
const LogoutPage = require("../../pages/logoutPage");

Given("I am logged in", async function () {
  this.logoutPage = new LogoutPage(this.page);
  await this.logoutPage.login();
});

Given("Customer dashboard is displayed", async function () {
  await this.logoutPage.ensureDashboardDisplayed();
});

When("I click on logout", async function () {
  await this.logoutPage.clickLogout();
});

Then("I should be logged out", async function () {
  const loggedOut = await this.logoutPage.verifyLoggedOut();
  if (!loggedOut) throw new Error("User is still logged in");
});

Then("User is redirected to homepage", async function () {
  const redirected = await this.logoutPage.verifyRedirectedToHomepage();
  if (!redirected) throw new Error("User was not redirected to homepage");
});
