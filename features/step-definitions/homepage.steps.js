const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../../pages/homepagePage');

let homePage;

// ======== Navigate / Homepage Steps ========
Given('I open the website for {string}', async function (region) {
  homePage = new HomePage(this.page);

  let url;
  switch (region.toLowerCase()) {
    case 'us':
      url = 'https://vsfstage.egoshoes.com/us/';
      break;
    case 'uk':
      url = 'https://vsfstage.egoshoes.com/uk/';
      break;
    default:
      throw new Error(`Unknown region: ${region}`);
  }

  await homePage.goToHomePage(url); // modal-safe navigation
});
Then('the homepage should be displayed', async function () {
  await expect(homePage.heroSection).toBeVisible();
});
Then('the page title should be visible', async () => {
  await expect(homepage.page).toHaveTitle(/EGO/i);
});

Then('the logo should be visible', async () => {
  await expect(homepage.logo).toBeVisible();
});

Then('the search bar should be visible', async () => {
  await expect(homepage.searchBar).toBeVisible();
});

Then('the navigation menu should be visible', async () => {
  await expect(homepage.navMenu).toBeVisible();
});

Then('the currency selector should be visible', async () => {
  await expect(homepage.currencySelector).toBeVisible();
});

Then(
  'the following navigation links should be visible:',
  async (dataTable) => {
    for (const link of dataTable.raw().flat()) {
      await expect(homepage.getNavLink(link)).toBeVisible();
    }
  }
);

Then('the hero banner should be visible', async () => {
  await expect(homepage.heroSection).toBeVisible();
});

Then('the hero heading text should be displayed', async () => {
  await expect(homepage.heroHeading).toBeVisible();
});

Then('the hero image should be displayed', async () => {
  await expect(homepage.heroImage).toBeVisible();
});

Then('the hero call to action button should be clickable', async () => {
  await expect(homepage.heroCTA).toBeEnabled();
});

Then('the {string} section should be visible', async (sectionName) => {
  await expect(homepage.getSectionByTitle(sectionName)).toBeVisible();
});

Then('each trend category should have an image and label', async () => {
  const items = await homepage.trendItems;
  expect(items.length).toBeGreaterThan(0);

  for (const item of items) {
    await expect(item.locator('img')).toBeVisible();
    await expect(item.locator('text=*')).toBeVisible();
  }
});

Then('the popular categories carousel should be displayed', async () => {
  await expect(homepage.popularCategoriesCarousel).toBeVisible();
});

Then('product cards should be displayed', async () => {
  const cards = await homepage.productCards;
  expect(cards.length).toBeGreaterThan(0);
});

Then(
  'each product card should show:',
  async (dataTable) => {
    for (const card of await homepage.productCards) {
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('.product-name')).toBeVisible();
      await expect(card.locator('.product-price')).toBeVisible();
      await expect(card.locator('button')).toBeVisible();
    }
  }
);

Then('the footer should be visible', async () => {
  await expect(homepage.footer).toBeVisible();
});
