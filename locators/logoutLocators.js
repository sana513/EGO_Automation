const LogoutLocators = {
    accountIcon: '[aria-label="Account"]',
    accountMenu: '[data-testid="account-menu"], .account-menu, [class*="account-dropdown"]',
    logoutButton: 'button:has-text("Logout"), a:has-text("Logout"), [aria-label="Logout"], [data-testid="logout-button"]',
    logoutLink: 'text=Logout, a[href*="logout"], button[onclick*="logout"]',
    myAccountLink: 'a:has-text("My Account"), [href*="my-account"]',
    accountDropdown: '.account-dropdown, [class*="dropdown-menu"], [role="menu"]',
    loggedInIndicator: '[data-testid="account-icon"], .account-icon, [aria-label*="Account"]:has-text("Account")',
    loggedOutIndicator: 'button:has-text("Sign In"), a:has-text("Sign In"), [aria-label="Sign In"]'
};

module.exports = { LogoutLocators };
