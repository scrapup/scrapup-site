import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

/*
 * Secondary visual layer: full-page screenshot regression (plan §5.4).
 * Baselines are deterministic ONLY on the official Playwright CI container, so
 * this suite is opt-in via RUN_VISUAL=1 and its baselines are generated/committed
 * from that container (never from a local macOS/Windows machine). See CONTRIBUTING.
 */
test.describe('layout screenshots', () => {
  test.skip(
    !process.env.RUN_VISUAL,
    'visual baselines are generated on the CI Playwright container — set RUN_VISUAL=1',
  );

  for (const path of ['/', '/pt/', '/ja/', '/this-route-does-not-exist']) {
    test(`${path} matches the visual baseline`, async ({ page }) => {
      await prepare(page, path);
      const name = path === '/' ? 'home-en' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '');
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        animations: 'disabled',
        mask: [page.locator('[aria-hidden="true"]')],
      });
    });
  }
});
