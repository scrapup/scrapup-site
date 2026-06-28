# Execution Backlog: Styling Architecture Migration

> Phase 3 of Spec-Driven Development — atomic execution backlog. Implements `plan.md` (approved).
> Authored in English per the project artifact-language rule (`CLAUDE.md`).
> **Prerequisites:** `spec.md` + `plan.md` approved. Personal static Astro project — **no Sami/backend
> architecture, no new dependency, plain CSS only**.

## Reference Epic

**Epic:** E-STYLING — inline-styles → scoped component CSS (internal initiative; no PM ClickUp epic).
**System:** `scrapup-site`

---

## Traceability

| Requirement (spec.md)            | Decision (plan.md)                                  | User Story          | Tasks                          |
| -------------------------------- | --------------------------------------------------- | ------------------- | ------------------------------ |
| RN-01 pixel/behavior parity      | Baseline-first + screenshot guard (§4.3, §5)        | US-55, US-58/59/60  | TF-55-01; all consumer TFs     |
| RN-02 no inline ruleset          | Zero-dep guard + seal (§4.2)                        | US-55, US-61        | TF-55-02, TF-61-01             |
| RN-03 plain CSS, no new dep      | Scoped + plain CSS; dev-only guard (§1.1)           | US-56, US-57, US-55 | TF-55-02, TF-56-*, TF-57-*     |
| RN-04 co-located + primitives    | Scoped `<style>` + global primitives (§3.3)         | US-57, US-58/59/60  | TF-57-01/02; consumer TFs      |
| RN-05 single naming convention   | BEM-style per component (§4.1)                      | US-57, US-58/59/60  | TF-57-*; consumer TFs          |
| RN-06 tokens source of truth     | Canonical + auxiliary taxonomy (§3.1)               | US-56               | TF-56-02                       |
| RN-07 no duplicated hex          | Token taxonomy + translucency strategy (§3.1.1)     | US-56, US-58/59/60  | TF-56-02; consumer TFs         |
| RN-08 zero/near-zero client JS   | No JS added (§5.3)                                  | all                 | all                            |
| RN-09 SLAs hold                  | Existing test SLAs unchanged (§5.3)                 | US-55, US-61        | TF-55-01, TF-61-02             |
| RN-10 animations preserved       | `animations.css` verbatim + `prefers-reduced-motion`| US-56, US-60        | TF-56-01, TF-60-03             |
| RN-11 incremental coexistence    | Atomic per-component slices (§5.2)                  | US-58/59/60         | all consumer TFs               |
| RN-12 English, no Sami           | Personal-project constraint (§1)                    | all                 | all                            |

---

## User Stories Overview

| #     | User Story                              | Value Delivered                                                       | Pts | Priority |
| ----- | --------------------------------------- | -------------------------------------------------------------------- | --- | -------- |
| US-55 | Migration safety net                    | Layout/inline regressions are mechanically caught before any change  | 3   | P0       |
| US-56 | Token & global-stylesheet foundation    | One source of truth for color; organized global sheets               | 3   | P0       |
| US-57 | Shared primitives library               | Duplicated patterns become reusable classes                          | 3   | P0       |
| US-58 | Migrate navigation & hero band          | TopBar, Hero, LanguageSwitcher, Landing shell are inline-free         | 5   | P1       |
| US-59 | Migrate narrative sections              | The nine content sections are inline-free                            | 8   | P1       |
| US-60 | Migrate closing & standalone pages      | FinalCta, Footer, 404 are inline-free                                | 3   | P1       |
| US-61 | Seal & document the architecture        | Guard hard-fails; convention documented; diagrams rendered; final verification | 3   | P2       |

**Topological order:** US-55 → US-56 → US-57 → (US-58 ∥ US-59 ∥ US-60) → US-61.
Consumer stories (US-58/59/60) depend only on US-56 (tokens) + US-57 (primitives) and are mutually
parallelizable; each component TF is independently verified by the screenshot + token suite. US-61
runs after the last consumer TF.

---

## US-55: Migration safety net

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 3 SP · **Prioridade:** P0

### Narrativa de Valor

> **Eu como** Validator, **Eu quero** um baseline de layout e um guard de "zero inline" antes de mexer,
> **Para que** qualquer drift visual ou estilo inline residual seja pego mecanicamente, não no olho.

### Contexto de Negócio

The token suite catches color/font drift but the screenshot guard is `test.skip` and has **no
baseline** — layout/spacing/border drift would pass unseen. This US locks the safety net **before**
any migration: a committed pre-migration baseline and a zero-dependency inline-style guard.

