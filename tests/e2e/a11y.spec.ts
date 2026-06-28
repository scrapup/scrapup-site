import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { prepare } from '../support/prepare';

for (const path of ['/', '/pt/', '/ja/', '/this-route-does-not-exist']) {
  test(`${path}: no critical/serious accessibility violations`, async ({ page }) => {
    await prepare(page, path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(
      blocking,
      JSON.stringify(
        blocking.map((v) => ({ id: v.id, impact: v.impact })),
        null,
        2,
      ),
    ).toEqual([]);
  });
}
