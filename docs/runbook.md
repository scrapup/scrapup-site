# Runbook — scrapup.dev Landing Page

Operational guide for the external configuration required to **publish** and **operate** the
`scrapup-site` landing page, and to **cut the production domain over** from Cloudflare DNS to Vercel.

> **Audience:** the operator (Architect/Validator) performing setup and the domain cutover.
> **Golden rule (RN-15):** the production domain is pointed at Vercel **only after** the site is
> fully validated on the Vercel provisional URL. Never cut over before sign-off.

Publication model (mirrors the `scrapup` repo): each PR gets a **Vercel preview** (the provisional
URL for validation); **production deploys only when release-please cuts a release** (the human-sealed
Release PR merge). There is no deploy on ordinary `main` merges.

---

## 0. Prerequisites

| Item                                                           | Needed for                            |
| -------------------------------------------------------------- | ------------------------------------- |
| GitHub repository `scrapup/scrapup-site` (org `scrapup`)       | Source, Actions, release-please       |
| A Vercel account/team with access to create a project          | Hosting, preview + production deploys |
| Cloudflare account managing DNS for `scrapup.dev`              | Domain cutover                        |
| Local Node 24 (`.nvmrc`) + npm                                 | Running/building the site locally     |
| `vercel` CLI (`npm i -g vercel`) — optional, for local linking | Obtaining project/org IDs             |

Local sanity check before anything else:

```bash
nvm use            # honors .nvmrc (Node 24)
npm install
npm run check      # astro check + i18n parity
npm run build      # static output in dist/
npm run preview    # serve the build locally
```

---

## 1. Vercel project setup

1. Create a new Vercel project and connect it to the `scrapup/scrapup-site` GitHub repo.
2. Framework preset: **Astro**. Build command `astro build`; output `dist` (defaults are fine with the
   `@astrojs/vercel` adapter).
3. **Disable Vercel's automatic Git production deployments** — production is driven by the
   `release-please` workflow, not by Vercel's Git integration. (Preview deployments are produced by the
   `ci.yml` workflow via the Vercel CLI; you may also leave Vercel's PR previews on if preferred, but
   keep a single source of truth.)
4. Capture the three identifiers the workflows need:

```bash
vercel login
vercel link            # run inside the repo; creates .vercel/project.json
cat .vercel/project.json   # contains "projectId" and "orgId"
```

