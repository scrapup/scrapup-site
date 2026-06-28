import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

// Intercept the Vercel Analytics beacon so it doesn't block networkidle.
test.beforeEach(async ({ page }) => {
  await page.route('**/_vercel/insights/**', (route) => route.abort());
});

test.describe('Vercel Analytics component', () => {
  for (const path of ['/', '/pt/', '/ja/', '/this-route-does-not-exist']) {
    test(`${path}: mounts the Vercel Analytics component`, async ({ page }) => {
      await prepare(page, path);
      await expect(page.locator('vercel-analytics')).toHaveCount(1);
    });
  }
});
