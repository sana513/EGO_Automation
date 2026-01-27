git add .
git commit -m "Describe your change"
git push origin develop
Test changes locally before merging to main.

Merge to main only when stable:

bash

git checkout main
git pull origin main
git merge develop
git push origin main


=== E2E tests ===

Run full e2e flow (egoFeature @e2e):
  npm run test:e2e

Browser: defaults to Chromium. Use WebKit via:
  BROWSER=webkit npm run test:e2e
  or  npm run test:e2e -- --browser=webkit

If Chromium is missing, install Playwright browsers first:
  npx playwright install chromium

Test data: registration, checkout, coupon, PLP index, etc. live in config/testData.js.
Override via env: CHECKOUT_EMAIL, COUPON_CODE, TEST_USER_EMAIL, TEST_USER_PASSWORD, etc.



