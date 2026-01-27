const { Given, When, Then } = require("@cucumber/cucumber");
const SignupPage = require("../../pages/signupPage");
const { generateEmail } = require("../support/utils");
const { testData } = require("../../config/testData");
let signup;

Given("I navigate to the registration page", async function () {
  signup = new SignupPage(this.page);
  await signup.navigateToSignup();
});

When("I enter a unique email for registration", async function () {
  this.email = generateEmail();
  console.log("Generated email:", this.email);
  await signup.enterInitialEmail(this.email);
  if (!signup.activeForm) await signup.setActiveForm();
});

When("I click continue", async function () {
  await signup.clickContinue();
});

When("I enter personal details", async function () {
  const details = {
    "First Name": testData.registration.personalDetails.firstName,
    "Last Name": testData.registration.personalDetails.lastName,
    Password: testData.registration.personalDetails.password,
    "Confirm Password": testData.registration.personalDetails.confirmPassword
  };
  await signup.fillPersonalDetails(details);
  if (!signup.activeForm) await signup.setActiveForm();
});

When("I set date of birth", async function () {
  await signup.setDOB();
});

When("I select country and enter phone number", async function () {
  const currentLocale = process.env.LOCALE || 'us';
  const targetCountry = testData.registration.locales[currentLocale]?.country || "United States";
  const targetPhone = testData.registration.locales[currentLocale]?.phone || "2125551234";

  console.log(`Current Locale: ${currentLocale}, Selecting Country: ${targetCountry}, Phone: ${targetPhone}`);

  await signup.selectCountry(targetCountry);
  await signup.enterPhoneNumber(targetPhone);
});

When("I select country and enter phone number for registration", async function () {
  const locale = testData.e2e?.registrationLocale || 'uk';
  const { country, phone } = testData.registration.locales[locale] || testData.registration.locales.uk;
  await signup.selectCountry(country);
  await signup.enterPhoneNumber(phone);
});

When("I enter registration address details", async function () {
  const locale = testData.e2e?.registrationLocale || 'uk';
  const address = testData.registration.locales[locale]?.address || testData.registration.locales.uk.address;
  const details = {
    Street: address.street,
    City: address.city,
    "Post Code": address.postCode
  };
  if (address.state) details.State = address.state;
  await signup.enterAddress(details);
});

When("I choose to enter address manually", async function () {
  await signup.chooseManualAddress();
});

When("I enter address details", async function () {
  const currentLocale = process.env.LOCALE || 'us';
  const localeData = testData.registration.locales[currentLocale]?.address;

  if (localeData) {
    const addressDetails = {
      Street: localeData.street,
      City: localeData.city,
      "Post Code": localeData.postCode
    };

    // Add state if it exists in locale data
    if (localeData.state) {
      addressDetails.State = localeData.state;
    }

    await signup.enterAddress(addressDetails);
  } else {
    throw new Error(`Address data not found for locale: ${currentLocale}`);
  }
});

When("I click {string}", async function (text) {
  if (!signup.activeForm) await signup.setActiveForm();
  const button = signup.activeForm.locator(`text=${text}`);
  await button.waitFor({ state: "visible", timeout: testData.timeouts.xlarge });
  await button.click();
});

When("I enter {string} in address lookup", async function (postCode) {
  await signup.addressLookup(postCode);
});

When("I select the first suggested address", async function () {
  if (!signup.activeForm) await signup.setActiveForm();
  const firstSuggestion = signup.activeForm.locator(signup.l.addressSuggestions).first();
  await firstSuggestion.waitFor({ state: "visible", timeout: testData.timeouts.xlarge });
  await firstSuggestion.click();
});

When("I opt out of all marketing communications", async function () {
  await signup.disableMarketing();
});

When("I submit the registration form", async function () {
  await signup.submitForm();
});
