const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BasePage = require('../../pages/basePage');

Given('I open the website for {string}', async function (country) {
  this.basePage = new BasePage(this.page);

  const useGlobalConfig = process.env.ENV || process.env.LOCALE;

  if (useGlobalConfig) {
    await this.basePage.navigate(this.basePage.getBaseUrl());
  } else {
    await this.basePage.navigate(this.basePage.getBaseUrl(country));
  }
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
