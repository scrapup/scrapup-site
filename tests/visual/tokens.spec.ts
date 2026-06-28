import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

/*
 * Primary, deterministic visual layer (plan §5.4): assert the canonical brand
 * palette and applied fonts via computed style — no pixels involved.
 * Palette source of truth: brand/scrapup - Logo System.dc.html (F9) / plan §3.3.
 */
const PALETTE = {
  '--neon': 'rgb(255, 122, 51)', // #FF7A33
  '--neon-light': 'rgb(232, 100, 31)', // #E8641F
  '--cy': 'rgb(53, 230, 224)', // #35E6E0
  '--ink': 'rgb(10, 13, 21)', // #0A0D15
  '--paper': 'rgb(242, 240, 234)', // #F2F0EA
  '--light-ink': 'rgb(236, 238, 244)', // #ECEEF4
};

test('canonical palette tokens resolve to their hex values', async ({ page }) => {
  await prepare(page, '/pt/');
  const resolved = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const read = (name: string) => {
      const probe = document.createElement('span');
      probe.style.color = cs.getPropertyValue(name).trim();
      document.body.appendChild(probe);
      const rgb = getComputedStyle(probe).color;
      probe.remove();
      return rgb;
    };
    return {
      '--neon': read('--neon'),
      '--neon-light': read('--neon-light'),
      '--cy': read('--cy'),
      '--ink': read('--ink'),
      '--paper': read('--paper'),
      '--light-ink': read('--light-ink'),
    };
  });
  expect(resolved).toEqual(PALETTE);
});

test('body background is --ink and headings use the prototype fonts', async ({ page }) => {
  await prepare(page, '/pt/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe(PALETTE['--ink']);

  const h1Font = await page.evaluate(
    () => getComputedStyle(document.querySelector('h1') as Element).fontFamily,
  );
  expect(h1Font).toContain('Space Grotesk');

  // The primary hero CTA uses the accent as its background.
  const ctaBg = await page.evaluate(() => {
    const star = Array.from(document.querySelectorAll('a')).find((a) =>
      /★/.test(a.textContent ?? ''),
    );
    return star ? getComputedStyle(star).backgroundColor : '';
  });
  expect(ctaBg).toBe(PALETTE['--neon']);
});