- `VERCEL_PROJECT_ID` = `projectId`
- `VERCEL_ORG_ID` = `orgId`
- `VERCEL_TOKEN` = create at **Vercel → Account Settings → Tokens** (scope: the project's team).

> Do **not** commit `.vercel/` (already covered by `.gitignore`).

---

## 2. GitHub repository configuration

### 2.1 Actions secrets

Set under **Settings → Secrets and variables → Actions** (repository secrets):

| Secret              | Value                                   | Used by                                         |
| ------------------- | --------------------------------------- | ----------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel personal/team token              | `ci.yml` (preview), `release-please.yml` (prod) |
| `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json`     | both deploy workflows                           |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` | both deploy workflows                           |

`GITHUB_TOKEN` is provided automatically to Actions — no setup needed.

### 2.2 Workflow permissions

- **Settings → Actions → General → Workflow permissions:** "Read and write permissions" (release-please
  needs to open the Release PR and create tags/releases).
- Allow GitHub Actions to **create and approve pull requests**.

### 2.3 Branch protection (recommended)

Protect `main`:

- Require the `ci` and `pr-title` checks to pass before merge.
- Require PRs (no direct pushes).
- Use **squash merge** so the PR title becomes the commit on `main` (release-please parses it).

### 2.4 Conventional Commit PR titles

`pr-title.yml` enforces a Conventional Commit PR title (`feat`, `fix`, `docs`, `refactor`, `perf`,
`test`, `build`, `ci`, `chore`, `revert`). Pre-1.0 bumps: `fix`/`perf` → patch, `feat` → minor,
breaking → minor (stays `0.x`).

### 2.5 Preview deployments (how `ci.yml` produces the provisional URL)

The `ci.yml` `preview` job builds a Vercel **preview** for every PR and posts its URL back to the
PR — the provisional URL used for validation (RN-15) before any production cutover.

**How it runs (per PR):**

1. `verify` (check + build on Node 24) and `e2e` (Playwright on the pinned container) must pass
   first — `preview` is `needs: [verify, e2e]`, so a red suite blocks the preview.
2. A guard step checks whether `VERCEL_TOKEN` is set. If it is **absent**, the deploy is **skipped**
   and the job stays green — the pipeline never hard-fails just because Vercel isn't configured yet.
3. When the token is present, the job deploys with the three secrets:
   ```bash
   vercel pull --yes --environment=preview --token="$VERCEL_TOKEN"
   vercel build --token="$VERCEL_TOKEN"
   vercel deploy --prebuilt --token="$VERCEL_TOKEN"   # prints the *.vercel.app URL
   ```
4. The URL is posted as a **sticky PR comment** (created once, updated on subsequent pushes).

**Prerequisites (one-time):**

- Vercel project created and linked (§1) and the three repository secrets set (§2.1):
  `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. The CLI reads the org/project IDs from the
  env the job exports; the **token must be scoped to the project's team**.
- Workflow permissions allow PR writes for the comment (§2.2 — `pull-requests: write`, already
  declared in `ci.yml`).

**Verify it works:** open a throwaway PR (or push to an open one); after `verify` + `e2e` go green
the `preview` job runs and a "🔎 Vercel preview" comment appears with a
`https://<deployment>.vercel.app` link. Open it and run the §4.1 checklist.

**Fork PRs:** GitHub does not expose secrets to workflows triggered from forked repositories, so the
guard skips the deploy for fork PRs (no preview). Branches pushed to this repo (the normal flow)
get previews.

**Troubleshooting:**

| Symptom                                       | Cause / fix                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| `preview` job skipped / no comment            | `VERCEL_TOKEN` secret missing (or it's a fork PR). Set the secrets per §2.1.            |
| `vercel pull`/`deploy` 403 or "project not found" | Token not scoped to the team, or wrong `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`. Re-capture from `.vercel/project.json` (§1). |
| Deploy succeeds but no comment is posted      | Workflow permissions lack PR write — fix per §2.2.                                      |
| `preview` never starts                        | `verify` or `e2e` failed — fix those first (preview is gated on them).                  |

---

## 3. Release & publication flow

1. Merge feature/fix PRs (squash) into `main`. Each PR produced a Vercel **preview** (provisional URL)
   via `ci.yml` — validate there.
2. `release-please` opens/updates a single **Release PR** (`chore: release X.Y.Z`) with the bumped
   `package.json` version and `CHANGELOG.md`.
3. **Merging the Release PR is the human-sealed gate.** On merge, `release-please.yml`:
   - creates the git tag + GitHub Release, and
   - (gated on `release_created`) builds and deploys **production** to Vercel.
4. The production deployment lands on the Vercel project URL. **The custom domain is still detached** —
   proceed to the cutover only after validation (Part 4).

---

## 4. Domain cutover — Cloudflare → Vercel (final, gated)

> **Do this last**, only after the site is validated on the Vercel provisional/production URL (RN-15).

### 4.1 Pre-cutover validation checklist (on the Vercel URL)

- [ ] `/`, `/pt/`, `/ja/` render the full localized narrative.
- [ ] Root auto-detection works (`Accept-Language` → locale; unknown → EN); cookie override works.
- [ ] 404 returns the branded page with HTTP 404.
- [ ] SEO: canonical points to `www.scrapup.dev`, 4 hreflang links present, sitemap + robots reachable.
- [ ] Lighthouse: SEO 100, Performance ≥ 95, Accessibility ≥ 95 (mobile).

### 4.2 Add the domains in Vercel

1. **Vercel → Project → Settings → Domains.**
2. Add **`www.scrapup.dev`** (the canonical host) and **`scrapup.dev`** (apex).
3. Set the production domain to `www.scrapup.dev`; configure the apex `scrapup.dev` to **redirect to
   `www`** (the `vercel.json` redirect also enforces this).
4. Vercel will display the exact DNS records to create (an apex `A`/`ALIAS` record and a `www` `CNAME`).
   **Use the values Vercel shows** — do not hard-code addresses from memory; they can change.

### 4.3 Configure DNS in Cloudflare

1. In Cloudflare → `scrapup.dev` → **DNS → Records**, create/update the records exactly as Vercel
   instructed:
   - `www` → `CNAME` → the Vercel target (e.g. `cname.vercel-dns.com`), **Proxy status: DNS only (grey
     cloud)**.
   - `@` (apex) → the `A`/`ALIAS` value Vercel shows, **Proxy status: DNS only (grey cloud)**.
2. **Why DNS only:** the `.dev` TLD is HSTS-preloaded — TLS must be valid and is **issued and served by
   Vercel**. Cloudflare's orange-cloud proxy in front of Vercel causes double-CDN and TLS/cert
   conflicts. Keep records **grey-clouded** so Vercel terminates TLS.
3. If Cloudflare's SSL/TLS mode was previously set for a proxied origin, it does not matter once records
   are DNS-only (Cloudflare is not in the request path).
4. **DNSSEC:** leave as-is during cutover; enable only after DNS is confirmed stable (per the domain notes).

### 4.4 Verify TLS issuance

- In Vercel → Domains, wait until both domains show a **valid certificate** (Vercel auto-provisions).
- Do not announce/rely on the domain until the certificate is issued — on `.dev`, browsers refuse plain
  HTTP and will hard-fail an invalid/missing cert.

### 4.5 Post-cutover smoke test

```bash
# apex redirects to canonical www over HTTPS
curl -sI https://scrapup.dev | grep -i location          # -> https://www.scrapup.dev/...

# canonical host serves the site
curl -sI https://www.scrapup.dev | head -n1              # -> HTTP/2 200

# language auto-detection
curl -sI -H 'Accept-Language: pt-BR' https://www.scrapup.dev/ | grep -i location   # -> /pt/
curl -sI -H 'Accept-Language: ja'    https://www.scrapup.dev/ | grep -i location   # -> /ja/

# 404 status
curl -sI https://www.scrapup.dev/does-not-exist | head -n1   # -> HTTP/2 404

# HSTS present
curl -sI https://www.scrapup.dev | grep -i strict-transport-security
```

- [ ] Apex → `https://www.scrapup.dev` (301).
- [ ] `www` serves 200 with valid TLS + HSTS.
- [ ] Auto-detection + 404 behave as on the provisional URL.
- [ ] Re-run Lighthouse on the live `www` host.

---

## 5. Rollback

- **Bad production deploy:** in Vercel → Deployments, **promote the previous good deployment** to
  production (instant). Investigate, fix via PR, cut a new release.
- **Bad cutover / DNS issue:** in Cloudflare, revert the `www`/apex records to their previous values
  (or remove them) — DNS-only changes propagate quickly. The Vercel deployment itself is unaffected.

---

## 6. Reference

| Variable / setting  | Where                        | Value source                                    |
| ------------------- | ---------------------------- | ----------------------------------------------- |
| `VERCEL_TOKEN`      | GitHub Actions secret        | Vercel → Account → Tokens                       |
| `VERCEL_ORG_ID`     | GitHub Actions secret        | `.vercel/project.json` (`orgId`)                |
| `VERCEL_PROJECT_ID` | GitHub Actions secret        | `.vercel/project.json` (`projectId`)            |
| Canonical host      | `vercel.json`, Seo component | `www.scrapup.dev`                               |
| Apex redirect       | `vercel.json`                | `scrapup.dev` → `https://www.scrapup.dev` (301) |
| DNS records         | Cloudflare (DNS only)        | Exact values from Vercel → Domains              |
| TLS                 | Vercel-issued                | Automatic on domain add                         |

Related artifacts: `docs/specs/landing-page/{spec,plan,tasks}.md`.
