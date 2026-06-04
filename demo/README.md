# Astorre — Workforce Platform (Demo)

Interactive demo prototype of the Astorre workforce-automation platform.
Plain HTML / CSS / JavaScript — no build step, no bundler, no framework.

Live target: **https://astorre.tech**

## Deploy to GitHub Pages (custom domain astorre.tech)

1. Put the **contents of this folder** at the **root of your repository**
   (so `index.html` sits at the repo root — not inside a subfolder).
2. Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   choose your branch and `/ (root)`, Save.
3. The included **`CNAME`** file already contains `astorre.tech`, so GitHub Pages
   will serve the site on that domain automatically.
4. DNS at your registrar — point the apex domain at GitHub Pages:
   - Four `A` records for `astorre.tech` →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (optional) a `CNAME` record for `www` → `<your-user>.github.io`
5. In **Settings → Pages**, tick **Enforce HTTPS** once the certificate is issued.

The link `https://astorre.tech/#demo` works as-is — the `#demo` hash is harmless;
the app loads at the root and opens on the Dashboard.

All asset paths are **relative** (`css/…`, `js/…`, `images/…`), so the site works
from the apex domain, a subdomain, or any sub-path without edits.

## Structure

```
index.html           entry point (root)
CNAME                 custom domain for GitHub Pages (astorre.tech)
.nojekyll            tells GitHub Pages to serve files as-is
css/styles.css        all styles + brand tokens (#2C50FE)
js/data.js            demo dataset (employees, stores, task types, courses) + icons
js/screens.js         screen renderers (Dashboard, Rota, Workers, Tasks, Reports, Mobile, Setup)
js/app.js             routing, state, AI-Distribute, modals, toasts, interactions
images/logo.svg       header logo
images/favicon.svg    favicon
```

## Editing

Everything is hand-readable, standard code (no bundles).
- Change data → `js/data.js`
- Restyle → `css/styles.css` (brand colour is the `--blue` token)
- Screens are built as template strings in `js/screens.js`
- Interactions / routing / state → `js/app.js`

The only external dependency is Google Fonts (Archivo + Manrope) loaded via `<link>`
in `index.html` — remove those two lines to run fully offline (falls back to system fonts).
