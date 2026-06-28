// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Production builds target Vercel. The Node adapter is used only for local preview
// and the Playwright suite (SSR_ADAPTER=node), because @astrojs/vercel does not
// support `astro preview` — Node serves the built output (incl. the on-demand root)
// with production parity. See package.json `preview` / `test:e2e`.
const adapter = process.env.SSR_ADAPTER === 'node' ? node({ mode: 'standalone' }) : vercel();

// https://astro.build/config
export default defineConfig({
  site: 'https://www.scrapup.dev',
  // Static by default; only the EN root ('/') is on-demand to perform language
  // auto-detection (src/pages/index.astro). All locale pages, 404 and SEO
  // surfaces are pre-rendered static.
  output: 'static',
  adapter,
  // Clean trilingual routes: EN at '/', PT at '/pt/', JA at '/ja/'.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'ja'],
    routing: { prefixDefaultLocale: false },
  },
  server: { port: 4321 },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', pt: 'pt', ja: 'ja' },
      },
    }),
  ],
});
