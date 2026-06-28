import { defineConfig, devices } from '@playwright/test';

/*
 * Playwright config — runs against the BUILT site served by the Node adapter
 * (`npm run preview`) for production parity, never `astro dev` (TF-53-01).
 * Single Chromium project; animations neutralized and reduced-motion forced so
 * the suite is deterministic (flakiness controls, plan §5.4).
 */
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  snapshotPathTemplate: 'tests/visual/__screenshots__/{testFileName}/{arg}-{projectName}{ext}',
  expect: {
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: 'http://localhost:4321',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/pt/',
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
