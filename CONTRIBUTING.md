# Contributing to scrapup-site

Thanks for helping build the scrapup.dev landing page. This repo is small and static; the rules
below keep it fast, trilingual, and releasable.

## Branch & PR flow

- Branch off `main`; open a PR back into `main` (trunk-based).
- PRs are **squash-merged** — the PR title becomes the commit on `main`.
- PR titles MUST be [Conventional Commits](https://www.conventionalcommits.org/) — enforced by the
  `pr-title` workflow (`feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`). This is what release-please parses to compute the next version.

## Before you open a PR

```bash
npm run check     # astro check (types) + i18n parity
npm run test:e2e  # Playwright E2E + SEO + a11y + computed-style (built preview)
npm run format    # Prettier
```

CI runs the same checks plus the build on every PR and gates the Vercel preview deploy on them.

## i18n parity (source of truth: EN)

English is the source of truth. **Any copy change must update all three locales in the same
change** (`src/i18n/ui.ts`: `en`, `pt`, `ja`). The key sets must match exactly — `npm run check`
fails and names any missing/extra/empty key. Keep consecrated technical terms (spec, commit,
milestone, gate, skill, agent, …) untranslated, as in the prototype.

## Styling

- **Always scoped:** add styles inside the component's `<style>` block (Astro scopes them automatically). Never use `style=` attributes.
- **BEM-style naming:** class names follow `block__element--modifier` where `block` is the component's kebab-case name.
- **Tokens:** use `var(--token-name)` from `src/styles/tokens.css`. Never hardcode hex values. See `README.md` for the token catalog.
- **Shared patterns:** if a pattern appears in ≥2 components, extract it as a primitive class in `src/styles/primitives.css`.
- **Guard:** `npm run check` runs `scripts/no-inline-styles.mjs --strict`. A PR with any `style=` inline ruleset will fail CI.

## Visual baselines

Screenshot regression (`tests/visual/layout.spec.ts`) is **opt-in** via `RUN_VISUAL=1` and its
baselines are deterministic **only on the official Playwright CI container**. Never commit a
baseline generated on macOS/Windows — OS-level font rendering differs and will cause false
failures in CI.

Baselines are committed PNGs stored under `tests/visual/` (the `snapshotDir` is configured in
`playwright.config.ts`). The suite is skipped unless `RUN_VISUAL=1` is set; **no baseline PNGs
are committed yet** — they will be generated on the first CI run.

Each screenshot is captured with `animations: 'disabled'` and
`mask: [page.locator('[aria-hidden="true"]')]` to suppress animated and decorative elements that
would otherwise produce flaky diffs.

**Regenerate baselines** (run inside the pinned container image
`mcr.microsoft.com/playwright:v1.61.1-noble`):

```bash
RUN_VISUAL=1 npm run test:e2e:update -- tests/visual/layout.spec.ts
```

Then commit the updated files under `tests/visual/`.

**Verify baselines** (same container, no `--update-snapshots`):

```bash
RUN_VISUAL=1 npm run test:e2e -- tests/visual/layout.spec.ts
```

The computed-style layer (`tests/visual/tokens.spec.ts`) is deterministic everywhere and always
runs without the `RUN_VISUAL` flag.

## Releases (do not bump versions by hand)

Versioning is automated by **release-please**. Do not edit `package.json` `version`,
`CHANGELOG.md` or `.release-please-manifest.json` manually. On pushes to `main`, release-please
opens/updates a **Release PR**; merging that PR is the **human-sealed gate** that cuts the version
and triggers the production Vercel deploy. The production custom domain is attached only at
cutover — see [`docs/runbook.md`](docs/runbook.md).

## Style

- Match the prototype's visual identity; the brand palette is canonical (`src/styles/global.css`,
  see `docs/specs/landing-page/plan.md` §3.3). Do not introduce off-palette hex values for brand
  surfaces.
- Keep client JS at zero/near-zero — content must render without scripting.
