import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

const cases = [
  { path: '/', lang: 'en', marker: 'forged' },
  { path: '/pt/', lang: 'pt', marker: 'forjada' },
  { path: '/ja/', lang: 'ja', marker: '鍛造された' },
] as const;

for (const { path, lang, marker } of cases) {
  test(`${path} renders the ${lang} landing with lang="${lang}"`, async ({ page }) => {
    await prepare(page, path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1').first()).toContainText(marker);
  });
}
