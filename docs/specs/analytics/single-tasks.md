# Analytics — Vercel Web Analytics (single-tasks)

Fluxo incremental (baixo impacto, sem `spec.md` / `plan.md`). Cada Tarefa é
auto-contida. Idioma dos artefatos de código/commit: inglês (ver `../../../CLAUDE.md`).

## Contexto

Instrumentar o `scrapup-site` (Astro SSG no Vercel) com **Vercel Web Analytics**
via o pacote oficial `@vercel/analytics@1.6.1` e o componente `@vercel/analytics/astro`.
Privacy-friendly (sem cookies), zero-config, script servido **same-origin**
(`/_vercel/insights/script.js`, beacon em `/_vercel/insights/event`).

**Decisões fixadas com o utilizador (2026-06-28):**

| Decisão | Resultado |
|---|---|
| Produto | Vercel Web Analytics (não Google Analytics) |
| CSP (`vercel.json`) | **Sem alteração** — script e beacon são same-origin; `connect-src` cai no fallback `default-src 'self'`, script em `script-src 'self'` |
| Env `NEXT_PUBLIC_GA_ID` (Vercel dashboard) | **Sem uso** — não é lida pelo Astro nem necessária; remover (ação manual) |
| Cobertura | **Todas** as páginas: EN `/`, PT `/pt/`, JA `/ja/` (via `BaseLayout`) **e o 404** (instrumentado à parte — ver TF-62-02) |
| Regressão | Teste e2e automatizado (Playwright) garante o componente montado (TF-62-03) |

**Topologia de render (afeta como cada página é validada):**

| Rota | Render | Onde monta o Analytics | Artefato verificável |
|---|---|---|---|
| `/` (EN) | **On-demand** (`prerender = false`) | `BaseLayout.astro` | `npm run preview` (SSR Node) — **não** existe em `dist/` |
| `/pt/`, `/ja/` | Estático | `BaseLayout.astro` | `dist/pt/index.html`, `dist/ja/index.html` |
| `404` | Estático | **`404.astro`** (não herda `BaseLayout`) | `dist/404.html` |

**Pré-requisitos manuais no dashboard Vercel (fora do código — responsabilidade do utilizador):**
1. Ativar **Web Analytics** no projeto (`scrapup-site`) — senão `/_vercel/insights/*` não é servido e não há coleta.
2. Remover a env `NEXT_PUBLIC_GA_ID` (sem uso após esta entrega).

> **Ambiente de teste/preview não coleta:** a suite Playwright roda via `npm run preview`
> (adapter Node, fora da Vercel), onde `/_vercel/insights/*` **não existe**. A injeção do runtime
> falha em silêncio (404 inócuo); nenhum teste atual assere console/network (só axe a11y), então
> não há regressão. Os testes validam **presença no DOM**, nunca sucesso de rede.

---

## US-62 — Métricas de tráfego do scrapup.dev

> **Como** mantenedor do scrapup.dev,
> **Quero** coletar métricas de tráfego (page views, visitantes) de todas as páginas trilíngues e do 404,
> **Para** medir alcance e detectar links quebrados, sem comprometer privacidade nem a CSP restritiva.

**Valor:** observabilidade de produto no landing público, com tooling open/zero-config já
disponível na plataforma de deploy (Vercel), sem scripts de terceiros nem cookies.

---

### [TF-62-01] [scrapup-site] Declarar `@vercel/analytics` como dependência explícita

**User Story:** US-62 — Métricas de tráfego do scrapup.dev
**Sistema:** scrapup-site
**Prioridade:** P0

#### 1. Descrição e Objetivo

> **Eu como** mantenedor do build,
> **Eu quero** declarar `@vercel/analytics` em `dependencies` do `package.json`,
> **Para que** o componente Astro tenha origem explícita e versionada, sem depender da
> resolução transitiva de `@astrojs/vercel`.

*Contexto:* o pacote já existe em `node_modules` como dependência transitiva de
`@astrojs/vercel`, mas **não está declarado** em `package.json`. Importar de uma transitiva é
frágil (pode sumir num dedupe/upgrade). Tornar direta.

#### 2. Especificação Técnica

**2.1 Pontos de interceptação**
- `package.json` — adicionar `"@vercel/analytics": "^1.6.1"` em `dependencies` (ordem alfabética: após `@astrojs/vercel`, antes de `astro`).
- `package-lock.json` — atualizado pelo `npm install` (não editar à mão).

