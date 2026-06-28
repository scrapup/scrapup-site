/*
 * Build-time i18n parity check (RN-02 / RN-14).
 * EN is the canonical key set; PT and JA must mirror it exactly.
 * Exits non-zero, naming the missing/extra/empty keys per locale, on any mismatch.
 *
 * Runs on plain Node (no TS runtime) so it works identically on Node 20 (CI) and
 * Node 22 (local): it reads src/i18n/ui.ts as text and extracts the keys of each
 * locale block. Type-level parity is additionally enforced by `astro check`
 * through the `UiSchema` type in ui.ts — this script is the explicit, named guard.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const UI_PATH = fileURLToPath(new URL('../src/i18n/ui.ts', import.meta.url));
const DEFAULT_LOCALE = 'en';

/** Block delimiters per locale: capture everything between `const <x> ... = {` and the close. */
const BLOCKS = {
  en: { start: /const en = \{/, end: /\}\s*satisfies Record<string, string>;/ },
  pt: { start: /const pt: UiSchema = \{/, end: /^\};/m },
  ja: { start: /const ja: UiSchema = \{/, end: /^\};/m },
};

/** Extract `{ key: value }` pairs from a locale block of ui.ts. */
function extractEntries(source, { start, end }) {
  const from = source.search(start);
  if (from === -1) throw new Error(`Locale block start not found: ${start}`);
  const rest = source.slice(from);
  const to = rest.search(end);
  if (to === -1) throw new Error(`Locale block end not found: ${end}`);
  const block = rest.slice(0, to);

  const entries = new Map();
  // Key always begins a line as 'a.b.c': ; value (single- or double-quoted) follows.
  const re = /^\s*'([^']+)':\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")?/gm;
  let m;
  while ((m = re.exec(block)) !== null) {
    const key = m[1];
    const value = m[2] ?? m[3] ?? null; // null = value wrapped to the next line (non-empty)
    entries.set(key, value);
  }
  return entries;
}

const source = await readFile(UI_PATH, 'utf8');
const en = extractEntries(source, BLOCKS.en);
const reference = [...en.keys()].sort();
const refSet = new Set(reference);

let failed = false;

for (const locale of ['pt', 'ja']) {
  const entries = extractEntries(source, BLOCKS[locale]);
  const keys = new Set(entries.keys());
  const missing = reference.filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !refSet.has(k)).sort();
  const empty = [...entries].filter(([, v]) => v !== null && v.trim() === '').map(([k]) => k);

  if (missing.length || extra.length || empty.length) {
    failed = true;
    console.error(`\n✖ Locale "${locale}" is not in parity with "${DEFAULT_LOCALE}":`);
    if (missing.length) console.error(`  Missing keys (${missing.length}): ${missing.join(', ')}`);
    if (extra.length) console.error(`  Extra keys (${extra.length}): ${extra.join(', ')}`);
    if (empty.length) console.error(`  Empty values (${empty.length}): ${empty.join(', ')}`);
  } else {
    console.log(`✓ Locale "${locale}" mirrors "${DEFAULT_LOCALE}" (${reference.length} keys).`);
  }
}

if (failed) {
  console.error('\ni18n parity check failed.');
  process.exit(1);
}

console.log(`\ni18n parity OK — ${reference.length} keys across 3 locales.`);
