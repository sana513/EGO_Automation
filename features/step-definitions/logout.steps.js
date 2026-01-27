const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const LoginPage = require("../../pages/loginPage");
const LogoutPage = require("../../pages/logoutPage");
const { testData } = require("../../config/testData");

Given("I am logged in", async function () {
  this.loginPage = new LoginPage(this.page);
  const locale = process.env.LOCALE || 'us';
  await this.loginPage.navigate(this.loginPage.getBaseUrl(locale));
  await this.loginPage.openLoginModal();
  await this.loginPage.performLogin();
  await this.page.waitForLoadState("networkidle");
});

Given("I am logged in with email {string} and password {string}", async function (email, password) {
  this.loginPage = new LoginPage(this.page);
  const locale = process.env.LOCALE || 'us';
  await this.loginPage.navigate(this.loginPage.getBaseUrl(locale));
  await this.loginPage.openLoginModal();
  await this.loginPage.performLogin(email, password);
  await this.page.waitForLoadState("networkidle");
});

When("I click on the account icon", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  await this.logoutPage.openAccountMenu();
});

When("I click on logout", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  try {
    await this.logoutPage.performLogout();
  } catch (error) {
    console.error('Logout failed:', error.message);
    throw new Error(`Failed to logout: ${error.message}`);
  }
});

When("I logout from my account", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  try {
    await this.logoutPage.performLogout();
  } catch (error) {
    console.error('Logout failed:', error.message);
    throw new Error(`Failed to logout: ${error.message}`);
  }
});

Then("I should be logged out", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  const isLoggedOut = await this.logoutPage.verifyLoggedOut();
  expect(isLoggedOut).toBe(true);
});

Then("I should see the sign in option", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  const isLoggedOut = await this.logoutPage.verifyLoggedOut();
  expect(isLoggedOut).toBe(true);
});

Then("I should be redirected to the homepage", async function () {
  const currentUrl = this.page.url();
  const locale = process.env.LOCALE || 'us';
  const baseUrl = process.env.BASE_URL || (locale === 'uk' ? 'https://vsfstage.ego.co.uk' : `https://vsfstage.egoshoes.com/${locale}`);
  
  expect(currentUrl).toMatch(new RegExp(baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

Then("I should not be on the account page", async function () {
  const isOnAccountPage = this.page.url().includes("my-account");
  expect(isOnAccountPage).toBe(false);
});

Then("I should be logged in", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  const isLoggedIn = await this.logoutPage.verifyLoggedIn();
  expect(isLoggedIn).toBe(true);
});

Given("I navigate to my account page", async function () {
  if (!this.logoutPage) {
    this.logoutPage = new LogoutPage(this.page);
  }
  const locale = process.env.LOCALE || 'us';
  const baseUrl = this.logoutPage.getBaseUrl(locale);
  await this.page.goto(`${baseUrl}/my-account`, { waitUntil: 'load' });
  await this.page.waitForLoadState("networkidle");
});

When("I enter email for login", async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.openLoginModal();
  await this.loginPage.emailInput.fill(testData.login.email);
});

When("I enter password for login", async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.passwordInput.fill(testData.login.password);
});

When("I click on the login button", async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.submitButton.click();
  await this.page.waitForURL("**/my-account/**", { timeout: testData.timeouts.huge });
});
