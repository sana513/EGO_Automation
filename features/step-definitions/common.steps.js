const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I open the website for {string}', async function (country) {
  const urlMap = {
    us: 'https://vsfstage.egoshoes.com/us',
    uk: 'https://vsfstage.ego.co.uk',
  };
  await this.page.goto(urlMap[country]);
});

Then('I should be successfully registered', async function () {
  await expect(this.page).toHaveURL('https://vsfstage.egoshoes.com/us/my-account/personal-data');
});

Then('I should be redirected to my account', async function () {
  await expect(this.page).toHaveURL('https://vsfstage.egoshoes.com/us/my-account/personal-data');
});
