const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BasePage = require('../../pages/basePage');

Given('I open the website for {string}', async function (country) {
  this.basePage = new BasePage(this.page);

  // Use LOCALE from environment if set, otherwise use the country parameter
  const locale = process.env.LOCALE || country;
  await this.basePage.navigate(this.basePage.getBaseUrl(locale));
});

Given('I open the website', async function () {
  this.basePage = new BasePage(this.page);
  const locale = process.env.LOCALE || 'us';
  await this.basePage.navigate(this.basePage.getBaseUrl(locale));
});


Then('I should be successfully registered', async function () {
  const currentLocale = process.env.LOCALE || 'us';
  const expectedUrl = `${this.basePage.getBaseUrl(currentLocale)}/my-account/personal-data`;
  await expect(this.page).toHaveURL(expectedUrl);
});

Then('I should be redirected to my account', async function () {
  const currentLocale = process.env.LOCALE || 'us';
  const expectedUrl = `${this.basePage.getBaseUrl(currentLocale)}/my-account/personal-data`;
  await expect(this.page).toHaveURL(expectedUrl);
});