**2.2 Restrições negativas (TF)**
- NÃO usar versão diferente da já resolvida (`1.6.1`); manter `^1.6.1`.
- NÃO mover para `devDependencies` — é runtime do client em produção.

#### 3. Orientação de Execução

**3.1 Passos**
1. Editar `package.json` adicionando a dependência.
2. Rodar `npm install` para sincronizar o lockfile.

**3.2 Comando de validação**
```bash
cd /Users/marco/Develop/scrapup/scrapup-site && \
  node -e "require('@vercel/analytics/package.json')" && \
  grep -q '"@vercel/analytics"' package.json && echo OK
```

#### 4. Definition of Done
- [ ] `@vercel/analytics` consta em `dependencies` do `package.json` com `^1.6.1`.
- [ ] `package-lock.json` reflete a dependência direta (sem mudanças não relacionadas).
- [ ] `npm install` conclui sem erro.

---

### [TF-62-02] [scrapup-site] Montar `<Analytics />` em todas as páginas (BaseLayout + 404)

**User Story:** US-62 — Métricas de tráfego do scrapup.dev
**Sistema:** scrapup-site
**Prioridade:** P1

#### 1. Descrição e Objetivo

> **Eu como** mantenedor do landing,
> **Eu quero** renderizar `<Analytics />` no layout base **e** na página 404,
> **Para que** EN/PT/JA **e** os 404 emitam page views.

*Contexto:* `BaseLayout.astro` é o único dono de `<head>`/`<body>` para EN/PT/JA. O **404 não usa
`BaseLayout`** (`404.astro` importa `global.css` direto e renderiza o próprio documento), por isso
precisa do componente montado separadamente.

#### 2. Especificação Técnica

**2.1 Pontos de interceptação**
- `src/layouts/BaseLayout.astro`:
  - Frontmatter (`---`): `import Analytics from '@vercel/analytics/astro';`
  - No final do `<body>`, após `<slot />`: `<Analytics />`
- `src/pages/404.astro`:
  - Frontmatter (`---`): `import Analytics from '@vercel/analytics/astro';`
  - Antes do `</body>` do documento: `<Analytics />`

**2.2 CSP — verificação (não alterar)**
O componente: (a) emite um `<script>` Astro hoisted para módulo **same-origin** (`/_astro/*.js`)
→ `script-src 'self'`; (b) em runtime injeta `<script src="/_vercel/insights/script.js">` e faz
beacon para `/_vercel/insights/event`, ambos **same-origin** → cobertos por `script-src 'self'` e
`default-src 'self'`. **Nenhuma origem de terceiros** → `vercel.json` permanece intacto.

**2.3 Restrições negativas (TF)**
- NÃO adicionar script inline de analytics (quebraria a CSP, exigiria `'unsafe-inline'`/nonce).
- NÃO editar `vercel.json`.
- NÃO passar `beforeSend`/`framework` (não suportados pelo componente Astro).
- NÃO refatorar `404.astro` para usar `BaseLayout` (fora de escopo desta entrega).

#### 3. Orientação de Execução

**3.1 Contexto de entrada (ler antes)**
1. `src/layouts/BaseLayout.astro` — estrutura `<head>`/`<body>` e o `<slot />`.
2. `src/pages/404.astro` — estrutura própria do documento (onde fica o `</body>`).

**3.2 Passos**
1. Adicionar import + `<Analytics />` no `BaseLayout.astro`.
2. Adicionar import + `<Analytics />` no `404.astro`.
3. Build estático e build SSR para validar o root on-demand.

**3.3 Comandos de validação**
```bash
cd /Users/marco/Develop/scrapup/scrapup-site
npm run build && npm run check
# Páginas estáticas — devem conter o elemento:
grep -l "vercel-analytics" dist/pt/index.html dist/ja/index.html dist/404.html
# Root EN (on-demand) — validar via preview SSR (servido em :4321) ou pela TF-62-03 (e2e).
```

#### 4. Definition of Done
- [ ] `npm run build` e `npm run check` passam.
- [ ] `dist/pt/index.html`, `dist/ja/index.html` e `dist/404.html` contêm `<vercel-analytics>`.
- [ ] Root EN (`/`) renderiza `<vercel-analytics>` — verificado por `npm run preview` ou pela TF-62-03.
- [ ] `vercel.json` inalterado.
- [ ] (Pós-deploy, manual) com Web Analytics ativo, uma visita gera evento `/_vercel/insights/event` (status 200 no Network).

---

### [TF-62-03] [scrapup-site] Teste e2e de regressão da instrumentação