### Critérios de Aceitação (Negócio)

- [ ] A full-page screenshot baseline of the **current** site is committed and the layout suite runs.
- [ ] A guard reports every residual `style=` ruleset; wired into `npm run check` (warn-only for now).

### Regras de Negócio Aplicáveis

| #     | Regra                       | Tipo        |
| ----- | --------------------------- | ----------- |
| RN-01 | Pixel/behavior parity       | Obrigatória |
| RN-02 | No inline ruleset           | Obrigatória |
| RN-03 | No new runtime/build dep     | Restritiva  |

### Sequenciamento de Tarefas

| #        | Tarefa                              | Escopo     | Depende de |
| -------- | ----------------------------------- | ---------- | ---------- |
| TF-55-01 | Pre-migration screenshot baseline   | Test infra | —          |
| TF-55-02 | No-inline-style guard (warn mode)   | Build guard | —          |

### Tarefas

#### TF-55-01: [scrapup-site] Pre-migration screenshot baseline

**User Story:** US-55 · **Prioridade:** P0

##### 1. Descrição e Objetivo

> **Eu como** Validator, **Eu quero** baselines de screenshot do site atual, **Para que** a migração
> seja comparada pixel a pixel contra o estado inline original.

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `tests/visual/layout.spec.ts` — already present; generates `*.png` baselines under
  `tests/visual/` when run with `RUN_VISUAL=1 --update-snapshots`.
- `tests/visual/__screenshots__/` (or the configured `snapshotPathTemplate`) — committed baseline PNGs.

**2.4 Resiliência / Parity**

| Cenário                | Estratégia                                                   | Impacto              |
| ---------------------- | ------------------------------------------------------------ | -------------------- |
| OS font-render diff    | Generate baselines **only** on the official Playwright CI container | Deterministic baseline |
| Animations/fonts flake | `prepare` helper (fonts.ready + animations disabled) already used | Stable snapshots     |

##### 4. Orientação de Execução

**4.1 Contexto de Entrada:** `plan.md` §4.3; `tests/visual/layout.spec.ts`; `tests/support/prepare.ts`; `CONTRIBUTING` (visual-baseline rule).
**4.2 Passos:** 1) build current site; 2) on the CI Playwright container run `RUN_VISUAL=1 npm run test:e2e:update -- tests/visual/layout.spec.ts`; 3) commit the generated PNGs.
**4.3 Comando de Validação:** `RUN_VISUAL=1 npm run test:e2e -- tests/visual/layout.spec.ts` (green against the just-committed baseline).
**4.4 Restrições Negativas:** NÃO gerar baseline em macOS/Windows local; NÃO alterar nenhum componente nesta TF (baseline = estado atual).
**4.6 Critérios de Saída:** baseline PNGs for `/`, `/pt/`, `/ja/`, 404 committed; layout suite green.

##### 5. Definition of Done

- [ ] Baseline screenshots committed for all four routes, generated on the CI container.
- [ ] `RUN_VISUAL=1` layout suite passes against them with no source change.

---

#### TF-55-02: [scrapup-site] No-inline-style guard (warn mode)

**User Story:** US-55 · **Prioridade:** P0

##### 1. Descrição e Objetivo

> **Eu como** mantenedor, **Eu quero** um check que liste qualquer `style=` com ruleset, **Para que**
> a remoção de inline seja verificável e, ao final, obrigatória.

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `scripts/no-inline-styles.mjs` — zero-dependency Node script: scan `src/**/*.astro`; flag any
  `style="…"` / `style={…}` containing a CSS ruleset (a `prop:value`); **allow** `style="--token: …"`
  custom-property hooks; print `file:line` for each offender; exit non-zero only when `--strict`.
- `package.json` `check` — append `&& node scripts/no-inline-styles.mjs` (warn-only: prints count,
  exits 0 without `--strict`). The `--strict` flip happens in TF-61-01.

##### 4. Orientação de Execução

**4.1 Contexto de Entrada:** `scripts/i18n-parity.mjs` (mirror its UX/exit conventions).
**4.3 Comando de Validação:** `node scripts/no-inline-styles.mjs` lists the current ~16 files; `npm run check` stays green (warn mode).
**4.4 Restrições Negativas:** NÃO adicionar dependência (stylelint etc.); NÃO falhar a build ainda (warn-only até a selagem).
**4.6 Critérios de Saída:** script reports offenders with `file:line`; `check` runs it without breaking.

##### 5. Definition of Done

