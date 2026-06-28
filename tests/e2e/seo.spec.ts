import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

const SITE = 'https://www.scrapup.dev';
const routes = [
  { path: '/', canonical: `${SITE}/` },
  { path: '/pt/', canonical: `${SITE}/pt/` },
  { path: '/ja/', canonical: `${SITE}/ja/` },
] as const;

for (const { path, canonical } of routes) {
  test(`${path}: canonical(www), 4 hreflang + x-default, OG/Twitter, JSON-LD`, async ({ page }) => {
    await prepare(page, path);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);

    const hreflangs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('hreflang')));
    expect(new Set(hreflangs)).toEqual(new Set(['en', 'pt', 'ja', 'x-default']));

    // Every alternate points at the www host.
    const hrefs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href') ?? ''));
    for (const href of hrefs) expect(href.startsWith(`${SITE}/`)).toBe(true);

    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${SITE}/scrapup-social.png`,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );

    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ld).toBeTruthy();
    const parsed = JSON.parse(ld as string);
    const types = (parsed['@graph'] as Array<{ '@type': string }>).map((n) => n['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication']),
    );
  });
}
