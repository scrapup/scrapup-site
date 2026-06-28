# Functional Specification: scrapup.dev Landing Page

> Phase 1 of Spec-Driven Development — **what** and **why**, technology-agnostic.
> Authored in English per the project artifact-language rule (`CLAUDE.md`).

## 1. Overview and Objective

- **The Problem:** scrapup is a pre-launch Beta with no public presence. The narrative that
  justifies it (an AI-assisted Unified Process — from informational _scrap_ to forged, auditable
  delivery) lives only in internal docs and a design prototype that cannot be served on the web.
  There is no way for a prospective user to discover the product, understand its differentiation,
  or follow the build. The audience is international (EN / PT / JA) and the domain (`scrapup.dev`)
  mandates valid TLS, so an ad-hoc page will not do.
- **The Solution (What):** a lightweight, trilingual public **landing page** at
  `www.scrapup.dev` that communicates the product narrative end-to-end (problem → answer → how it
  works → pillars → differentiation → Unified Process foundation → openness → honest Beta status →
  call to action) and drives the visitor to the GitHub repository (star + docs). The page detects
  the visitor's language automatically (falling back to English), is discoverable by search
  engines, and is designed to **evolve into a multi-page catalog** of skills/agents/commands.
- **The Value (Why):** establishes a public front door for the project; grows GitHub visibility
  (stars) and documentation reach; and maximizes organic discoverability (SEO) — all at minimal
  runtime cost so it stays fast and cheap to operate while the product matures from Beta to Release.
- **Explicitly out of scope:** no email/waitlist capture and no collection of any personal data
  (removes the associated privacy/consent burden); no analytics in this iteration (under
  evaluation — see §5); no live star-count display (a zero-star count would be a detractor at this
  stage). None of these may be _precluded_ by the architecture, but none are built now.

## 2. User Journeys

**Primary journey — Discover the product:**

1. A **Visitor** opens `www.scrapup.dev` from a link, search result, or social share.
2. The system determines the visitor's preferred language automatically and serves the fully
   rendered page in that language (English when the preference is unknown or unsupported).
3. The Visitor reads the narrative end-to-end and reaches the final call-to-action.
4. **Result:** the Visitor understands what scrapup is and is invited to star the repo or read the docs.

**Journey — Switch language manually:**

1. The Visitor selects EN, PT, or JA from the language switcher.
2. The system navigates to the corresponding localized route and serves that language's content.
3. **Result:** content and page URL reflect the chosen language, overriding auto-detection;
   search engines see distinct, cross-referenced localized pages.

**Journey — Star on GitHub:**

1. The Visitor clicks "Star on GitHub".
2. The system opens the scrapup repository on GitHub in a new tab.
3. The Visitor stars the repository on GitHub (under their own GitHub account).
4. **Result:** the Visitor reaches the repository; starring happens on GitHub, authenticated as themselves.

**Journey — Read the docs:**

1. The Visitor clicks "Read the docs".
2. The system opens the scrapup repository (documentation) on GitHub in a new tab.

**Journey — Search engine crawl:**

1. A **Crawler** requests a localized route.
2. The system returns fully pre-rendered HTML with complete metadata (title, description,
   social-share tags, canonical, and reciprocal language references) without requiring script execution.
3. **Result:** each localized page is independently indexable and correctly cross-linked.

**Journey — Reach a non-existent URL:**

1. A Visitor or Crawler requests a path that does not exist.
2. The system returns a proper not-found response with a branded, localized 404 page that offers
   a path back to the landing page.

## 3. Business Rules and Constraints

| #     | Rule                                                                                                                                                                                                                                                                                                                   | Type        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| RN-01 | The site is published in three languages on clean routes: English at the root (`/`), Portuguese at `/pt/`, Japanese at `/ja/`.                                                                                                                                                                                         | Obligatory  |
| RN-02 | English is the **source of truth**; Portuguese and Japanese content must stay in sync with the English content (no language may drift or be missing).                                                                                                                                                                  | Obligatory  |
| RN-03 | Each localized page must declare its language and reference the other language versions reciprocally, with English as the default for unspecified locales.                                                                                                                                                             | Obligatory  |
| RN-04 | On entry to the site root, the visitor's preferred language is **auto-detected** and they are routed to the matching localized page; when detection is unavailable or the language is unsupported, English is served. Auto-detection must not prevent any localized route from being directly reachable and indexable. | Obligatory  |
| RN-05 | The manual language switcher overrides auto-detection; the visitor's explicit choice always wins.                                                                                                                                                                                                                      | Obligatory  |
| RN-06 | The "Star on GitHub" action only **links** the visitor to the GitHub repository; it must not claim to, or attempt to, star the repository on the visitor's behalf without the visitor's own GitHub authentication.                                                                                                     | Restrictive |
| RN-07 | The full product narrative must be readable **without client-side scripting** (content is pre-rendered). Any interactive behavior is progressive enhancement.                                                                                                                                                          | Obligatory  |
| RN-08 | The page must remain **lightweight** — a landing page, not an app — to preserve load speed and SEO (see performance criteria in §5). Client-side scripting must be zero or near-zero.                                                                                                                                  | Restrictive |
| RN-09 | The site must be served over valid TLS only; plain HTTP must not serve (the `.dev` TLD is HSTS-preloaded).                                                                                                                                                                                                             | Restrictive |
| RN-10 | The canonical host is `www.scrapup.dev`; the apex domain (`scrapup.dev`) must redirect to it, and canonical URLs must point to the `www` host.                                                                                                                                                                         | Obligatory  |
| RN-11 | No personal data is collected and no invasive tracking is present in this iteration.                                                                                                                                                                                                                                   | Restrictive |
| RN-12 | A live star count must **not** be displayed at this stage.                                                                                                                                                                                                                                                             | Restrictive |
| RN-13 | The architecture must accommodate growth into additional pages (e.g., a catalog with listing and detail pages) without re-platforming, and must not preclude later addition of privacy-respecting analytics.                                                                                                           | Obligatory  |
| RN-14 | Every public route (including 404) must exist in all three languages or resolve to a defined language fallback.                                                                                                                                                                                                        | Obligatory  |
| RN-15 | The production domain cutover (pointing `scrapup.dev` / `www.scrapup.dev`, DNS-managed in Cloudflare, to the Vercel deployment) must occur **only after** the site has been fully validated on the Vercel provisional URL. The live domain must not be switched before that sign-off.                                  | Obligatory  |

