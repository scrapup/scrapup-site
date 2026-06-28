<!--
PR title MUST be a Conventional Commit (enforced by the pr-title workflow), e.g.
  feat: add catalog listing page
  fix(seo): correct canonical host on /ja/
With squash merge the title becomes the commit on main and feeds release-please.
-->

## What & why

<!-- What this PR changes and the problem/need it addresses. Link the spec/task. -->

- Spec/task:
- Related issue:

## Type of change

- [ ] `feat` — new functionality
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` / `perf` / `style`
- [ ] `test` — tests only
- [ ] `build` / `ci` / `chore`

## Checklist

- [ ] `npm run check` passes (types + i18n parity)
- [ ] `npm run build` passes
- [ ] `npm run test:e2e` passes locally
- [ ] **i18n parity**: copy changes update **all three locales** (EN source of truth → PT/JA) in this PR
- [ ] No `<form>` / personal-data collection introduced; client JS kept at zero/near-zero
- [ ] Brand surfaces use the canonical palette tokens (no off-palette hex)
- [ ] Docs updated when relevant (`README.md`, `CONTRIBUTING.md`, `docs/runbook.md`)

## Visual changes

<!-- Screenshots/GIFs for any visual change (ideally EN/PT/JA). -->

- [ ] Not applicable
- [ ] Screenshots attached
- [ ] Visual baselines regenerated on the CI container (`RUN_VISUAL=1 npm run test:e2e:update` on
      `mcr.microsoft.com/playwright:v1.61.1-noble`) and committed — never from a local machine

## SEO / host (if touched)

- [ ] Canonical stays on the `www.scrapup.dev` host; hreflang (`en`/`pt`/`ja`/`x-default`) intact
- [ ] Not applicable

## Release & deploy

- [ ] I did **not** bump the version / `CHANGELOG.md` by hand (release-please owns versioning)
- [ ] I understand a Vercel **preview** is posted on this PR for validation, and **production**
      deploys only when the release-please **Release PR** is merged (RN-15)
