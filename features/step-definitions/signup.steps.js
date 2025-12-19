const { Given, When, Then } = require("@cucumber/cucumber");
const SignupPage = require("../../pages/signupPage");
const { generateEmail } = require("../support/utils");

let signup;

Given("I navigate to the registration page", async function () {
  signup = new SignupPage(this.page);
  await signup.navigateToSignup();  // ensures drawer and fields are ready
});

When("I enter a unique email for registration", async function () {
  // generate and store in world/context
  this.email = generateEmail();
  console.log("Generated email:", this.email); // debug
  await signup.enterInitialEmail(this.email);
  if (!signup.activeForm) await signup.setActiveForm();
});

When("I click continue", async function () {
  await signup.clickContinue();
});

When("I enter personal details:", async function (dataTable) {
  const details = dataTable.rowsHash();
  await signup.fillPersonalDetails(details);
  if (!signup.activeForm) await signup.setActiveForm();
});

When("I enter valid personal details", async function () {
  const details = {
    "First Name": "Test",
    "Last Name": "User",
    Password: "Rlt@20250101",
    "Confirm Password": "Rlt@20250101"
  };
  await signup.fillPersonalDetails(details);
  if (!signup.activeForm) await signup.setActiveForm();
});

When("I set date of birth", async function () {
  await signup.setDOB();
});

When("I select {string} as country", async function (country) {
  await signup.selectCountry(country);
});

When("I enter phone number {string}", async function (phone) {
  await signup.enterPhoneNumber(phone);
});

When("I choose to enter address manually", async function () {
  await signup.chooseManualAddress();
});

When("I enter address details:", async function (dataTable) {
  const details = dataTable.rowsHash();
  await signup.enterAddress(details);
});

When("I click {string}", async function (text) {
  if (!signup.activeForm) await signup.setActiveForm();
  const button = signup.activeForm.locator(`text=${text}`);
  await button.waitFor({ state: "visible", timeout: 15000 });
  await button.click();
});

When("I enter {string} in address lookup", async function (postCode) {
  await signup.addressLookup(postCode);
});

When("I select the first suggested address", async function () {
  if (!signup.activeForm) await signup.setActiveForm();
  const firstSuggestion = signup.activeForm.locator(signup.l.addressSuggestions).first();
  await firstSuggestion.waitFor({ state: "visible", timeout: 15000 });
  await firstSuggestion.click();
});

When("I opt out of all marketing communications", async function () {
  await signup.disableMarketing();
});

When("I submit the registration form", async function () {
  await signup.submitForm();
});

// When("I fill password with {string}", async function (password) {
//   if (!signup.activeForm) await signup.setActiveForm();
//   await signup.passwordInput.fill(password);
// });

// When("I fill confirm password with {string}", async function (password) {
//   if (!signup.activeForm) await signup.setActiveForm();
//   await signup.confirmPasswordInput.fill(password);
// });

// Then("I should be successfully registered", async function () {
//   const registered = await signup.isRegistered();
//   if (!registered) throw new Error("Registration not successful");
// });

// Then("I should be redirected to my account", async function () {
//   const url = signup.page.url();
//   if (!url.includes("my-account")) throw new Error("Not redirected to account page");
// });

// Then("I should see {string}", async function (msg) {
//   const errorText = await signup.getErrorMessage();
//   if (!errorText.includes(msg)) throw new Error(`Expected error: "${msg}", got "${errorText}"`);
// });

// Then("My registration should be complete", async function () {
//   const registered = await signup.isRegistered();
//   if (!registered) throw new Error("Registration not complete");
// });