- [ ] `scripts/no-inline-styles.mjs` exists, zero-dep, lists offenders, supports `--strict`.
- [ ] Wired into `npm run check` in warn mode; allows `--token` hooks.

---

## US-56: Token & global-stylesheet foundation

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 3 SP · **Prioridade:** P0

### Narrativa de Valor

> **Eu como** mantenedor, **Eu quero** os tokens completos e o `global.css` organizado em camadas,
> **Para que** toda cor venha de um nome único e os componentes consumam uma fundação limpa.

### Critérios de Aceitação (Negócio)

- [ ] `global.css` split into `tokens.css` / `base.css` / `animations.css` (aggregated), import path unchanged.
- [ ] Full token taxonomy (§3.1) present; `tokens.spec.ts` stays green (canonical values unchanged).

### Regras de Negócio Aplicáveis

| #     | Regra                          | Tipo        |
| ----- | ------------------------------ | ----------- |
| RN-06 | Tokens source of truth         | Obrigatória |
| RN-07 | No duplicated hex              | Restritiva  |
| RN-10 | Animations preserved           | Obrigatória |

### Sequenciamento de Tarefas

| #        | Tarefa                                       | Escopo  | Depende de |
| -------- | -------------------------------------------- | ------- | ---------- |
| TF-56-01 | Split global.css into layered sheets         | CSS infra | —        |
| TF-56-02 | Add auxiliary + translucency tokens          | Tokens  | TF-56-01   |

### Tarefas

#### TF-56-01: [scrapup-site] Split global.css into layered sheets

**User Story:** US-56 · **Prioridade:** P0

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `src/styles/tokens.css` — move the six canonical `:root` custom properties verbatim.
- `src/styles/base.css` — move the reset, `html/body`, `::selection`, `::placeholder`, font-smoothing.
- `src/styles/animations.css` — move `@keyframes scrapupFlicker`, `glC`, `glM`, `glSlice` **and** the
  `prefers-reduced-motion` block verbatim.
- `src/styles/global.css` — becomes `@import './tokens.css'; @import './base.css'; @import './animations.css';` (and `primitives.css` is added in TF-57). `BaseLayout` import unchanged.

**2.4 Parity**

| Cenário          | Estratégia                                  | Impacto |
| ---------------- | ------------------------------------------- | ------- |
| Import order     | Preserve original cascade order in `global.css` | None |

##### 4. Orientação de Execução

**4.1 Contexto de Entrada:** `src/styles/global.css` (current 141 lines); `src/layouts/BaseLayout.astro` (import).
**4.3 Comando de Validação:** `npm run build && RUN_VISUAL=1 npm run test:e2e -- tests/visual` (tokens + layout green; no visual diff).
**4.4 Restrições Negativas:** NÃO alterar nenhum valor; NÃO mudar o import do BaseLayout; movimento puro.
**4.6 Critérios de Saída:** four sheets exist; `global.css` aggregates them; suite green, zero diff.

##### 5. Definition of Done

- [ ] `tokens.css`/`base.css`/`animations.css` contain the moved rules verbatim.
- [ ] `global.css` imports them in the original cascade order; `BaseLayout` import unchanged.
- [ ] `tokens.spec.ts` + layout baseline green (no diff).

---

#### TF-56-02: [scrapup-site] Auxiliary & translucency tokens

**User Story:** US-56 · **Prioridade:** P0

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `src/styles/tokens.css` — add the auxiliary foreground scale (`--text-strong #F2F3F8`,
  `--text-soft #C7CCD8`, `--text-muted #AEB4C2`, `--text-footer #9AA0B0`, `--text-faint #8A90A0`,
  `--text-dim #7E8597`, `--text-quiet #5A6172`), backgrounds (`--ink-deep #07090E`), decorative
  (`--glitch-magenta #FF3DA6`), and the RGB-triplet tokens (`--panel-hi 20,26,40`, `--panel-lo 14,18,28`,
  `--hairline 120,190,210`, `--mark 190,200,220`, `--violet 179,136,255`). Values byte-identical to
  the literals they replace (§3.1 / §3.1.1).

**2.3 Contrato (exact values):** see `plan.md` §3.1 and §3.1.1 tables — no value may differ.

##### 4. Orientação de Execução

**4.1 Contexto de Entrada:** `plan.md` §3.1, §3.1.1.
**4.3 Comando de Validação:** `npm run build` (tokens parse); a temporary computed-style probe may assert a sample (e.g. `--text-strong` = `rgb(242,243,248)`).
**4.4 Restrições Negativas:** NÃO consumir os tokens nos componentes nesta TF (só declarar); NÃO inventar valores fora do mapeamento.
**4.6 Critérios de Saída:** all auxiliary + triplet tokens declared with the exact mapped values.

