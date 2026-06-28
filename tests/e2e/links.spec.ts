import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

const REPO = 'https://github.com/scrapup/scrapup';

for (const path of ['/', '/pt/', '/ja/']) {
  test(`${path}: external Star/Docs links are safe and there is no form (RN-06/RN-12)`, async ({
    page,
  }) => {
    await prepare(page, path);

    const repoLinks = page.locator(`a[href="${REPO}"]`);
    const count = await repoLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const a = repoLinks.nth(i);
      await expect(a).toHaveAttribute('target', '_blank');
      const rel = (await a.getAttribute('rel')) ?? '';
      expect(rel).toContain('noopener');
    }

    // Waitlist dropped: no form / no email input anywhere, no live star count.
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('input[type="email"]')).toHaveCount(0);
  });
}
