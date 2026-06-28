import { test, expect } from '@playwright/test';

test('unknown path returns HTTP 404 with the branded 404 (RN-14)', async ({ page }) => {
  const res = await page.goto('/this-route-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('body')).toContainText('404');
  await expect(page.getByText('HTTP 404 · NO GATE SEALED')).toBeVisible();
  // Both CTAs present.
  await expect(page.getByRole('link', { name: /BACK HOME/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /VIEW ON GITHUB/i })).toBeVisible();
});
