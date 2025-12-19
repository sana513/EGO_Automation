const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../../pages/homepagePage');

let homePage;

// ===== Background Steps =====
Given('I navigate to the homepage', async function () {
  homePage = new HomePage(this.page);
  await homePage.goToHomePage('https://vsfstage.egoshoes.com/us/'); // replace with actual URL
});

Given('I decline the modal if it appears', async function () {
  const modalSelector = 'div.modal button.close';
  const modal = await this.page.$(modalSelector);
  if (modal) {
    await modal.click();
  }
});

// ===== Header Assertions =====
Then('I should see the site logo', async function () {
  await homePage.clickLogo();
});

Then('I should see the search bar', async function () {
  await homePage.verifySearchBarVisible();
});

Then('I should see all main navigation categories', async function () {
  const categories = ['New In','Winter','Clothing','Dresses','Co Ords','Tops','Bottoms','Shoes','Accessories','Sale'];
  for (const cat of categories) {
    await homePage.verifyCategoryVisible(cat);
  }
});

Then('I should see the {string} banner', async function(bannerText) {
  await homePage.verifyBannerVisible(bannerText); 
});

// ===== Main Category Steps =====
When('I click on the main category {string}', async function(categoryName) {
  await homePage.clickMainCategory(categoryName);
});

Then('I should see the following subcategories:', async function(dataTable) {
  const subcategories = dataTable.raw().flat();
  for (const sub of subcategories) {
    await homePage.verifyCategoryVisible(sub);
  }
});

// ===== Main Banner Steps =====
When('I click on the main banner {string}', async function(bannerName) {
  await homePage.clickMainBannerByName(bannerName);
});

Then('I should be navigated to the {string} page', async function(pageName) {
  let expectedUrlPart;
  switch (pageName) {
    case 'New In category':
      expectedUrlPart = '/c/new-in';
      break;
    case 'Christmas':
      expectedUrlPart = '/pages/christmas';
      break;
    case 'Sale':
      expectedUrlPart = '/c/sale';
      break;
    default:
      throw new Error(`Unknown page: ${pageName}`);
  }
  await expect(this.page).toHaveURL(new RegExp(`${expectedUrlPart}`));
});

// ===== What's Hot! Section =====
When('I scroll to Whats Hot section', async function () {
  await homePage.scrollToWhatsHotSection();
});

Then('I should see product cards with images in Whats Hot section', async function () {
  await homePage.verifyWhatsHotProductsVisible();
});

Then('I should see product names in Whats Hot section', async function () {
  await homePage.verifyWhatsHotProductsVisible();
});

Then('I should see product prices in Whats Hot section', async function () {
  await homePage.verifyWhatsHotProductsVisible();
});

Then('I should see "ADD" buttons in Whats Hot section', async function () {
  await homePage.verifyWhatsHotProductsVisible();
});

// ===== Promotional Offers =====
Then('I should see promotional offers displayed', async function() {
  const promos = await this.page.$$('div.promo-banner');
  if (promos.length === 0) throw new Error('No promotional offers found');
});

Then('I should see discount percentages', async function() {
  const discounts = await this.page.$$('div.promo-banner .discount');
  if (discounts.length === 0) throw new Error('No discount percentages found');
});

Then('I should see sale prices', async function() {
  const salePrices = await this.page.$$('div.promo-banner .sale-price');
  if (salePrices.length === 0) throw new Error('No sale prices found');
});

// ===== Scrolling =====
When('I scroll down {int}', async function(pixels) {
  await homePage.scrollDown(pixels);
});

Then('I should see elements that appear after scrolling', async function() {
  const el = await this.page.$('div.scroll-element'); // update selector if needed
  if (!el) throw new Error('No elements found after scrolling');
});

When('I scroll up {int}', async function(pixels) {
  await homePage.scrollUp(pixels);
});

Then('I should return to the top of the page', async function() {
  const scrollY = await this.page.evaluate(() => window.scrollY);
  if (scrollY !== 0) throw new Error('Did not return to top of the page');
});