##### 5. Definition of Done

- [ ] Every auxiliary, background, decorative and RGB-triplet token from §3.1/§3.1.1 is declared.
- [ ] Canonical tokens untouched; `tokens.spec.ts` still green.

---

## US-57: Shared primitives library

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 3 SP · **Prioridade:** P0

### Narrativa de Valor

> **Eu como** mantenedor, **Eu quero** os primitivos compartilhados (`.btn`/`.card`/`.tag` + tipográficos),
> **Para que** os padrões duplicados existam uma única vez antes de migrar os consumidores.

### Critérios de Aceitação (Negócio)

- [ ] `primitives.css` defines the typography + component primitives of §3.3 and is aggregated by `global.css`.
- [ ] Primitives use only tokens (no raw hex); building the site keeps the baseline green (nothing consumes them yet).

### Regras de Negócio Aplicáveis

| #     | Regra                          | Tipo        |
| ----- | ------------------------------ | ----------- |
| RN-04 | Shared patterns → primitives   | Obrigatória |
| RN-05 | Single naming convention       | Obrigatória |
| RN-07 | No duplicated hex              | Restritiva  |

### Sequenciamento de Tarefas

| #        | Tarefa                          | Escopo | Depende de |
| -------- | ------------------------------- | ------ | ---------- |
| TF-57-01 | Typography primitives           | CSS    | TF-56-02   |
| TF-57-02 | Component primitives (btn/card/tag) | CSS | TF-56-02   |

### Tarefas

#### TF-57-01: [scrapup-site] Typography primitives

**User Story:** US-57 · **Prioridade:** P0

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `src/styles/primitives.css` (new; add `@import` to `global.css`) — define `.section-title`,
  `.lede`, `.kicker` (+`.kicker--faint`), `.item-title`, `.item-desc` exactly per §3.3 using tokens
  (`--text-strong`, `--text-muted`, `--light-ink`, `--text-faint`, `--text-dim`).

##### 4. Orientação de Execução

**4.1 Contexto de Entrada:** `plan.md` §3.3; the current literal rulesets for the headline/lede/kicker/title/desc patterns (see §3.5 file list).
**4.3 Comando de Validação:** `npm run build && RUN_VISUAL=1 npm run test:e2e -- tests/visual` (no diff — nothing consumes them yet).
**4.4 Restrições Negativas:** NÃO aplicar as classes a componentes nesta TF; NÃO usar hex literal (só tokens).
**4.6 Critérios de Saída:** the five typography primitives compile and match the documented rulesets.

##### 5. Definition of Done

- [ ] `.section-title`/`.lede`/`.kicker`(+modifier)/`.item-title`/`.item-desc` defined via tokens only.
- [ ] `primitives.css` aggregated by `global.css`; baseline still green.

---

#### TF-57-02: [scrapup-site] Component primitives (btn / card / tag)

**User Story:** US-57 · **Prioridade:** P0

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `src/styles/primitives.css` — define `.btn` (+`.btn--primary`, `.btn--ghost`), `.card`
  (+`.card--accent`, `.card--edge`), `.tag` (+`.tag--cyan`, `.tag--neon`) exactly per §3.3, using
  tokens and the translucency strategy (`color-mix` for brand; `rgba(var(--panel-*/--hairline), α)`).

##### 4. Orientação de Execução

**4.1 Contexto de Entrada:** `plan.md` §3.3, §3.1.1; current CTA/card/tag rulesets (Hero, FinalCta, 404, Problem, Pillars, Status, TwoRoles, WhyDifferent, BuiltOnUP, OpenExtensible).
**4.3 Comando de Validação:** `npm run build && RUN_VISUAL=1 npm run test:e2e -- tests/visual` (no diff yet).
**4.4 Restrições Negativas:** NÃO aplicar a componentes nesta TF; NÃO duplicar rgba de marca (usar `color-mix`).
**4.6 Critérios de Saída:** btn/card/tag primitives + modifiers compile per the documented patterns.

##### 5. Definition of Done

- [ ] `.btn`/`.card`/`.tag` and their modifiers defined via tokens + translucency strategy.
- [ ] No raw brand rgba; baseline still green.

---

## US-58: Migrate navigation & hero band

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 5 SP · **Prioridade:** P1

### Narrativa de Valor

