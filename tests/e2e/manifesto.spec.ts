import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

const SITE = 'https://www.scrapup.dev';
const REPO = 'https://github.com/scrapup/scrapup';

const pages = [
  { lang: 'en', home: '/', manifesto: '/manifesto/', marker: 'Manifesto' },
  { lang: 'pt', home: '/pt/', manifesto: '/pt/manifesto/', marker: 'Manifesto do' },
  { lang: 'ja', home: '/ja/', manifesto: '/ja/manifesto/', marker: 'マニフェスト' },
] as const;

for (const { lang, home, manifesto, marker } of pages) {
  test(`${manifesto} renders the ${lang} manifesto with canonical + hreflang`, async ({ page }) => {
    await prepare(page, manifesto);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('.manifesto__title')).toContainText(marker);
    await expect(page.locator('.manifesto__belief')).toHaveCount(6);
    await expect(page.locator('.manifesto__milestone')).toHaveCount(4);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE}${manifesto}`,
    );
    const hrefs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(new Set(hrefs)).toEqual(
      new Set([`${SITE}/manifesto/`, `${SITE}/pt/manifesto/`, `${SITE}/ja/manifesto/`]),
    );

    const cta = page.locator(`.manifesto__sign-cta[href="${REPO}"]`);
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', /noopener/);
  });

  test(`${home}: top-bar nav links to ${manifesto} and marks home as current`, async ({
    page,
  }) => {
    await prepare(page, home);
    await expect(page.locator('.top-bar__nav a[aria-current="page"]')).toHaveAttribute(
      'href',
      home,
    );
    await page.locator(`.top-bar__nav a[href="${manifesto}"]`).click();
    await page.waitForURL(`**${manifesto}`);
    await expect(page.locator('.top-bar__nav a[aria-current="page"]')).toHaveAttribute(
      'href',
      manifesto,
    );
  });
}

test('language switcher on the manifesto stays on the manifesto', async ({ page }) => {
  await prepare(page, '/manifesto/');
  await page.locator('.lang-switch a[data-lang="ja"]').click();
  await page.waitForURL('**/ja/manifesto/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
});
