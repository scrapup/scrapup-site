// Persist the explicit language choice so root auto-detection honors it (RN-05).
// Served as a same-origin external module so it passes the production CSP
// (`script-src 'self'`); an inline script would be blocked. See vercel.json.
document.querySelectorAll('.lang-switch a[data-lang]').forEach((a) => {
  a.addEventListener('click', () => {
    const l = a.dataset.lang;
    if (l) document.cookie = `scrapup_lang=${l}; path=/; max-age=31536000; samesite=lax; secure`;
  });
});
