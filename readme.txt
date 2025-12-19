await page.locator('button:has-text("Decline offer")').click();
// OR using Playwright's built-in
await page.getByText('Decline offer').click();
await page.getByRole('button', { name: 'Decline offer' }).click();
npx cucumber-js features/signup.feature \
  --require features/step-definitions/signup.steps.js \
  --require features/support/world.js \
  --require features/support/hooks.js \
  --world-parameters '{"headed": true}'