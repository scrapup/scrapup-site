import type { Page } from '@playwright/test';

/*
 * prepare — navigate to a route and make it deterministic before asserting:
 * inject CSS that kills animations/transitions/caret, wait for web fonts to be
 * ready, then for the network to settle. Neutralizes the prototype's flicker and
 * glitch animations and the async Google Fonts load (flakiness controls, §5.4).
 */
export async function prepare(page: Page, path: string): Promise<void> {
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }`;
    document.documentElement.appendChild(style);
  });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
}