**User Story:** US-62 — Métricas de tráfego do scrapup.dev
**Sistema:** scrapup-site
**Prioridade:** P1

#### 1. Descrição e Objetivo

> **Eu como** mantenedor,
> **Eu quero** um teste Playwright que garanta `<vercel-analytics>` presente em todas as rotas,
> **Para que** uma remoção acidental do componente quebre o CI em vez de passar despercebida.

*Contexto:* a suite já roda via `npm run preview` e cobre `/`, `/pt/`, `/ja/` e o 404 (padrão de
`routes.spec.ts` e `a11y.spec.ts`). O novo teste segue o mesmo formato e o helper `support/prepare`.

#### 2. Especificação Técnica

**2.1 Pontos de interceptação**
- `tests/e2e/analytics.spec.ts` (novo) — para cada path em `['/', '/pt/', '/ja/', '/this-route-does-not-exist']`, asserir que existe **exatamente um** `vercel-analytics` no DOM.

**2.2 Esboço**
```ts
import { test, expect } from '@playwright/test';
import { prepare } from '../support/prepare';

for (const path of ['/', '/pt/', '/ja/', '/this-route-does-not-exist']) {
  test(`${path}: mounts the Vercel Analytics component`, async ({ page }) => {
    await prepare(page, path);
    await expect(page.locator('vercel-analytics')).toHaveCount(1);
  });
}
```

**2.3 Restrições negativas (TF)**
- NÃO asserir sucesso de rede de `/_vercel/insights/*` — inexistente em preview (Vercel-only); validar **apenas DOM**.
- NÃO usar `page.goto` cru para as rotas localizadas — usar `prepare` (mantém paridade com a suite).

#### 3. Orientação de Execução

**3.1 Contexto de entrada (ler antes)**
1. `tests/e2e/routes.spec.ts` e `tests/e2e/a11y.spec.ts` — padrão de iteração de paths.
2. `tests/support/prepare.ts` — contrato do helper.

**3.2 Comando de validação**
```bash
cd /Users/marco/Develop/scrapup/scrapup-site && npm run test:e2e -- analytics
```

#### 4. Definition of Done
- [ ] `tests/e2e/analytics.spec.ts` existe e cobre os 4 paths.
- [ ] `npm run test:e2e -- analytics` passa (4 casos verdes).
- [ ] Nenhuma assertiva de rede/console adicionada (só presença no DOM).

---

### [TF-62-04] [scrapup-site] Documentar a instrumentação e os pré-requisitos manuais

**User Story:** US-62 — Métricas de tráfego do scrapup.dev
**Sistema:** scrapup-site
**Prioridade:** P2

#### 1. Descrição e Objetivo

> **Eu como** mantenedor,
> **Eu quero** registrar a adoção do Vercel Web Analytics e os passos manuais de dashboard,
> **Para que** futuros mantenedores não reintroduzam Google Analytics nem a env órfã.

#### 2. Especificação Técnica

**2.1 Pontos de interceptação**
- `README.md` — adicionar **linha determinística** na tabela `## Stack` (linha 14):
  `| Analytics | Vercel Web Analytics (\`@vercel/analytics/astro\`, privacy-friendly, no cookies) |`.
- `CLAUDE.md` (do scrapup-site) — registrar: analytics = Vercel Web Analytics em `BaseLayout.astro` + `404.astro`; CSP intacta; 2 passos manuais de dashboard (ativar Web Analytics; remover `NEXT_PUBLIC_GA_ID`).

**2.2 Restrições negativas (TF)**
- NÃO documentar Google Analytics nem `NEXT_PUBLIC_GA_ID` como configuração suportada.
- NÃO duplicar conteúdo entre `CLAUDE.md` e `README.md` — apontar, não repetir.

#### 3. Definition of Done
- [ ] Tabela `## Stack` do `README.md` tem a linha de Analytics.
- [ ] `CLAUDE.md` descreve a instrumentação (BaseLayout + 404) e os 2 passos manuais.
- [ ] Nenhuma referência a `NEXT_PUBLIC_GA_ID` como config ativa do projeto.

---

## Sequenciamento

`TF-62-01` (dependência) → `TF-62-02` (componente em todas as páginas) → `TF-62-03` (teste de regressão) → `TF-62-04` (docs).

## Fora de escopo

- Custom events / `track()` — só page views automáticos nesta entrega.
- Speed Insights (`@vercel/speed-insights`) — produto separado, não solicitado.
- Refatorar `404.astro` para herdar `BaseLayout`.
- Google Analytics (GA4) e qualquer script de terceiros.