> **Eu como** visitante, **Eu quero** a barra de topo, o hero, o seletor de idioma e o shell visuais
> idênticos, **Para que** a migração seja invisível — agora servidos por CSS scoped, sem inline.

### Critérios de Aceitação (Negócio)

- [ ] `TopBar`, `Hero`, `LanguageSwitcher`, `Landing` render identically (screenshot + token green).
- [ ] None of the four retains an inline `style=` ruleset; all consume tokens/primitives per §3.5.

### Regras de Negócio Aplicáveis

| #     | Regra                       | Tipo        |
| ----- | --------------------------- | ----------- |
| RN-01 | Pixel/behavior parity       | Obrigatória |
| RN-02 | No inline ruleset           | Obrigatória |
| RN-11 | Incremental coexistence     | Obrigatória |

### Sequenciamento de Tarefas

| #        | Componente              | Inline | Depende de         |
| -------- | ----------------------- | ------ | ------------------ |
| TF-58-01 | `TopBar.astro`          | 9      | TF-57-01           |
| TF-58-02 | `Hero.astro`            | 12     | TF-57-01, TF-57-02 |
| TF-58-03 | `LanguageSwitcher.astro`| 2      | TF-56-02           |
| TF-58-04 | `Landing.astro` (shell) | 8      | TF-56-02           |

> **Common per-component contract (applies to every migration TF in US-58/59/60):**
> **Steps:** move each inline ruleset into the component's scoped `<style>` as `block__element`
> classes (block = component name in kebab-case, §4.1); apply the primitives/tokens listed for it in
> `plan.md` §3.5; replace structural conditionals (e.g. `${i>0}` borders) with `:not(:first-child)` /
> modifiers; remove every inline `style=` ruleset (keep only documented `--token` hooks if truly
> dynamic — none expected). **Validation:** `npm run check` (astro check + i18n parity + no-inline
> guard) **and** `npm run build` **and** `RUN_VISUAL=1 npm run test:e2e` (tokens + e2e + layout
> screenshots). **Exit / DoD:** no inline ruleset remains in the file; screenshot regression matches
> the TF-55-01 baseline (zero diff); `tokens.spec.ts` + e2e green. **Negative:** NÃO alterar markup
> semântico, copy, cor ou layout; NÃO introduzir hex/rgba duplicado; NÃO adicionar JS/dependência.

### Tarefas

#### TF-58-01: [scrapup-site] Migrate TopBar.astro

**User Story:** US-58 · **Prioridade:** P1 — applies the common contract above.
**Especificidades (§3.5):** wordmark via `.item-title` + neon `scrapupFlicker` (from `animations.css`); tagline `.kicker` (`--text-dim`); GH link. Scoped block `.top-bar`.

##### 5. Definition of Done
- [ ] `TopBar` inline-free; flicker animation preserved by class; screenshot + token green.

---

#### TF-58-02: [scrapup-site] Migrate Hero.astro

**User Story:** US-58 · **Prioridade:** P1 — applies the common contract above.
**Especificidades (§3.5):** neon badge + pulse dot (scoped, `color-mix` neon); scoped large title (`--text-strong`) and scoped lede (`--text-muted`); CTAs via `.btn--primary` (star) + `.btn--ghost` (docs); `.kicker`. Scoped block `.hero`.

##### 5. Definition of Done
- [ ] `Hero` inline-free; CTAs use `.btn` primitives; badge/glow preserved; screenshot + token green (incl. CTA accent assert).

---

#### TF-58-03: [scrapup-site] Migrate LanguageSwitcher.astro

**User Story:** US-58 · **Prioridade:** P1 — applies the common contract above.
**Especificidades (§3.5):** `--light-ink` links; `${i>0}` divider → `.lang-switch__item:not(:first-child)` border using `rgba(var(--hairline), .3)`; neon active underline (`color-mix`). Keep the existing `lang-switch` class; cookie inline script (the only client JS) untouched. Scoped block `.lang-switch`.

##### 5. Definition of Done
- [ ] `LanguageSwitcher` inline-free; divider via `:not(:first-child)`; active underline preserved; `switcher.spec.ts` + screenshot green; cookie script intact.

---

#### TF-58-04: [scrapup-site] Migrate Landing.astro (shell)

