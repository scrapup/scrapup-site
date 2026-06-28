import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

/*
 * The language switcher is the only client JS: clicking a language writes the
 * scrapup_lang cookie (RN-05) and navigates to that locale. Closes the
 * source→cookie→navigation loop that the HTTP-level detection tests don't cover.
 */
test('clicking PT writes scrapup_lang and navigates to /pt/', async ({ page }) => {
  await prepare(page, '/');
  await page.locator('.lang-switch a[data-lang="pt"]').click();
  await page.waitForURL('**/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
  const cookies = await page.context().cookies();
  const langCookie = cookies.find((c) => c.name === 'scrapup_lang');
  expect(langCookie?.value).toBe('pt');
});

// Guard the CSP-safety of the cookie script: it must be an external same-origin
// file (script-src 'self'), never an inline script (which production CSP blocks).
for (const path of ['/', '/pt/', '/ja/']) {
  test(`${path}: switcher script is external (/lang-switch.js), not inline`, async ({ page }) => {
    await prepare(page, path);
    await expect(page.locator('script[src="/lang-switch.js"]')).toHaveCount(1);
    const inlineHasCookie = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script:not([src])')).some((s) =>
        (s.textContent ?? '').includes('scrapup_lang')
      )
    );
    expect(inlineHasCookie).toBe(false);
  });
}
