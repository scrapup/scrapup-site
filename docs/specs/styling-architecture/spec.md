# Functional Specification: Styling Architecture Migration

> Phase 1 of Spec-Driven Development — **what** and **why**, implementation-agnostic.
> Authored in English per the project artifact-language rule (`CLAUDE.md`).
> Scope: `scrapup-site` (personal static Astro project — no backend/Sami architecture applies).

## 1. Overview and Objective

- **The Problem:** all visual styling in `scrapup-site` lives as **inline `style="…"` strings**
  (~148 occurrences across 16 of the 21 `.astro` files — `BaseLayout`, `Seo`, and the three
  page-composition files carry none) plus ~25 ad-hoc TypeScript string variables
  (`card`, `tag`, `cta`, `name`, `desc`, …) declared per component frontmatter. There is **no
  styling methodology**: a single CSS class exists in the whole project, no styles are organized
  per component, and shared patterns (cards, buttons, tags, section labels) are duplicated as
  literal strings in every section. Consequences: every visual change means editing multiple
  concatenated strings in multiple files; duplication drifts; markup is unreadable; reuse is
  impossible; and the risk of accidental visual inconsistency is high. The design tokens
  (the six canonical palette custom properties) are the **only** well-organized part.
- **The Solution (What):** migrate **all presentational styling out of inline attributes** into a
  **maintainable, organized CSS architecture** — styles co-located with each component, expressed
  as **named classes** under a single consistent convention, backed by shared **design tokens** and
  a small set of **shared primitive classes** (button, card, tag) for the duplicated patterns. The
  migration is **behavior- and pixel-preserving**: the rendered page does not change.
- **The Value (Why):** maintainability and lower change cost — a visual change becomes editing one
  named rule in one place instead of hunting concatenated strings across files; consistency through
  shared tokens/primitives; readable markup separated from presentation; and a styling foundation
  that scales into the planned multi-page catalog (landing-page RN-13) without re-platforming.
- **Explicitly out of scope:** **no** visual redesign or layout change (the render must stay
  identical); **no** copy, i18n, SEO, routing, build, or deploy changes; **no** new runtime or build
  dependency (plain CSS only — no Sass/SCSS, no Tailwind, no CSS-in-JS); **no** change to the
  existing design tokens' *values*; **no** change to the existing test strategy beyond what is
  needed to keep it green. None of these may be precluded, but none are done here.

## 2. User Journeys

The beneficiary of this work is the **Maintainer/Contributor**; the **Visitor** must perceive no
change, and the **Validator** confirms parity.

**Primary journey — Maintain a component's style:**

1. A **Contributor** opens a section component to adjust its appearance.
2. The component's styles are **co-located** in that component, expressed as **named classes** with
   a predictable convention; shared primitives (button/card/tag) are referenced by class.
3. The Contributor edits **one named rule in one place** and sees the change apply everywhere that
   class is used.
4. **Result:** the change is localized, readable, and low-risk — no concatenated inline strings.

**Primary journey — Visitor views the page (invariant):**

1. A **Visitor** opens any route (`/`, `/pt/`, `/ja/`, a 404 path) before and after the migration.
2. The system serves **visually and behaviorally identical** pages in both cases.
3. **Result:** the Visitor perceives no difference; all content, layout, colors, fonts, animations,
   and interactions are preserved.

**Journey — Validator verifies parity:**

1. The **Validator** runs the existing automated suite (computed-style/token assertions + screenshot
   regression + a11y) against the migrated build.
2. The suite stays **green**; an inspection confirms **no inline `style` attribute remains** (save
   for any genuinely per-instance dynamic value, explicitly documented).
3. **Result:** observable evidence that the refactor preserved the rendered output and behavior.

## 3. Business / Engineering Rules and Constraints

