/*
 * Trilingual UI dictionary — single source of copy for the landing, manifesto + 404.
 * EN is the canonical key set (RN-02); `pt` and `ja` are typed to mirror it
 * exactly, and a build-time parity check (scripts/i18n-parity.mjs) enforces it.
 *
 * Copy extracted verbatim from the prototypes in design-project/. Consecrated
 * technical terms (spec, commit, milestone, gate, skill, agent, ...) are kept
 * as in the prototype and not translated.
 *
 * Strings whose key ends in `.html` carry inline markup (rendered with set:html);
 * they are static, author-controlled copy — not user input.
 */

const en = {
  // Top bar
  'nav.tagline': 'AI-assisted Unified Process',
  'nav.home': 'SCRAPUP',
  'nav.manifesto': 'MANIFESTO',

  // Hero
  'hero.badge': 'BETA · COMING SOON',
  'hero.eyebrow': 'PLUGIN FOR CLAUDE CODE — DOCUMENT → VALIDATE → DELIVER',
  'hero.headline.pre': 'From informational scrap to ',
  'hero.headline.em': 'forged',
  'hero.headline.post': ' delivery.',
  'hero.sub':
    'An ecosystem of skills, agents, and commands for Claude Code that operationalizes the document → validate → deliver cycle with engineering rigor — a modernized, AI-assisted Unified Process.',
  'hero.note.html':
    'The developer moves from <strong>executor</strong> to <strong>architect and validator</strong> — agents run the engineering workflows; the human decides and seals.',
  'hero.ctaStar': 'STAR ON GITHUB',
  'hero.ctaDocs': 'READ THE DOCS ↗',

  // 01 — The problem
  'problem.label': '// 01 — THE PROBLEM',
  'problem.title': "AI is fast. Left unsupervised, it's fragile.",
  'problem.body':
    'Iterating with AI and no human in the loop degrades security and reliability — and spec scaffolding alone does not guarantee the agent follows it.',
  'problem.stat1.desc':
    'critical vulnerabilities after five AI refinement iterations — "feedback-loop security degradation."',
  'problem.stat2.desc':
    'samples analyzed — AI-generated code carries more high-risk vulnerabilities than human-written code.',
  'problem.card3.title': "Scaffolding alone isn't enough.",
  'problem.card3.desc':
    'Even with templates and checklists, agents skip instructions. Independent verification is required.',

  // 02 — The answer
  'answer.label': '// 02 — THE ANSWER',
  'answer.title': 'Agents execute. Humans seal the gates.',
  'answer.body':
    'scrapup turns AI from a fast-and-fragile code generator into a governed engineering process — a traceable, auditable contract from intent to production.',
  'answer.step1.desc': 'Every feature derives from a versioned spec, not a loose prompt.',
  'answer.step2.desc': 'Multi-lens review — quality, security, architecture — before concluding.',
  'answer.step3.desc': 'Nothing is done without observable, evidence-backed verification.',

  // 03 — How it works
  'how.label': '// 03 — HOW IT WORKS',
  'how.title': 'The four-phase spine.',
  'how.body':
    'Each phase closes at a milestone a human Validator seals. Construction shrinks; judgment migrates to Inception and Elaboration.',
  'how.axisLabel': 'LIFECYCLE — MILESTONE GATES',
  'how.lco.name': 'Inception',
  'how.lco.desc': 'Scope, actors, candidate architecture, critical risks.',
  'how.lca.name': 'Elaboration',
  'how.lca.desc': 'Executable architectural baseline; risks mitigated.',
  'how.ioc.now': 'NOW · BETA',
  'how.ioc.name': 'Construction',
  'how.ioc.desc': 'First public release — ready for beta in your environment.',
  'how.release.name': 'Transition',
  'how.release.desc': 'Running in production; verified by telemetry.',

  // 03b — Two roles
  'roles.r1.kicker': 'RETAINED HUMAN ROLE · 01',
  'roles.r1.name': 'The Architect',
  'roles.r1.desc':
    'Owns architecture-centric decisions: defines and validates the architecture, approves the executable baseline, fixes constraints.',
  'roles.r2.kicker': 'RETAINED HUMAN ROLE · 02',
  'roles.r2.name': 'The Validator',
  'roles.r2.desc':
    'Owns quality and verification: adjudicates the review lenses, decides risk ordering, seals each milestone.',
  'roles.seal.html':
    'The AI proposes and verifies. <span style="color:var(--neon);">The human decides and seals.</span>',

  // 04 — Four pillars
  'pillars.label': '// 04 — FOUR PILLARS',
  'pillars.title': 'What scrapup gives you.',
  'pillars.p1.title': 'Traceable & auditable, end-to-end',
  'pillars.p1.desc':
    'Intent → spec → code → test → commit → release. Features derive from versioned specs (SDD).',
  'pillars.p2.title': 'Human-sealed milestone gates',
  'pillars.p2.desc': 'Risk-driven LCO → LCA → IOC → Release. Nothing advances without sign-off.',
  'pillars.p3.title': 'Multi-lens validation',
  'pillars.p3.desc':
    'Independent review from multiple perspectives before anything is "done." Evidence required.',
  'pillars.p4.title': 'Open & extensible by default',
  'pillars.p4.desc': 'Git, MCP, PlantUML, markdown — no proprietary lock-in.',

  // 05 — Why it's different
  'diff.label': "// 05 — WHY IT'S DIFFERENT",
  'diff.title': 'Spec-as-contract is the floor.',
  'diff.body':
    'GitHub Spec Kit, Amazon Kiro, Superpowers, Tessl — all converge on spec-as-contract. The real question is no longer which model writes better code, but which process maintains context, traceability, and control.',
  'diff.floor.label': 'THE FLOOR — WHAT PEERS DO',
  'diff.floor.desc':
    'Spec-as-contract. Without a classical engineering foundation, frameworks just institutionalize vibe coding under new terminology.',
  'diff.edge.label': "SCRAPUP'S EDGE",
  'diff.edge.desc':
    'The control the evidence demands — human-sealed, risk-driven milestone gates plus multi-lens validation, anchored in the Unified Process.',

  // 06 — Built on the Unified Process
  'up.label': '// 06 — BUILT ON THE UNIFIED PROCESS',
  'up.title': 'Classical engineering, applied to a new medium.',
  'up.body':
    'The Unified Process (Jacobson, Booch, Rumbaugh, 1999) supplies a foundation no competitor explicitly claims. Its pillars stay immutable — only who does the work changes.',
  'up.note': 'Workers become dispatchable agents — canonical UP tailoring, not a rupture.',

  // 07 — Open & extensible
  'open.label': '// 07 — OPEN & EXTENSIBLE',
  'open.title': 'No lock-in. Three axes of extension.',
  'open.axis1.title': 'Composable pieces',
  'open.axis1.desc': 'Skills, agents, and review lenses you can add, swap, or remove.',
  'open.axis2.title': 'Tailorable process',
  'open.axis2.desc': 'Lean increment → full flow. Ceremony scales to risk, never bureaucracy.',
  'open.axis3.title': 'Open integrations',
  'open.axis3.desc': 'Built on the open stack — no closed proprietary UI in the way.',

  // 08 — Status
  'status.label': '// 08 — STATUS',
  'status.title': 'Beta — and honest about it.',
  'status.shipped.label': '● SHIPPED NOW',
  'status.shipped.1': 'Solo-usable Beta',
  'status.shipped.2': 'Multi-lens review',
  'status.shipped.3': 'Lean increment flow',
  'status.shipped.4': 'Open tooling (Git / MCP / markdown)',
  'status.roadmap.label': '○ ON THE ROADMAP',
  'status.roadmap.1': 'Team-scale governance',
  'status.roadmap.2': 'Sealed LCA gate · risk-ordered iterations',
  'status.roadmap.3': 'Traceability matrix',
  'status.roadmap.4': 'Transition via telemetry',

  // 09 — Final CTA (waitlist dropped; Follow the build card only)
  'cta.label': '// 09 — FOLLOW THE BUILD',
  'cta.title': 'Forge with us.',
  'cta.body':
    'scrapup is solo-usable Beta today. Star the repo to follow the build from Beta to Release, or read the docs to see the process in full.',
  'cta.card.title': 'Follow the build.',
  'cta.card.desc':
    'Open-source, MIT-licensed. Star the repo to track each milestone, or read the docs to see the process in full.',
  'cta.card.star': 'STAR ON GITHUB',
  'cta.card.docs': 'READ THE DOCS ↗',

  // Meta / SEO
  'meta.title': 'scrapup — AI-assisted Unified Process for engineering teams',
  'meta.description':
    'A traceable, auditable AI-assisted software process, end-to-end — from informational scrap to forged, auditable delivery. An ecosystem of skills, agents and commands for Claude Code.',

  // Manifesto page (/manifesto/)
  'manifesto.meta.title': 'The scrapup Manifesto — from scrap to forged, trusted delivery',
  'manifesto.meta.description':
    'What scrapup believes, values, commits to and refuses: trust requires human judgment, agents execute but never govern, and four named decisions carry an idea to production.',
  'manifesto.title.html': 'The <span>scrapup</span> Manifesto',
  'manifesto.tagline.html': 'From scrap to forged, trusted delivery.',
  'manifesto.preamble.label': '// 01 — PREAMBLE',
  'manifesto.preamble.body':
    'We have seen well-specified work set its builders free: given clear use cases, sequences, and models, people far from the original idea built it faithfully and on their own. Today, AI makes building cheap — but not yet trustworthy. AI will not end our craft; it amplifies it. What it amplifies depends on where we put our human effort. We put it where judgment lives.',
  'manifesto.believe.label': '// 02 — WE BELIEVE',
  'manifesto.believe.1': 'Trust requires judgment, and judgment is human.',
  'manifesto.believe.2': 'Agents execute; they never govern.',
  'manifesto.believe.3': 'The specification is the asset, not the model.',
  'manifesto.believe.4': 'Software is a whole cycle',
  'manifesto.believe.4.rest': ' — from the first idea to the product working in production.',
  'manifesto.believe.5': 'A decision without a name cannot be audited.',
  'manifesto.believe.6': 'People lead',
  'manifesto.believe.6.rest': ' — product, architecture, validation, delivery.',
  'manifesto.value.label': '// 03 — WE VALUE',
  'manifesto.value.1.em': 'Trust',
  'manifesto.value.1.rest': ' over speed.',
  'manifesto.value.2.em': 'Evidence',
  'manifesto.value.2.rest': ' over declaration.',
  'manifesto.value.note':
    'That is, while there is value in the items on the right, we value the items on the left more.',
  'manifesto.spine.label': '// 04 — THE SPINE',
  'manifesto.spine.lede': 'Four named decisions carry an idea to production:',
  'manifesto.spine.lco': 'we know why we build and what is worth building.',
  'manifesto.spine.lca': 'the architecture is proven, not drawn.',
  'manifesto.spine.ioc': 'what was specified is built, and evidence proves it.',
  'manifesto.spine.release': 'it works where it matters: in the hands of its users.',
  'manifesto.commit.label': '// 05 — WE COMMIT',
  'manifesto.commit.title': 'What you specify is what you get.',
  'manifesto.commit.body': 'What is specified is built; what is built was specified.',
  'manifesto.refuse.label': '// 06 — WE REFUSE',
  'manifesto.refuse.body':
    'We refuse to replace the people of product and engineering. scrapup is a tool, as a hammer is a tool — only as good as the hand and the judgment that hold it.',
  'manifesto.sign.label': '// 07 — SIGNATORIES',
  'manifesto.sign.body':
    'To co-sign, open a pull request that adds your own name to this list. The commit is your signature.',
  'manifesto.sign.note':
    'Signatures are public and permanent in the git history and in published releases; use your GitHub noreply e-mail if you prefer not to expose your address. To withdraw, open an issue or pull request: your name is removed from future versions.',
  'manifesto.sign.cta': 'CO-SIGN ON GITHUB ↗',
  'manifesto.back': '← BACK TO SCRAPUP',

  // 404
  'notFound.status': 'HTTP 404 · NO GATE SEALED',
  'notFound.title': 'This route never reached a milestone.',
  'notFound.body':
    "The page you requested isn't part of the traced delivery. Check the path, or head back to the baseline.",
  'notFound.back': 'BACK HOME',
  'notFound.github': 'VIEW ON GITHUB ↗',
} satisfies Record<string, string>;