**User Story:** US-58 · **Prioridade:** P1 — applies the common contract above.
**Especificidades (§3.5):** ambient radial glow (`--cy`/`--violet`/`color-mix` neon), scanlines + registration marks (`rgba(var(--mark), α)`), all `aria-hidden` decorative layers; main container. Scoped block `.landing`. Keep `aria-hidden` so the screenshot `mask` still applies.
**Blind-spot (plan §4.3):** these `aria-hidden` layers are **masked** in the screenshot suite → **not** pixel-guarded. Move every declaration **verbatim** (tokens-only) and do a **manual visual check** (animations on) comparing against the pre-migration render before committing.

##### 5. Definition of Done
- [ ] `Landing` shell inline-free; decorative layers keep `aria-hidden`; ambient glow/scanlines preserved; screenshot green.
- [ ] **Manual visual check** (animations on) confirms the masked decorative layers are unchanged.

---

## US-59: Migrate narrative sections

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 8 SP · **Prioridade:** P1

### Narrativa de Valor

> **Eu como** visitante, **Eu quero** as nove seções de conteúdo idênticas, **Para que** a narrativa
> permaneça fiel — agora com CSS scoped e primitivos, sem inline.

### Critérios de Aceitação (Negócio)

- [ ] The nine sections render identically (screenshot per route + token green) and are inline-free.
- [ ] Headlines use `.section-title`, ledes use `.lede`, cards/tags use the component primitives (§3.5).

### Regras de Negócio Aplicáveis

| #     | Regra                       | Tipo        |
| ----- | --------------------------- | ----------- |
| RN-01 | Pixel/behavior parity       | Obrigatória |
| RN-04 | Co-located + primitives     | Obrigatória |
| RN-07 | No duplicated hex           | Restritiva  |

### Sequenciamento de Tarefas

Each TF applies the **common per-component contract** declared in US-58. Order is independent; group
by reuse. Specifics from `plan.md` §3.5.

| #        | Componente                  | Inline | Primitives / notes                                                |
| -------- | --------------------------- | ------ | ----------------------------------------------------------------- |
| TF-59-01 | `Problem.astro`             | 6      | `.section-title`, `.lede`, `.card`, `.item-title`, `.item-desc`; stat `--neon`+glow |
| TF-59-02 | `Answer.astro`              | 8      | `.section-title`, `.lede`, `.item-title`, `.item-desc`; step `--neon` |
| TF-59-03 | `HowItWorks.astro`          | 19     | `.kicker`, `.item-title`, `.item-desc`; scoped title (700+cyan shadow); milestone panel (`--panel-hi/-lo`, `--hairline`); phase `--current` modifier; `--text-soft` |
| TF-59-04 | `TwoRoles.astro`            | 2      | `.card--accent`, `.item-title`, `.item-desc`; `--text-soft` kicker |
| TF-59-05 | `Pillars.astro`             | 4      | `.section-title`, `.card`, `.item-title`, `.item-desc`; code `--neon` |
| TF-59-06 | `WhyDifferent.astro`        | 9      | `.section-title`, `.lede`, `.card--edge`, `.kicker`, `.item-desc`; floor dashed vs edge neon |
| TF-59-07 | `BuiltOnUP.astro`           | 6      | `.section-title`, `.lede`, `.tag--cyan`; `--text-soft`/`--text-faint` |
| TF-59-08 | `OpenExtensible.astro`      | 6      | `.section-title`, `.item-title`, `.item-desc`, `.tag--neon` |
| TF-59-09 | `Status.astro`              | 10     | `.section-title`, `.kicker`, `.card`; `--text-soft`/`--text-faint`/`--text-dim` |

##### Definition of Done (per TF)

- [ ] Component inline-free; consumes the listed primitives/tokens; structural conditionals → pseudo-class/modifier.
- [ ] Screenshot regression zero-diff vs. baseline; `tokens.spec.ts` + e2e green; no-inline guard clean for the file.

> `HowItWorks.astro` (TF-59-03) is the densest (19 inline + milestone panel + `--current` state): it
> may use the optional iterative decomposition (template §4.7) when implemented — 3+ regions
> (panel, phase row, title), DoD with 4+ criteria.

---

## US-60: Migrate closing & standalone pages

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 3 SP · **Prioridade:** P1

### Narrativa de Valor

> **Eu como** visitante, **Eu quero** o CTA final, o rodapé e a página 404 idênticos, **Para que** o
> fechamento do site e o 404 de marca permaneçam fiéis — sem inline.

### Critérios de Aceitação (Negócio)

- [ ] `FinalCta`, `Footer`, `404` render identically (screenshot + token green) and are inline-free.
- [ ] 404 glitch animations (`glC`/`glM`/`glSlice`) preserved by class; `--glitch-magenta` token used.

### Regras de Negócio Aplicáveis

