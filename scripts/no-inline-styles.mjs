/*
 * Build-time no-inline-styles guard (TF-55 / styling).
 * Scans src/**\/*.astro for inline style attributes that contain
 * non-custom-property CSS declarations.
 *
 * ALLOWS:  style="--token: value"  (custom properties — keys starting with --)
 * REPORTS: style="color: red"      (real CSS properties)
 *
 * Default (warn mode): reports violations but exits 0.
 * --strict: exits non-zero when any violation is found.
 *
 * Usage: node scripts/no-inline-styles.mjs [--strict]
 *
 * Mirrors the UX/exit conventions of scripts/i18n-parity.mjs.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const STRICT = process.argv.includes('--strict');

/** Recursively collect .astro files under a directory. */
async function collectAstro(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectAstro(full)));
    } else if (entry.name.endsWith('.astro')) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Check a style attribute value for non-custom CSS property declarations.
 * Splits by ';' (CSS strings) and ',' (JS object entries), then inspects
 * the key portion (left of the first ':') in each segment.
 *
 * Returns true when at least one non-custom property is found.
 */
function hasNonCustomDeclaration(styleContent) {
  const parts = styleContent.split(/[;,]/);
  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx === -1) continue;
    const key = part.slice(0, colonIdx).trim();
    if (!key) continue;
    // Custom properties start with '--' — allowed.
    if (key.startsWith('--')) continue;
    // String-quoted JS object keys like "'--token'" — allowed.
    if (key.startsWith("'") || key.startsWith('"')) continue;
    // Must look like a CSS property name: optional leading hyphen, then a letter.
    if (/^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(key)) return true;
  }
  return false;
}

/**
 * Extract style attribute values from a single line of Astro source.
 * Handles:
 *   style="..."          — double-quoted CSS string
 *   style='...'          — single-quoted CSS string
 *   style={`...`}        — template literal expression
 *   style={{ key: val }} — JS object literal (double-brace)
 */
function extractStyleValues(line) {
  const values = [];
  let m;

  const dq = /style="([^"]*)"/g;
  while ((m = dq.exec(line)) !== null) values.push(m[1]);

  const sq = /style='([^']*)'/g;
  while ((m = sq.exec(line)) !== null) values.push(m[1]);

  const tl = /style=\{`([^`]*)`\}/g;
  while ((m = tl.exec(line)) !== null) values.push(m[1]);

  // Double-brace: style={{ ... }} — capture content between the inner braces.
  const obj = /style=\{\{([^}]*)\}\}/g;
  while ((m = obj.exec(line)) !== null) values.push(m[1]);

  return values;
}

const files = await collectAstro(SRC);
let violations = 0;

for (const file of files.sort()) {
  const content = await readFile(file, 'utf8');
  const lines = content.split('\n');
  const rel = file.slice(ROOT.length);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('style=')) continue;

    for (const val of extractStyleValues(line)) {
      if (hasNonCustomDeclaration(val)) {
        console.error(`  ${rel}:${i + 1} — style= contains non-custom-property declarations`);
        violations++;
        break; // one report per offending line
      }
    }
  }
}

if (violations === 0) {
  console.log('✓ No inline style violations found.');
} else {
  console.error(`\n✖ ${violations} inline style violation${violations === 1 ? '' : 's'} found.`);
  if (STRICT) {
    console.error('\nInline style guard failed (--strict mode).');
    process.exit(1);
  }
  console.log('\nInline style guard: warn mode — violations reported but not blocking.');
}