/** The canonical key set: every locale must provide exactly these keys. */
type UiSchema = Record<keyof typeof en, string>;

const pt: UiSchema = {
  'nav.tagline': 'Processo Unificado assistido por IA',
  'nav.home': 'SCRAPUP',
  'nav.manifesto': 'MANIFESTO',

  'hero.badge': 'BETA · EM BREVE',
  'hero.eyebrow': 'PLUGIN PARA O CLAUDE CODE — DOCUMENT → VALIDATE → DELIVER',
  'hero.headline.pre': 'Do scrap informacional à entrega ',
  'hero.headline.em': 'forjada',
  'hero.headline.post': '.',
  'hero.sub':
    'Um ecossistema de skills, agents e commands para o Claude Code que operacionaliza o ciclo document → validate → deliver com rigor de engenharia — um Processo Unificado modernizado e assistido por IA.',
  'hero.note.html':
    'O desenvolvedor passa de <strong>executor</strong> a <strong>arquiteto e validador</strong> — os agents executam os workflows de engenharia; o humano decide e sela.',
  'hero.ctaStar': 'STAR NO GITHUB',
  'hero.ctaDocs': 'LER A DOCUMENTAÇÃO ↗',

  'problem.label': '// 01 — O PROBLEMA',
  'problem.title': 'A IA é rápida. Sem supervisão, é frágil.',
  'problem.body':
    'Iterar com IA sem um humano no loop degrada segurança e confiabilidade — e o scaffolding de spec sozinho não garante que o agent o siga.',
  'problem.stat1.desc':
    'vulnerabilidades críticas após cinco iterações de refino por IA — "degradação de segurança em feedback loop".',
  'problem.stat2.desc':
    'amostras analisadas — código gerado por IA carrega mais vulnerabilidades de alto risco que código humano.',
  'problem.card3.title': 'Scaffolding sozinho não basta.',
  'problem.card3.desc':
    'Mesmo com templates e checklists, agents pulam instruções. Verificação independente é obrigatória.',

  'answer.label': '// 02 — A RESPOSTA',
  'answer.title': 'Agents executam. Humanos selam os gates.',
  'answer.body':
    'O scrapup transforma a IA de gerador de código rápido-e-frágil em um processo de engenharia governado — um contrato rastreável e auditável da intenção à produção.',
  'answer.step1.desc': 'Cada feature deriva de um spec versionado, não de um prompt solto.',
  'answer.step2.desc':
    'Revisão multi-lente — qualidade, segurança, arquitetura — antes de concluir.',
  'answer.step3.desc': 'Nada é done sem verificação observável e baseada em evidência.',

  'how.label': '// 03 — COMO FUNCIONA',
  'how.title': 'A espinha de quatro fases.',
  'how.body':
    'Cada fase fecha em um milestone que um Validador humano sela. A Construção encolhe; o julgamento migra para Concepção e Elaboração.',
  'how.axisLabel': 'CICLO DE VIDA — GATES DE MILESTONE',
  'how.lco.name': 'Concepção',
  'how.lco.desc': 'Escopo, atores, arquitetura candidata, riscos críticos.',
  'how.lca.name': 'Elaboração',
  'how.lca.desc': 'Baseline arquitetural executável; riscos mitigados.',
  'how.ioc.now': 'NOW · BETA',
  'how.ioc.name': 'Construção',
  'how.ioc.desc': 'Primeiro release público — pronto para beta no seu ambiente.',
  'how.release.name': 'Transição',
  'how.release.desc': 'Em produção; verificado por telemetria.',

  'roles.r1.kicker': 'RETAINED HUMAN ROLE · 01',
  'roles.r1.name': 'O Arquiteto',
  'roles.r1.desc':
    'Dono das decisões architecture-centric: define e valida a arquitetura, aprova o baseline executável, fixa as restrições.',
  'roles.r2.kicker': 'RETAINED HUMAN ROLE · 02',
  'roles.r2.name': 'O Validador',
  'roles.r2.desc':
    'Dono da qualidade e verificação: adjudica as lentes de revisão, decide a ordem de risco, sela cada milestone.',
  'roles.seal.html':
    'A IA propõe e verifica. <span style="color:var(--neon);">O humano decide e sela.</span>',

  'pillars.label': '// 04 — QUATRO PILARES',
  'pillars.title': 'O que o scrapup entrega.',
  'pillars.p1.title': 'Rastreável e auditável, ponta a ponta',
  'pillars.p1.desc':
    'Intenção → spec → código → test → commit → release. Features derivam de specs versionados (SDD).',
  'pillars.p2.title': 'Gates de milestone selados por humano',
  'pillars.p2.desc': 'LCO → LCA → IOC → Release orientados a risco. Nada avança sem aprovação.',
  'pillars.p3.title': 'Validação multi-lente',
  'pillars.p3.desc':
    'Revisão independente de múltiplas perspectivas antes de qualquer "done". Evidência obrigatória.',
  'pillars.p4.title': 'Aberto e extensível por padrão',
  'pillars.p4.desc': 'Git, MCP, PlantUML, markdown — sem lock-in proprietário.',

  'diff.label': '// 05 — POR QUE É DIFERENTE',
  'diff.title': 'Spec-as-contract é o piso.',
  'diff.body':
    'GitHub Spec Kit, Amazon Kiro, Superpowers, Tessl — todos convergem em spec-as-contract. A pergunta real não é mais qual modelo escreve melhor código, mas qual processo mantém contexto, rastreabilidade e controle.',
  'diff.floor.label': 'O PISO — O QUE OS PARES FAZEM',
  'diff.floor.desc':
    'Spec-as-contract. Sem fundação de engenharia clássica, frameworks só institucionalizam vibe coding com terminologia nova.',
  'diff.edge.label': 'O DIFERENCIAL DO SCRAPUP',
  'diff.edge.desc':
    'O controle que a evidência exige — gates de milestone selados por humano e orientados a risco, somados à validação multi-lente, ancorados no Processo Unificado.',

  'up.label': '// 06 — CONSTRUÍDO SOBRE O PROCESSO UNIFICADO',
  'up.title': 'Engenharia clássica, aplicada a um novo meio.',
  'up.body':
    'O Processo Unificado (Jacobson, Booch, Rumbaugh, 1999) fornece uma fundação que nenhum concorrente reivindica explicitamente. Seus pilares permanecem imutáveis — só muda quem faz o trabalho.',
  'up.note': 'Os workers viram agents despacháveis — tailoring canônico do UP, não uma ruptura.',

  'open.label': '// 07 — ABERTO E EXTENSÍVEL',
  'open.title': 'Sem lock-in. Três eixos de extensão.',
  'open.axis1.title': 'Peças componíveis',
  'open.axis1.desc': 'Skills, agents e lentes de revisão que você adiciona, troca ou remove.',
  'open.axis2.title': 'Processo ajustável',
  'open.axis2.desc':
    'Incremento enxuto → fluxo completo. A cerimônia escala com o risco, nunca burocracia.',
  'open.axis3.title': 'Integrações abertas',
  'open.axis3.desc': 'Sobre a stack aberta — nenhuma UI proprietária fechada no caminho.',

  'status.label': '// 08 — STATUS',
  'status.title': 'Beta — e honesto quanto a isso.',
  'status.shipped.label': '● JÁ DISPONÍVEL',
  'status.shipped.1': 'Beta usável solo',
  'status.shipped.2': 'Revisão multi-lente',
  'status.shipped.3': 'Fluxo de incremento enxuto',
  'status.shipped.4': 'Tooling aberto (Git / MCP / markdown)',
  'status.roadmap.label': '○ NO ROADMAP',
  'status.roadmap.1': 'Governança em escala de time',
  'status.roadmap.2': 'Gate LCA selado · iterações ordenadas por risco',
  'status.roadmap.3': 'Matriz de rastreabilidade',
  'status.roadmap.4': 'Transição via telemetria',

  'cta.label': '// 09 — ACOMPANHE A CONSTRUÇÃO',
  'cta.title': 'Forje com a gente.',
  'cta.body':
    'O scrapup é Beta usável solo hoje. Dê star no repo para acompanhar de Beta a Release, ou leia a documentação para ver o processo completo.',
  'cta.card.title': 'Acompanhe a construção.',
  'cta.card.desc':
    'Open-source, licença MIT. Dê star no repo para acompanhar cada milestone, ou leia a documentação para ver o processo completo.',
  'cta.card.star': 'STAR NO GITHUB',
  'cta.card.docs': 'DOCUMENTAÇÃO ↗',

  'meta.title': 'scrapup — Processo Unificado assistido por IA para times de engenharia',
  'meta.description':
    'Um processo de software assistido por IA, rastreável e auditável, de ponta a ponta — do scrap informacional à entrega forjada e auditável. Um ecossistema de skills, agents e commands para o Claude Code.',

  // Manifesto page (/manifesto/)
  'manifesto.meta.title': 'Manifesto do scrapup — do scrap à entrega forjada e confiável',
  'manifesto.meta.description':
    'No que o scrapup acredita, o que valoriza, com o que se compromete e o que recusa: confiança exige julgamento humano, agentes executam mas nunca governam, e quatro decisões nomeadas levam uma ideia até a produção.',
  'manifesto.title.html': 'Manifesto do <span>scrapup</span>',
  'manifesto.tagline.html': 'Do <em>scrap</em> à entrega forjada e confiável.',
  'manifesto.preamble.label': '// 01 — PREÂMBULO',
  'manifesto.preamble.body':
    'Nós já vimos um trabalho bem especificado libertar quem o constrói: diante de casos de uso, sequências e modelos claros, pessoas distantes da ideia original o construíram com fidelidade e por conta própria. Hoje, a IA torna construir barato — mas ainda não confiável. A IA não vai acabar com o nosso ofício; ela o amplifica. O que ela amplifica depende de onde colocamos o nosso esforço humano. Nós o colocamos onde vive o julgamento.',
  'manifesto.believe.label': '// 02 — NÓS ACREDITAMOS',
  'manifesto.believe.1': 'Confiança exige julgamento, e o julgamento é humano.',
  'manifesto.believe.2': 'Agentes executam; nunca governam.',
  'manifesto.believe.3': 'A especificação é o ativo, não o modelo.',
  'manifesto.believe.4': 'Software é um ciclo inteiro',
  'manifesto.believe.4.rest': ' — da primeira ideia ao produto funcionando em produção.',
  'manifesto.believe.5': 'Uma decisão sem nome não pode ser auditada.',
  'manifesto.believe.6': 'Pessoas lideram',
  'manifesto.believe.6.rest': ' — produto, arquitetura, validação, entrega.',
  'manifesto.value.label': '// 03 — NÓS VALORIZAMOS',
  'manifesto.value.1.em': 'Confiança',
  'manifesto.value.1.rest': ' acima de velocidade.',
  'manifesto.value.2.em': 'Evidência',
  'manifesto.value.2.rest': ' acima de declaração.',
  'manifesto.value.note':
    'Ou seja, mesmo havendo valor nos itens à direita, nós valorizamos mais os itens à esquerda.',
  'manifesto.spine.label': '// 04 — A ESPINHA',
  'manifesto.spine.lede': 'Quatro decisões nomeadas levam uma ideia até a produção:',
  'manifesto.spine.lco': 'sabemos por que construímos e o que vale a pena construir.',
  'manifesto.spine.lca': 'a arquitetura é comprovada, não desenhada.',
  'manifesto.spine.ioc': 'o que foi especificado está construído, e a evidência o comprova.',
  'manifesto.spine.release': 'funciona onde importa: nas mãos de quem o usa.',
  'manifesto.commit.label': '// 05 — NÓS NOS COMPROMETEMOS',
  'manifesto.commit.title': 'O que você especifica é o que você recebe.',
  'manifesto.commit.body':
    'O que é especificado é construído; o que é construído foi especificado.',
  'manifesto.refuse.label': '// 06 — NÓS RECUSAMOS',
  'manifesto.refuse.body':
    'Recusamos substituir as pessoas de produto e de engenharia. O scrapup é uma ferramenta, assim como um martelo é uma ferramenta — tão bom quanto a mão e o julgamento que o empunham.',
  'manifesto.sign.label': '// 07 — SIGNATÁRIOS',
  'manifesto.sign.body':
    'Para assinar junto, abra um pull request que adicione o seu próprio nome a esta lista. O commit é a sua assinatura.',
  'manifesto.sign.note':
    'As assinaturas são públicas e permanentes no histórico do git e nas releases publicadas; use o e-mail noreply do GitHub se preferir não expor o seu endereço. Para retirar a assinatura, abra uma issue ou um pull request: o seu nome é removido das versões futuras.',
  'manifesto.sign.cta': 'ASSINAR NO GITHUB ↗',
  'manifesto.back': '← VOLTAR AO SCRAPUP',

  'notFound.status': 'HTTP 404 · NENHUM GATE SELADO',
  'notFound.title': 'Esta rota nunca alcançou um milestone.',
  'notFound.body':
    'A página que você pediu não faz parte da entrega rastreada. Confira o caminho, ou volte para a baseline.',
  'notFound.back': 'VOLTAR AO INÍCIO',
  'notFound.github': 'VER NO GITHUB ↗',
};

