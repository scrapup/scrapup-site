# CLAUDE.md — scrapup-site

Landing page for `scrapup.dev`. See the workspace root `../CLAUDE.md` for org-wide context,
language rules, and conventions. This file is the project-specific guide.

## Current state

Trilingual Astro SSG deployed to Vercel. Build is green; routes `/`, `/pt/`, `/ja/` and `404`
are live. The `.dc.html` design-project files are archived under `brand/` and are no longer
the source of truth — the Astro component tree is.

## Analytics

**Vercel Web Analytics** — privacy-friendly, no cookies, zero additional setup.

| Aspect | Detail |
| ------ | ------ |
| Package | `@vercel/analytics` (direct `dependencies`, `^1.6.1`) |
| Component | `<Analytics />` from `@vercel/analytics/astro` |
| Mounted in | `src/layouts/BaseLayout.astro` (covers EN on-demand + PT/JA static) and `src/pages/404.astro` (standalone, does not inherit BaseLayout) |
| CSP | Unchanged — script and beacon are same-origin (`/_vercel/insights/*`); covered by existing `script-src 'self'` and `default-src 'self'` |
| Test | `tests/e2e/analytics.spec.ts` asserts `<vercel-analytics>` present on all 4 routes |
| Manual steps (Vercel dashboard) | 1. Enable **Web Analytics** in the project settings. 2. Remove the unused `NEXT_PUBLIC_GA_ID` env var. |

> **Do not** add Google Analytics or any third-party analytics script — the CSP would need `'unsafe-inline'`/nonces and a foreign `connect-src`.

## Brand palette

Canonical palette — **source of truth: `brand/scrapup - Logo System.dc.html` (block F9 · PALETTE)**.
Implemented in `src/styles/tokens.css` (canonical palette) and `src/styles/tokens.css` (auxiliary text scale: `--text-strong` through `--text-quiet`; RGB-triplet tokens: `--panel-hi`, `--panel-lo`, `--hairline`, `--mark`, `--violet`). Entry point is `src/styles/global.css` (imports `tokens.css`, `base.css`, `animations.css`, `primitives.css`).

| Token          | Hex       | Name          | Use                                                    |
| -------------- | --------- | ------------- | ------------------------------------------------------ |
| `--neon`       | `#FF7A33` | Neon forge    | Accent on dark (the flickering "up", CTAs, highlights) |
| `--neon-light` | `#E8641F` | Forge (light) | Accent on light/paper backgrounds                      |
| `--cy`         | `#35E6E0` | Cyan          | Secondary accent (section labels, links)               |
| `--ink`        | `#0A0D15` | Ink           | Primary background                                     |
| `--paper`      | `#F2F0EA` | Paper         | Light / inverse background                             |
| `--light-ink`  | `#ECEEF4` | Light ink     | Foreground text on ink                                 |

Secondary text greys from the prototype (`#AEB4C2`, `#8A90A0`, `#7E8597`, `#C7CCD8`) and the
deep-footer ink `#07090E` are shades, not core palette. Fonts: Space Grotesk (wordmark/headings),
IBM Plex Sans/Mono, Noto Sans JP — loaded via Google Fonts CDN, matching the prototype.

## Pending

- [ ] Convert `.dc.html` to static HTML/CSS (or bundle the React harness) so it serves on `scrapup.dev`.
- [ ] Decide final filename — spaces in `scrapup - Landing.dc.html` are problematic for web serving.
- [ ] Split i18n into static clean subdirectories (`/`, `/pt/`, `/ja/`) with reciprocal `hreflang`
      (`x-default` → EN root); EN is source of truth. The trilingual content (EN/PT/JA) is already
      embedded via `<sc-if>` blocks and must map to those routes.
- [ ] Bring remaining Design artifacts if needed (`brand/`, `Coming Soon`, `screenshots/`,
      `uploads/`) — out of scope for the initial landing port.
- [ ] `.dev` TLD is HSTS-preloaded — valid TLS is mandatory; plain HTTP will not serve.
