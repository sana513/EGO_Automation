const LogoutLocators = {
  dashboardPath: "/my-account",
  /** Dashboard ready = logout visible (sidebar/nav). Do not use [href*="my-account"] (matches canonical). */
  dashboardReady: '[data-testid="logout"]',
  logoutListItem: 'li[data-testid="list-item"]:has([data-testid="logout"])',
  logoutIcon: '[data-testid="logout"]',
  logoutButton: '[data-testid="logout"]'
};

module.exports = { LogoutLocators };
