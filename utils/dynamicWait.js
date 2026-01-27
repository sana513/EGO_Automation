const { testData } = require('../config/testData');

const DEFAULT_TIMEOUT = testData?.timeouts?.medium ?? 5000;

async function waitForNetworkSettled(page, timeout = 10000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
}

async function waitForVisible(page, selector, timeout = DEFAULT_TIMEOUT) {
  await page.locator(selector).first().waitFor({ state: 'visible', timeout });
}

async function waitForHidden(page, selector, timeout = DEFAULT_TIMEOUT) {
  await page.locator(selector).first().waitFor({ state: 'hidden', timeout }).catch(() => {});
}

async function waitForOverlaysHidden(page, selectors, timeout = 3000) {
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.waitFor({ state: 'hidden', timeout }).catch(() => {});
    }
  }
}

async function settle(page, ms = 150) {
  await page.waitForTimeout(ms);
}

module.exports = {
  waitForNetworkSettled,
  waitForVisible,
  waitForHidden,
  waitForOverlaysHidden,
  settle,
  DEFAULT_TIMEOUT
};