| #     | Regra                       | Tipo        |
| ----- | --------------------------- | ----------- |
| RN-01 | Pixel/behavior parity       | Obrigatória |
| RN-02 | No inline ruleset           | Obrigatória |
| RN-10 | Animations preserved        | Obrigatória |

### Sequenciamento de Tarefas

Each TF applies the **common per-component contract** (US-58). Specifics from §3.5.

| #        | Componente          | Inline | Primitives / notes                                                            |
| -------- | ------------------- | ------ | ----------------------------------------------------------------------------- |
| TF-60-01 | `FinalCta.astro`    | 14     | `.section-title` (scoped size), `.lede`, `.card--accent`, `.btn--primary`, `.btn--ghost`, `.item-title` |
| TF-60-02 | `Footer.astro`      | 8      | `--ink-deep` bg, `rgba(var(--hairline),.12)` top border, `--text-footer`/`--text-quiet`, wordmark `--light-ink`/`--neon` glow |
| TF-60-03 | `pages/404.astro`   | 25     | `.btn--primary`/`.btn--ghost`, `.kicker`; scoped glitch title — 3 layers `glC`→`var(--cy)`, `glM`→`--glitch-magenta`, `glSlice`→`var(--neon)`; scanline `rgba(0,0,0,.14)`; `--text-strong`/`--text-muted`; ambient glow (`--violet`/`--cy`/`color-mix` neon) |

##### Definition of Done (per TF)

- [ ] Component inline-free; consumes listed primitives/tokens; screenshot zero-diff; e2e + token green.
- [ ] (TF-60-03) `notfound.spec.ts` green (HTTP 404); all three glitch layers (`glC`/`glM`/`glSlice`) + scanline + `prefers-reduced-motion` preserved.
- [ ] (TF-60-03) **Manual visual check** (animations on): glitch effect is unchanged — animations are disabled in the screenshot suite (plan §4.3 blind-spot).

> `404.astro` (TF-60-03) is the densest file (25 inline + glitch layers): candidate for the optional
> §4.7 iterative decomposition.

---

## US-61: Seal & document the architecture

**Epic:** E-STYLING · **System:** `scrapup-site` · **Estimativa:** 2 SP · **Prioridade:** P2

### Narrativa de Valor

> **Eu como** mantenedor, **Eu quero** o guard em hard-fail, a convenção documentada e os diagramas
> renderizados, **Para que** ninguém reintroduza inline e os contribuidores entendam o sistema.

### Critérios de Aceitação (Negócio)

- [ ] `no-inline-styles.mjs` runs in `--strict` mode and **fails** the build on any residual inline ruleset.
- [ ] README + CONTRIBUTING gain a "Styling" section (scoped CSS + naming + tokens/primitives + baselines).
- [ ] The two plan diagrams are rendered to PNG under `docs/diagrams/`.
- [ ] Final verification passes: full suite green, SLAs hold (RN-09), animations/shell manually confirmed (RN-10).

### Regras de Negócio Aplicáveis

| #     | Regra                       | Tipo        |
| ----- | --------------------------- | ----------- |
| RN-02 | No inline ruleset (enforced) | Obrigatória |
| RN-09 | SLAs hold                    | Obrigatória |

### Sequenciamento de Tarefas

| #        | Tarefa                                   | Escopo | Depende de            |
| -------- | ---------------------------------------- | ------ | --------------------- |
| TF-61-01 | Flip no-inline guard to `--strict`       | Build  | all US-58/59/60 TFs   |
| TF-61-02 | Document styling convention (README/CONTRIBUTING) | Docs | TF-61-01        |
| TF-61-03 | Render plan diagrams to PNG              | Docs   | —                     |
| TF-61-04 | Final verification & SLA/animation check | QA     | TF-61-01              |

### Tarefas

#### TF-61-01: [scrapup-site] Flip no-inline guard to strict

**User Story:** US-61 · **Prioridade:** P2

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `package.json` `check` — change the guard call to `node scripts/no-inline-styles.mjs --strict` so a
  residual `style=` ruleset fails `check` (and CI).

##### 4. Orientação de Execução

**4.3 Comando de Validação:** `npm run check` fails if any `.astro` still has an inline ruleset; passes when all 16 are migrated.
**4.4 Restrições Negativas:** NÃO flipar antes de TF-60 concluída; NÃO relaxar a allowlist além de `--token` hooks.
**4.6 Critérios de Saída:** `npm run check` green with `--strict`; injecting a test inline style makes it red.

##### 5. Definition of Done