const ja: UiSchema = {
  'nav.tagline': 'AI支援の Unified Process',
  'nav.home': 'SCRAPUP',
  'nav.manifesto': 'MANIFESTO',

  'hero.badge': 'ベータ · 近日公開',
  'hero.eyebrow': 'CLAUDE CODE 用プラグイン — DOCUMENT → VALIDATE → DELIVER',
  'hero.headline.pre': '情報の scrap から、',
  'hero.headline.em': '鍛造された',
  'hero.headline.post': 'デリバリーへ。',
  'hero.sub':
    'Claude Code 向けの skill・agent・command のエコシステム。document → validate → deliver のサイクルをエンジニアリングの厳密さで運用する — 近代化された、AI支援の Unified Process。',
  'hero.note.html':
    '開発者は <strong>実行者</strong> から <strong>アーキテクト兼バリデーター</strong> へ — agent がエンジニアリングの workflow を実行し、人間が判断して封印する。',
  'hero.ctaStar': 'GITHUB でスター',
  'hero.ctaDocs': 'ドキュメントを読む ↗',

  'problem.label': '// 01 — 課題',
  'problem.title': 'AIは速い。監督がなければ脆い。',
  'problem.body':
    '人間不在でAIを反復すると、セキュリティと信頼性が劣化する — spec のスキャフォールディングだけでは agent がそれに従う保証はない。',
  'problem.stat1.desc':
    'AIによる5回の改善反復後の重大な脆弱性 — 「フィードバックループのセキュリティ劣化」。',
  'problem.stat2.desc':
    '分析されたサンプル — AI生成コードは人間が書いたコードより高リスクの脆弱性を多く含む。',
  'problem.card3.title': 'スキャフォールディングだけでは不十分。',
  'problem.card3.desc':
    'テンプレートやチェックリストがあっても agent は指示を飛ばす。独立した検証が必須。',

  'answer.label': '// 02 — 解決策',
  'answer.title': 'Agent が実行し、人間が gate を封印する。',
  'answer.body':
    'scrapup は、速くて脆いコード生成器だったAIを、統制されたエンジニアリング・プロセスへ変える — 意図から本番まで、追跡可能で監査可能な契約。',
  'answer.step1.desc':
    '各 feature はバージョン管理された spec から導かれる。場当たり的な prompt ではない。',
  'answer.step2.desc': 'マルチレンズのレビュー — 品質・セキュリティ・アーキテクチャ — 結論の前に。',
  'answer.step3.desc': '観測可能で証拠に基づく検証なしに done はない。',

  'how.label': '// 03 — 仕組み',
  'how.title': '4フェーズの背骨。',
  'how.body':
    '各フェーズは、人間の Validator が封印する milestone で閉じる。Construction は縮小し、判断が Inception と Elaboration へ移る。',
  'how.axisLabel': 'ライフサイクル — マイルストーン・ゲート',
  'how.lco.name': '方向付け',
  'how.lco.desc': 'スコープ、アクター、候補アーキテクチャ、重大リスク。',
  'how.lca.name': '推敲',
  'how.lca.desc': '実行可能なアーキテクチャ baseline。リスクは低減済み。',
  'how.ioc.now': 'NOW · BETA',
  'how.ioc.name': '作成',
  'how.ioc.desc': '最初の公開リリース — あなたの環境でベータ可能。',
  'how.release.name': '移行',
  'how.release.desc': '本番で稼働。テレメトリで検証。',

  'roles.r1.kicker': 'RETAINED HUMAN ROLE · 01',
  'roles.r1.name': 'アーキテクト',
  'roles.r1.desc':
    'アーキテクチャ中心の意思決定を担う。アーキテクチャを定義・検証し、実行可能な baseline を承認し、制約を固定する。',
  'roles.r2.kicker': 'RETAINED HUMAN ROLE · 02',
  'roles.r2.name': 'バリデーター',
  'roles.r2.desc':
    '品質と検証を担う。レビューのレンズを裁定し、リスクの順序を決め、各 milestone を封印する。',
  'roles.seal.html':
    'AI が提案し検証する。<span style="color:var(--neon);">人間が決定し封印する。</span>',

  'pillars.label': '// 04 — 4本の柱',
  'pillars.title': 'scrapup が提供するもの。',
  'pillars.p1.title': '追跡可能・監査可能、エンドツーエンド',
  'pillars.p1.desc':
    '意図 → spec → コード → test → commit → release。Feature はバージョン管理された spec（SDD）から導かれる。',
  'pillars.p2.title': '人間が封印する milestone gate',
  'pillars.p2.desc': 'リスク駆動の LCO → LCA → IOC → Release。承認なしに前進しない。',
  'pillars.p3.title': 'マルチレンズ検証',
  'pillars.p3.desc': 'あらゆる「done」の前に、複数視点からの独立レビュー。証拠が必須。',
  'pillars.p4.title': 'デフォルトで開かれ、拡張可能',
  'pillars.p4.desc': 'Git、MCP、PlantUML、markdown — プロプライエタリなロックインなし。',

  'diff.label': '// 05 — 何が違うか',
  'diff.title': 'Spec-as-contract は最低ライン。',
  'diff.body':
    'GitHub Spec Kit、Amazon Kiro、Superpowers、Tessl — すべて spec-as-contract に収束する。真の問いは、どのモデルが良いコードを書くかではなく、どのプロセスが文脈・追跡可能性・統制を保つか。',
  'diff.floor.label': '最低ライン — 競合がやること',
  'diff.floor.desc':
    'Spec-as-contract。古典的なエンジニアリングの土台がなければ、フレームワークは新しい用語で vibe coding を制度化するだけ。',
  'diff.edge.label': 'SCRAPUP の強み',
  'diff.edge.desc':
    '証拠が要求する統制 — 人間が封印しリスク駆動の milestone gate に、マルチレンズ検証を重ね、Unified Process に根ざす。',

  'up.label': '// 06 — UNIFIED PROCESS の上に',
  'up.title': '古典的エンジニアリングを、新しい媒体へ。',
  'up.body':
    'Unified Process（Jacobson, Booch, Rumbaugh, 1999）は、どの競合も明示的に主張しない土台を与える。その柱は不変のまま — 変わるのは「誰が作業するか」だけ。',
  'up.note': 'worker は派遣可能な agent になる — UP の正統な tailoring であり、断絶ではない。',

  'open.label': '// 07 — 開かれ、拡張可能',
  'open.title': 'ロックインなし。拡張の3つの軸。',
  'open.axis1.title': '組み合わせ可能な部品',
  'open.axis1.desc': '追加・交換・削除できる skill、agent、レビューのレンズ。',
  'open.axis2.title': '調整可能なプロセス',
  'open.axis2.desc':
    'リーンな増分 → フルフロー。儀式はリスクに応じて拡大し、官僚主義にはならない。',
  'open.axis3.title': '開かれた統合',
  'open.axis3.desc': '開かれたスタックの上に — 閉じたプロプライエタリ UI は介在しない。',

  'status.label': '// 08 — ステータス',
  'status.title': 'ベータ — そしてそれに正直。',
  'status.shipped.label': '● 提供中',
  'status.shipped.1': 'ソロで使えるベータ',
  'status.shipped.2': 'マルチレンズ・レビュー',
  'status.shipped.3': 'リーン増分フロー',
  'status.shipped.4': '開かれたツール（Git / MCP / markdown）',
  'status.roadmap.label': '○ ロードマップ',
  'status.roadmap.1': 'チーム規模のガバナンス',
  'status.roadmap.2': '封印された LCA gate · リスク順の反復',
  'status.roadmap.3': 'トレーサビリティ・マトリクス',
  'status.roadmap.4': 'テレメトリによる移行',

  'cta.label': '// 09 — 構築を追う',
  'cta.title': '一緒に鍛えよう。',
  'cta.body':
    'scrapup は現在ソロで使えるベータ。repo にスターを付けて Beta から Release まで追うか、ドキュメントを読んでプロセス全体を確認してください。',
  'cta.card.title': '構築を追う。',
  'cta.card.desc':
    'オープンソース、MITライセンス。各 milestone を追うなら repo にスター、プロセス全体を見るならドキュメントを。',
  'cta.card.star': 'GITHUB でスター',
  'cta.card.docs': 'ドキュメント ↗',

  'meta.title': 'scrapup — エンジニアリングチームのための AI 支援 Unified Process',
  'meta.description':
    '追跡可能で監査可能な、AI 支援のソフトウェア・プロセスをエンドツーエンドで。情報の scrap から、鍛造され監査可能な delivery へ。Claude Code 向けの skill・agent・command のエコシステム。',

  // Manifesto page (/manifesto/)
  'manifesto.meta.title': 'scrapup マニフェスト — scrap から、鍛え上げられた信頼できるデリバリーへ',
  'manifesto.meta.description':
    'scrapup が信じること、重んじること、約束すること、拒むこと。信頼には人間の判断が必要であり、エージェントは実行するが統治はしない。名前を持つ四つの決定が、アイデアを本番環境へと運ぶ。',
  'manifesto.title.html': '<span>scrapup</span> マニフェスト',
  'manifesto.tagline.html': '<em>scrap</em> から、鍛え上げられた信頼できるデリバリーへ。',
  'manifesto.preamble.label': '// 01 — 前文',
  'manifesto.preamble.body':
    '私たちは、よく仕様化された仕事が作り手を自由にするのを見てきた。明確なユースケース、シーケンス、モデルがあれば、元のアイデアから遠く離れた人々でも、それを忠実に、自らの力で作り上げた。今日、AI は作ることを安価にした — しかし、まだ信頼できるものにはしていない。AI は私たちの技を終わらせない。それを増幅する。何が増幅されるかは、私たちが人間の努力をどこに注ぐかにかかっている。私たちは、判断が宿る場所にそれを注ぐ。',
  'manifesto.believe.label': '// 02 — 私たちは信じる',
  'manifesto.believe.1': '信頼には判断が必要であり、判断は人間のものである。',
  'manifesto.believe.2': 'エージェントは実行する。決して統治はしない。',
  'manifesto.believe.3': '資産は仕様であり、モデルではない。',
  'manifesto.believe.4': 'ソフトウェアはひとつの完全なサイクルである',
  'manifesto.believe.4.rest': ' — 最初のアイデアから、本番環境で動くプロダクトまで。',
  'manifesto.believe.5': '名前のない決定は監査できない。',
  'manifesto.believe.6': '人が導く',
  'manifesto.believe.6.rest': ' — プロダクト、アーキテクチャ、検証、デリバリー。',
  'manifesto.value.label': '// 03 — 私たちが重んじるもの',
  'manifesto.value.1.em': '信頼',
  'manifesto.value.1.rest': 'を、速さよりも。',
  'manifesto.value.2.em': '証拠',
  'manifesto.value.2.rest': 'を、宣言よりも。',
  'manifesto.value.note': 'すなわち、右側の項目にも価値はあるが、私たちは左側の項目により大きな価値を置く。',
  'manifesto.spine.label': '// 04 — 背骨',
  'manifesto.spine.lede': '名前を持つ四つの決定が、アイデアを本番環境へと運ぶ。',
  'manifesto.spine.lco': 'なぜ作るのか、何が作るに値するのかを私たちは知っている。',
  'manifesto.spine.lca': 'アーキテクチャは描かれるのではなく、実証される。',
  'manifesto.spine.ioc': '仕様化されたものが作られ、証拠がそれを証明する。',
  'manifesto.spine.release': '大切な場所で動く。それを使う人々の手の中で。',
  'manifesto.commit.label': '// 05 — 私たちのコミットメント',
  'manifesto.commit.title': '仕様にしたものが、手に入るもの。',
  'manifesto.commit.body': '仕様化されたものは作られ、作られたものは仕様化されていた。',
  'manifesto.refuse.label': '// 06 — 私たちが拒むもの',
  'manifesto.refuse.body':
    '私たちは、プロダクトとエンジニアリングの人々を置き換えることを拒む。scrapup は道具である。ハンマーが道具であるように — それを握る手と判断の良さを超えることはない。',
  'manifesto.sign.label': '// 07 — 署名者',
  'manifesto.sign.body': '共同署名するには、このリストにあなた自身の名前を加える pull request を開いてほしい。その commit があなたの署名となる。',
  'manifesto.sign.note':
    '署名は公開され、git の履歴と公開済みの release に永続的に残る。メールアドレスを公開したくない場合は、GitHub の noreply メールを使ってほしい。署名を取り下げるには issue または pull request を開いてほしい。以後のバージョンから名前を削除する。',
  'manifesto.sign.cta': 'GITHUB で署名 ↗',
  'manifesto.back': '← SCRAPUP に戻る',

  'notFound.status': 'HTTP 404 · 封印された GATE なし',
  'notFound.title': 'このルートは milestone に到達しませんでした。',
  'notFound.body':
    'リクエストされたページは、追跡された delivery に含まれていません。パスを確認するか、baseline へ戻ってください。',
  'notFound.back': 'ホームへ戻る',
  'notFound.github': 'GITHUB を見る ↗',
};

export const ui = { en, pt, ja } as const;
