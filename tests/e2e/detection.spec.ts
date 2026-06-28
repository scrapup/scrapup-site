import { test, expect } from '@playwright/test';

/*
 * Root language auto-detection (RN-04/RN-05). The root '/' is on-demand; direct
 * locale routes are static and must never be redirected (indexability).
 */
test.describe('root language detection', () => {
  test('Accept-Language: pt-BR redirects to /pt/', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(307);
    expect(res.headers()['location']).toBe('/pt/');
  });

  test('Accept-Language: ja redirects to /ja/', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'ja,en;q=0.5' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(307);
    expect(res.headers()['location']).toBe('/ja/');
  });

  test('unsupported language falls back to EN (no redirect, EN body)', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('lang="en"');
    expect(body).toContain('forged');
  });

  test('q-values are honored: lower-positioned but higher-q locale wins', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'de-DE,de;q=0.9,en;q=0.3,pt;q=0.8' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(307);
    expect(res.headers()['location']).toBe('/pt/');
  });

  test('explicit EN cookie suppresses redirect even with pt Accept-Language (RN-05)', async ({
    request,
  }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'pt-BR', Cookie: 'scrapup_lang=en' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(200);
  });

  test('invalid cookie value falls back to Accept-Language detection', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'ja', Cookie: 'scrapup_lang=xx' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(307);
    expect(res.headers()['location']).toBe('/ja/');
  });

  test('absent Accept-Language serves EN (no redirect)', async ({ request }) => {
    const res = await request.get('/', { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test('scrapup_lang cookie overrides Accept-Language (RN-05)', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'pt-BR', Cookie: 'scrapup_lang=ja' },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(307);
    expect(res.headers()['location']).toBe('/ja/');
  });

  for (const path of ['/pt/', '/ja/']) {
    test(`direct ${path} is never redirected`, async ({ request }) => {
      const res = await request.get(path, {
        headers: { 'Accept-Language': 'en-US' },
        maxRedirects: 0,
      });
      expect(res.status()).toBe(200);
    });
  }
});