| #     | Rule                                                                                                                                                            | Type        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| RN-01 | The migration must be **behavior- and pixel-preserving**: the rendered output of every route is identical before and after. Parity must be guarded by **both** the deterministic computed-style/token assertions **and** activated screenshot regression with a committed pre-migration baseline — token asserts alone do not catch layout/spacing/border drift. | Obligatory  |
| RN-02 | After migration, **no inline `style="…"` ruleset** remains in any `.astro` file. Structural conditionals (e.g. "first item omits the left border") become pseudo-class/modifier rules; a genuinely data-driven dynamic value (none exist today) would use a CSS custom-property hook, documented. | Obligatory  |
| RN-03 | Styling uses **plain CSS only** — no Sass/SCSS, no Tailwind, no CSS-in-JS, no new runtime or build dependency (architect decision).                              | Restrictive |
| RN-04 | Component-specific styles are **co-located** with the component; **shared/duplicated** patterns (button, card, tag, section label) become **shared primitives**. | Obligatory  |
| RN-05 | A **single, consistent class-naming convention** is applied across all components (defined in `plan.md`).                                                       | Obligatory  |
| RN-06 | **Design tokens are the source of truth for color.** The six canonical palette tokens are preserved unchanged; recurring grey/shade literals become auxiliary tokens. | Obligatory  |
| RN-07 | No literal color hex may remain duplicated across component styles where a token exists or should exist (consolidate to tokens).                                | Restrictive |
| RN-08 | **Zero/near-zero client JS** is preserved; the migration adds no client-side scripting (landing-page RN-08).                                                    | Restrictive |
| RN-09 | All existing **SLAs hold**: Lighthouse SEO = 100, Accessibility ≥ 95, Performance ≥ 95, LCP < 2.5 s (landing-page §5).                                          | Obligatory  |
| RN-10 | Existing **keyframe animations** (`scrapupFlicker`, `glC`/`glM`/`glSlice`) and `prefers-reduced-motion` handling are preserved and referenced by class.         | Obligatory  |
| RN-11 | The migration is delivered **incrementally and verifiably**; inline and migrated styles may coexist during the transition without breaking any route.           | Obligatory  |
| RN-12 | All produced artifacts (CSS, components, docs) are in **English** (artifact rule); **no Sami/backend architecture** is introduced (personal frontend project).  | Obligatory  |

## 4. Edge Cases and Exception Flows

| Scenario                                                              | Expected Behavior                                                                                                          | Severity |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| A style value is genuinely **per-instance dynamic** (computed per element) | Expose it via a CSS custom-property hook on the element (e.g. `style="--x: …"`) consumed by a class rule, or keep a minimal documented inline; never a full inline ruleset. | Medium   |
| A pattern looks shared but has **subtle per-section differences**     | Model the common base as a primitive + per-component **modifier**; never force-fit divergent styles into one class.        | Medium   |
| The **404 page** (standalone, densest inline styles + glitch layers)  | Included in scope; migrated like any component, animations preserved by class.                                             | Medium   |
| A migrated component **changes render** vs. the prototype baseline    | Treated as a **migration bug**: the screenshot/token suite must fail and block until parity is restored.                   | High     |
| `prefers-reduced-motion` users                                        | Reduced-motion behavior is preserved exactly (animations still neutralized under the media query).                        | High     |
| Removing inline styles **breaks specificity/cascade** ordering        | Resolve via the naming convention + co-located scoping so cascade is deterministic; no `!important` hacks.                 | Medium   |

## 5. Success Criteria

**Functional criteria:**

- [ ] Every route (`/`, `/pt/`, `/ja/`, 404) renders **identically** to the pre-migration build.
- [ ] **No inline `style` ruleset** remains in any `.astro` file (only documented dynamic hooks, if any).
- [ ] All shared patterns are expressed as **shared primitives**; component-specific styles are co-located.
- [ ] A **single naming convention** is applied uniformly; recurring greys/shades are **auxiliary tokens**.
- [ ] Rules RN-01 through RN-12 are observably satisfied.

**Quality / parity criteria:**

- [ ] A **pre-migration screenshot baseline** is captured (on the CI container) and the screenshot
      regression is **active**, so layout/spacing/border drift is mechanically caught — not just colors.
- [ ] The existing Playwright suite (computed-style/token asserts + screenshot regression + axe-core)
      stays **green** with **no new flakiness** and **no baseline changes** attributable to render drift.
- [ ] `astro check` and `npm run build` pass; **no new dependency** appears in `package.json`.
- [ ] SLAs preserved: SEO = 100, A11y ≥ 95, Performance ≥ 95, LCP < 2.5 s (landing-page §5).
- [ ] Markup readability improved: section components read as semantic HTML + class names, not style strings.

## 6. Glossary

| Term                | Definition in this context                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Inline style        | A CSS ruleset placed directly in an element's `style="…"` attribute (or a TS string concatenated into it) — the current pattern.    |
| Co-located styles   | Styles defined alongside the component they style (a component's own `<style>` block), not in a distant global sheet.               |
| Scoped styles       | Astro's per-component style isolation (auto-namespaced), so class names cannot collide between components.                          |
| Design token        | A named CSS custom property (e.g. `--neon`, `--ink`) that is the single source of truth for a visual value such as a color.         |
| Auxiliary token     | A token added for a recurring non-core value (e.g. a secondary grey) so literals stop being duplicated across components.            |
| Shared primitive    | A small, reusable class (e.g. `button`, `card`, `tag`) capturing a pattern duplicated across sections, defined once globally.        |
| Modifier            | A variant of a primitive/component class for a contextual difference (e.g. a primary vs. secondary button).                         |
| Pixel parity        | The guarantee that the rendered pixels (and behavior) do not change as a result of the migration.                                  |
| Naming convention   | The single agreed scheme for class names applied across the codebase (the concrete scheme is decided in `plan.md`).                 |
