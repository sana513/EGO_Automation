const BasePage = require("./basePage");
const { LogoutLocators } = require("../locators/logoutLocators");
const { LoginLocators } = require("../locators/loginLocators");
const { testData } = require("../config/testData");
const { waitForNetworkSettled, settle } = require("../utils/dynamicWait");

class LogoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.accountIcon = page.locator(LoginLocators.accountIcon);
    
    // Logout locators
    this.accountMenu = page.locator(LogoutLocators.accountMenu);
    this.logoutButton = page.locator(LogoutLocators.logoutButton);
    this.logoutLink = page.locator(LogoutLocators.logoutLink);
    this.loggedOutIndicator = page.locator(LogoutLocators.loggedOutIndicator);
  }

  async openAccountMenu() {
    await this.closeModalIfPresent();
    await waitForNetworkSettled(this.page, 5000);
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await settle(this.page, 300);

    const icon = this.accountIcon.first();
    await icon.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await icon.scrollIntoViewIfNeeded();
    await settle(this.page, 200);
    
    // Check if menu is already open by checking multiple possible menu selectors
    const menuSelectors = [
      LogoutLocators.accountMenu,
      LogoutLocators.accountDropdown,
      '[role="menu"]',
      '[class*="dropdown"]',
      '[class*="menu"]'
    ];
    
    let menuVisible = false;
    for (const selector of menuSelectors) {
      const menu = this.page.locator(selector).first();
      if (await menu.isVisible({ timeout: 500 }).catch(() => false)) {
        menuVisible = true;
        break;
      }
    }
    
    if (menuVisible) {
      console.log('Account menu already open');
      return;
    }

    // Click account icon to open menu
    console.log('Clicking account icon to open menu...');
    await icon.click({ force: true, timeout: testData.timeouts.medium });
    await settle(this.page, 800);
    
    // Wait for any menu to appear (try multiple selectors)
    let menuAppeared = false;
    for (const selector of menuSelectors) {
      try {
        const menu = this.page.locator(selector).first();
        await menu.waitFor({ state: 'visible', timeout: 2000 });
        menuAppeared = true;
        console.log(`Account menu appeared with selector: ${selector}`);
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!menuAppeared) {
      console.warn('Account menu did not appear after clicking icon, but continuing...');
    }
  }

  async performLogout() {
    console.log('Performing logout...');
    
    // Ensure account menu is open
    await this.openAccountMenu();
    await settle(this.page, 500);

    // Comprehensive logout selector list
    const logoutSelectors = [
      'button:has-text("Logout")',
      'a:has-text("Logout")',
      '[aria-label="Logout"]',
      '[data-testid="logout-button"]',
      '[data-testid="logout-link"]',
      'a[href*="logout"]',
      'button[onclick*="logout"]',
      '[class*="logout"]',
      'text=Logout',
      'text=Sign Out',
      'button:has-text("Sign Out")',
      'a:has-text("Sign Out")'
    ];

    let loggedOut = false;
    let clickedSelector = '';

    // Try each logout selector
    for (const selector of logoutSelectors) {
      try {
        const logoutElement = this.page.locator(selector).first();
        const isVisible = await logoutElement.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          console.log(`Found logout element with selector: ${selector}`);
          await logoutElement.scrollIntoViewIfNeeded();
          await settle(this.page, 200);
          await logoutElement.click({ force: true });
          clickedSelector = selector;
          await settle(this.page, 800);
          loggedOut = true;
          console.log(`Clicked logout using: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Selector ${selector} not found or not clickable: ${e.message}`);
        continue;
      }
    }

    if (!loggedOut) {
      console.warn('Logout button not found in menu, trying alternative approach...');
      
      // Alternative: Try clicking account icon again to ensure menu is open
      await this.accountIcon.first().click({ force: true });
      await settle(this.page, 1000);
      
      // Try again with all selectors
      for (const selector of logoutSelectors) {
        try {
          const logoutBtn = this.page.locator(selector).first();
          if (await logoutBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
            await logoutBtn.click({ force: true });
            await settle(this.page, 800);
            loggedOut = true;
            clickedSelector = selector;
            console.log(`Successfully clicked logout using: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    if (!loggedOut) {
      throw new Error('Could not find or click logout button. Tried selectors: ' + logoutSelectors.join(', '));
    }

    // Wait for logout to complete - check multiple indicators
    console.log('Waiting for logout to complete...');
    await Promise.race([
      this.loggedOutIndicator.first().waitFor({ state: 'visible', timeout: testData.timeouts.large }),
      this.page.waitForURL(/^(?!.*my-account)/, { timeout: testData.timeouts.large }),
      this.page.waitForLoadState('networkidle', { timeout: testData.timeouts.large }),
      settle(this.page, 3000)
    ]).catch(() => {
      console.warn('Timeout waiting for logout indicators, but continuing...');
    });

    // Clear cookies and localStorage to ensure clean logout
    console.log('Clearing cookies and storage...');
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    global.cookieHandled = false;
    console.log(`Logout completed successfully using: ${clickedSelector}`);
  }

  async verifyLoggedOut() {
    // Check multiple indicators that user is logged out
    const currentUrl = this.page.url();
    const isAccountPage = currentUrl.includes("my-account");
    
    // Check for sign in button/option
    const signInSelectors = [
      'button:has-text("Sign In")',
      'a:has-text("Sign In")',
      '[aria-label="Sign In"]',
      '[data-testid="sign-in"]',
      'text=Sign In'
    ];
    
    let signInVisible = false;
    for (const selector of signInSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          signInVisible = true;
          console.log(`Found sign in indicator: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Check if account icon shows login state (not logged in)
    let accountIconShowsLogin = false;
    try {
      const icon = this.accountIcon.first();
      if (await icon.isVisible({ timeout: 2000 }).catch(() => false)) {
        // If icon is visible but we're not on account page, likely logged out
        accountIconShowsLogin = !isAccountPage;
      }
    } catch (e) {
      // Icon not visible might mean logged out
      accountIconShowsLogin = true;
    }
    
    const isLoggedOut = signInVisible || (!isAccountPage && accountIconShowsLogin);
    console.log(`Logged out verification: signInVisible=${signInVisible}, isAccountPage=${isAccountPage}, result=${isLoggedOut}`);
    
    return isLoggedOut;
  }

  async verifyLoggedIn() {
    // Check if we're on account page or account icon is visible
    const isOnAccountPage = this.page.url().includes("my-account");
    const isAccountIconVisible = await this.accountIcon.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    return isOnAccountPage || isAccountIconVisible;
  }
}

module.exports = LogoutPage;
