const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BasePage = require('../../pages/BasePage');

Given('I open the website for {string}', async function (country) {
  this.basePage = new BasePage(this.page);
  await this.basePage.navigate(this.basePage.getBaseUrl(country));
});

Then('I should be successfully registered', async function () {
  await expect(this.page).toHaveURL('https://vsfstage.egoshoes.com/us/my-account/personal-data');
});

Then('I should be redirected to my account', async function () {
  await expect(this.page).toHaveURL('https://vsfstage.egoshoes.com/us/my-account/personal-data');
});
