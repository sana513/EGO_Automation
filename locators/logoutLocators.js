const LogoutLocators = {
  dashboardPath: "/my-account",
  dashboardReady: '[data-testid="logout"]',
  logoutListItem: 'li[data-testid="list-item"]:has([data-testid="logout"])',
  logoutIcon: '[data-testid="logout"]',
  logoutButton: '[data-testid="logout"]'
};

module.exports = { LogoutLocators };
