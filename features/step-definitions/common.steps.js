const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BasePage = require('../../pages/BasePage');

Given('I open the website for {string}', async function (country) {
  this.basePage = new BasePage(this.page);

  // If global ENV or LOCALE is set via command line, use global config
  // Otherwise, use the locale from the feature file
  const useGlobalConfig = process.env.ENV || process.env.LOCALE;

  if (useGlobalConfig) {
    // Use global configuration (ignores the country parameter from feature file)
    await this.basePage.navigate(this.basePage.getBaseUrl());
  } else {
    // Use the locale specified in the feature file
    await this.basePage.navigate(this.basePage.getBaseUrl(country));
  }
});

Then('I should be successfully registered', async function () {
  await expect(this.page).toHaveURL('https://vsfstage.egoshoes.com/us/my-account/personal-data');
});

Then('I should be redirected to my account', async function () {
  await expect(this.page).toHaveURL('https://vsfstage.egoshoes.com/us/my-account/personal-data');
});
