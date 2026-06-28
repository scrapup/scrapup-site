# CLAUDE.md — scrapup-site

Landing page for `scrapup.dev`. See the workspace root `../CLAUDE.md` for org-wide context,
language rules, and conventions. This file is the project-specific guide.

## Current state

Initial port of the Claude Design proposal only — **no build, no commit yet**.

| File                        | Origin                                                       | Notes                                         |
| --------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `scrapup - Landing.dc.html` | Claude Design project `f3b2dbb9-52a7-4956-895a-3f8a26729c47` | dc-runtime format                             |
| `support.js`                | dc-runtime (`./support.js`)                                  | depends on `window.React` / `window.ReactDOM` |

The page is **not servable as static HTML**: it uses the Claude Design runtime format
(`<x-dc>`, `<sc-if>`, template vars `{{ accent }}`, `{{ isEn/isPt/isJa }}`,
`{{ setEn/setPt/setJa }}`) and needs the dc-runtime harness (React in global scope) to resolve
the template and locale/accent state.

## Brand palette

Canonical palette — **source of truth: `brand/scrapup - Logo System.dc.html` (block F9 · PALETTE)**.
Implemented as CSS custom properties in `src/styles/global.css`; see `docs/specs/landing-page/plan.md` §3.3.

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
