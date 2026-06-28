/*
 * i18n helpers — locale list, default, URL → lang, translator and path builder.
 * EN is the source of truth and the default locale (served at '/').
 */
import { ui } from './ui';

export const LOCALES = ['en', 'pt', 'ja'] as const;
export const DEFAULT_LOCALE = 'en';

export type Lang = (typeof LOCALES)[number];
export type UiKey = keyof (typeof ui)['en'];

/** Type guard: is `value` one of the supported locales? */
export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Derive the active language from a URL path: `/pt/...` → 'pt', `/ja/...` → 'ja',
 * everything else → 'en' (the default, served at root).
 */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  return seg && isLang(seg) ? seg : DEFAULT_LOCALE;
}

/** A typed translator bound to one locale; an unknown key is a compile-time error. */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key];
  };
}

/**
 * Pick the best supported locale from an Accept-Language header (honors q-values),
 * returning DEFAULT_LOCALE when nothing matches or the header is absent.
 */
export function detectFromAcceptLanguage(header: string | null): Lang {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      const quality = q ? Number.parseFloat(q.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((r) => r.tag)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLang(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/**
 * Resolve the locale for a root entry: an explicit `scrapup_lang` cookie wins
 * (RN-05), otherwise fall back to Accept-Language detection (RN-04, EN default).
 */
export function detectLocale(cookieValue: string | undefined, acceptLanguage: string | null): Lang {
  if (cookieValue && isLang(cookieValue)) return cookieValue;
  return detectFromAcceptLanguage(acceptLanguage);
}

/**
 * Build a localized, root-absolute path. EN maps to '/', PT/JA are prefixed.
 * `path` is the unprefixed path (e.g. '' or 'foo'); the result always ends cleanly.
 */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = lang === DEFAULT_LOCALE ? '' : `/${lang}`;
  if (!clean) return `${prefix}/`;
  return `${prefix}/${clean}/`;
}