## 4. Edge Cases and Exception Flows (Zero Trust)

| Scenario                                                     | Expected Behavior                                                                                                        | Severity |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| Language preference unavailable or unsupported on root entry | Serve English; never render a broken or empty page.                                                                      | High     |
| Client-side scripting disabled                               | The full narrative and all content render and are readable; the language switcher still works as plain navigation links. | High     |
| Unknown or non-existent path requested                       | Return a proper not-found response with the branded, localized 404 page.                                                 | Medium   |
| Crawler requests a page without executing scripts            | Full content and metadata are returned pre-rendered.                                                                     | High     |
| Apex host or plain HTTP requested                            | Redirect to the canonical `https://www.scrapup.dev` equivalent.                                                          | Medium   |
| A localized page is missing a translation block              | Build/validation must surface the gap; no page ships with a missing or stale translation (RN-02).                        | High     |

## 5. Success Criteria and SLAs

**Functional criteria:**

- [ ] All journeys in §2 work end-to-end in all three languages.
- [ ] The three localized routes (`/`, `/pt/`, `/ja/`) resolve and serve the correct language.
- [ ] Root entry auto-detects language and routes accordingly, falling back to English (RN-04).
- [ ] The manual switcher overrides detection (RN-05).
- [ ] Star and docs links resolve to the correct GitHub repository.
- [ ] Each page exposes correct metadata: title, description, social-share tags, canonical URL
      (on the `www` host), and reciprocal language references (default → English).
- [ ] A branded, localized 404 page is served for non-existent paths.
- [ ] The site is validated on the Vercel provisional URL **before** any production domain cutover (RN-15).
- [ ] Business rules RN-01 through RN-15 are observably satisfied.

**Performance / quality SLAs (lightweight landing budget):**

- Pre-rendered HTML served from a CDN; no server render needed for content delivery.
- Zero or near-zero client-side scripting.
- Lighthouse **SEO score = 100**; **Accessibility ≥ 95**; **Performance ≥ 95** on mobile.
- Largest Contentful Paint **< 2.5 s** on a mid-tier mobile profile.
- Responsive from small mobile to wide desktop; the design prototype's visual identity preserved.
- Valid TLS; correct `robots` directives and a sitemap covering all localized routes.

**Quality criteria:**

- [ ] Accessibility basics: semantic structure, sufficient contrast, keyboard-operable controls,
      language attributes per route.
- [ ] Trilingual content parity verified (no missing or stale translation).

**Deferred (under evaluation — not built now, not precluded):**

- Privacy-respecting analytics (L4) — pending decision.

## 6. Glossary

| Term                          | Definition in this context                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing page                  | The single-purpose public page at `www.scrapup.dev` communicating the product.                                                                  |
| Localized route               | A clean URL serving one language: `/` (EN), `/pt/` (PT), `/ja/` (JA).                                                                           |
| Source of truth (language)    | English content from which Portuguese and Japanese are derived and kept in sync.                                                                |
| Auto-detection                | Determining the visitor's language from their browser preference on root entry, with English fallback.                                          |
| Reciprocal language reference | The cross-linking that tells search engines which URL serves which language, with a default.                                                    |
| Pre-rendered HTML             | Page content produced ahead of time and served as static HTML, readable without scripting.                                                      |
| Canonical host                | `www.scrapup.dev` — the single authoritative host; the apex redirects to it.                                                                    |
| Provisional URL               | The temporary Vercel-assigned deployment address (e.g. `*.vercel.app`) used to validate the site before the production domain is pointed at it. |
| Domain cutover                | The final, gated step of pointing the Cloudflare-managed `scrapup.dev` / `www.scrapup.dev` DNS at the validated Vercel deployment.              |
| Catalog (future)              | The planned multi-page expansion — listing and detail pages for skills/agents/commands.                                                         |
| Milestone gate                | A human-sealed checkpoint in scrapup's process (LCO/LCA/IOC/Release); referenced in page copy.                                                  |