- [ ] Guard runs `--strict` in `check`; build fails on residual inline; green on the migrated tree.

---

#### TF-61-02: [scrapup-site] Document the styling convention

**User Story:** US-61 · **Prioridade:** P2

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `README.md` — add a **Styling** section: scoped `<style>` + BEM-style naming (§4.1), token layers
  (`tokens/base/animations/primitives`), shared primitives catalog, the no-inline rule, and how to
  regenerate screenshot baselines (CI-container only).
- `CONTRIBUTING.md` — add the no-inline rule + "new shared pattern → primitive, not inline" guidance;
  reference the visual-baseline procedure.
- Update `scrapup-site/CLAUDE.md` "Brand palette" note to point at `src/styles/tokens.css` and the
  auxiliary scale.

##### 5. Definition of Done

- [ ] README + CONTRIBUTING describe scoped CSS, naming, tokens/primitives, no-inline rule, baselines.
- [ ] `CLAUDE.md` palette note updated to the new token layout.

---

#### TF-61-03: [scrapup-site] Render plan diagrams to PNG

**User Story:** US-61 · **Prioridade:** P2

##### 2. Especificação Técnica

**2.1 Pontos de Interceptação**

- `docs/diagrams/styling-architecture.puml` + `.png` and `docs/diagrams/migration-loop.puml` + `.png`
  — extract the two PlantUML blocks from `plan.md` §2 and render (skill `expert-plantuml`), mirroring
  the `landing-page/` diagram convention; embed the PNGs back into `plan.md` §2.

##### 4. Orientação de Execução

**4.5 Skills Obrigatórias:** `expert-plantuml` (render/validate the diagrams).
**4.6 Critérios de Saída:** both PNGs render and are referenced from `plan.md` §2.

##### 5. Definition of Done

- [ ] Two `.puml` sources + rendered `.png` committed under `docs/diagrams/`.
- [ ] `plan.md` §2 embeds the rendered images.

---

#### TF-61-04: [scrapup-site] Final verification & SLA/animation check

**User Story:** US-61 · **Prioridade:** P2

##### 1. Descrição e Objetivo

> **Eu como** Validator, **Eu quero** uma verificação final do conjunto migrado, **Para que** parity,
> SLAs e as regiões fora do guard automático (animações, shell mascarado) sejam confirmadas antes de fechar.

##### 2. Especificação Técnica

**2.1 Pontos de Verificação**

- Full suite green: `npm run check` (`--strict` guard) + `npm run build` + `RUN_VISUAL=1 npm run test:e2e` (tokens + e2e + screenshot, all four routes).
- **Automated-guard blind spots (plan §4.3):** manual visual check with **animations on** — `scrapupFlicker` (TopBar/Hero/404), 404 glitch (`glC`/`glM`/`glSlice`), and `Landing` shell decorative layers (masked) — vs. the pre-migration render.
- **SLA spot-check (RN-09):** Lighthouse on `/` and one localized route — SEO = 100, Performance ≥ 95, Accessibility ≥ 95, LCP < 2.5 s; confirm shipped CSS size did not regress.
- Optional: `multi-spec-review` (9 lenses) over the full diff before concluding.

##### 4. Orientação de Execução

**4.5 Skills Obrigatórias:** `verification-before-completion`; `multi-spec-review` (optional, pre-merge).
**4.6 Critérios de Saída:** suite green; manual animation/shell parity confirmed; Lighthouse SLAs met.

##### 5. Definition of Done

- [ ] `check` (strict) + `build` + `RUN_VISUAL=1 test:e2e` all green on the migrated tree.
- [ ] Manual visual check confirms animations + masked shell unchanged (RN-10).
- [ ] Lighthouse SEO/Perf/A11y/LCP SLAs hold (RN-09); CSS size not regressed.

---

## Notes

- **Skills for execution:** `scrapforge-forge` / `test-driven-agentic-development` to implement;
  `baseline-assessment` to gate readiness; `expert-plantuml` for TF-61-03; `multi-spec-review`
  (9 lenses) before concluding. **No** Sami skills (`expert-sami-*`) apply — personal frontend project.
- **Parity backstop:** every consumer TF is gated by the TF-55-01 screenshot baseline + `tokens.spec.ts`;
  a diff is a migration bug (RN-01), never an accepted baseline update.
- **Diagrams:** the two structural diagrams live in `plan.md` §2; rendered to PNG in TF-61-03.
- **Atomicity:** one component per migration TF; US-58/59/60 are mutually parallelizable after US-56+US-57.
