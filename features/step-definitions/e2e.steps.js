const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const E2EPage = require('../../pages/e2ePage');
const LoginPage = require('../../pages/loginPage');
const LogoutPage = require('../../pages/logoutPage');

When('I perform logout in unified flow', async function () {
    this.e2ePage = new E2EPage(this.page);
    this.logoutPage = new LogoutPage(this.page); // Initialize for verification step
    await this.e2ePage.performLogout();
});

Given('I perform login in unified flow', async function () {
    this.loginPage = new LoginPage(this.page);
    // In unified flow, we are already on the site. Navigate to homepage first, then login.
    const locale = process.env.LOCALE || 'us';
    const baseUrl = this.loginPage.getBaseUrl(locale);

    // Navigate to homepage if not already there
    if (!this.page.url().includes(baseUrl)) {
        await this.page.goto(baseUrl);
    }

    await this.loginPage.openLoginModal();
    await this.loginPage.performLogin();
});
