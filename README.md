# Apsides Labs — Blog

A professional, static blog site. **HTML5 + CSS3 + vanilla JavaScript. No frameworks, no build step, no dependencies.**

## What's inside

```
blog/
├── index.html                  Home — hero, featured post, latest, products, CTA
├── blog.html                   All posts (client-side search + tag filter)
├── about.html                  About Apsides Labs
├── 404.html                    Not-found page
├── posts/
│   ├── agents-outside-the-lines.html
│   ├── agents-at-work.html
│   ├── capable-ai-on-constrained-hosts.html
│   └── offline-first-learning.html
├── assets/
│   ├── style.css               Design system (light/dark, fluid type)
│   ├── main.js                 Theme, nav, reading progress, search, copy buttons
│   ├── favicon.svg
│   └── og.png                  Social share image (1200×630)
├── sitemap.xml
├── robots.txt
└── feed.xml                    RSS 2.0
```

## Features

- **SEO complete** — per-page titles, meta descriptions, canonical URLs, Open Graph + Twitter cards, JSON-LD structured data (Organization, WebSite, Blog, BlogPosting, AboutPage), `sitemap.xml`, `robots.txt`, RSS feed.
- **Readable by design** — 18px+ body text, 1.7 line-height, ~68-character measure, fluid type scale. Built to read like a company/SaaS site, not a wall of text.
- **Light & dark themes** — system-aware, remembered, no flash on load.
- **Smooth and fast** — static HTML, no runtime dependencies, zero third-party JS.
- **Accessible** — semantic landmarks, skip link, focus-visible styles, `prefers-reduced-motion` support, ARIA labels.
- **Progressive enhancement** — every feature degrades gracefully without JavaScript.

## Deploying to GitHub Pages

1. Create a repository (e.g. `apsideslabs.github.io` for a root site, or any name for a project page).
2. Upload the **contents** of this `blog/` folder to the repository root.
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
4. Your site is live at `https://<user>.github.io/` (or `https://<user>.github.io/<repo>/`).

## Changing the site URL

The site uses **relative links** for navigation and assets, so it works at any sub-path automatically. The only thing that is absolute is the canonical/OG/RSS URLs. If your final URL differs from `https://apsideslabs.github.io/`, find and replace that string across:

- every `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`
- the JSON-LD blocks in each page
- `sitemap.xml`, `robots.txt`, `feed.xml`

## Adding a post

1. Copy an existing file in `posts/`.
2. Update the `<title>`, meta description, canonical, OG tags and the `BlogPosting` JSON-LD.
3. Write the body inside `<div class="prose">`.
4. Add a card to `blog.html` (and optionally `index.html`), plus an entry in `sitemap.xml` and `feed.xml`.

## Credits

Built by **Apsides Labs**. Fonts: Inter, Fraunces and JetBrains Mono (Google Fonts). Everything else is hand-written.

## Integrations wired in

- **Pagefind** — full-text, client-side search (`/search.html`). Index lives in `pagefind/`. To rebuild after editing posts: run `pagefind --site .` in this folder.
- **Lenis** — smooth scroll, self-hosted at `assets/vendor/lenis.min.js` (auto-disabled for `prefers-reduced-motion`).
- **View Transitions API** — native cross-page transitions (progressive; Chromium only).
- **Giscus** — comments on posts, backed by GitHub Discussions (repo `apsideslabs/apsideslabs.github.io`, category "Announcements"). Install the giscus GitHub App on the repo for it to work.
- **GoatCounter** — privacy-friendly analytics. Replace `YOUR-CODE` in the `data-goatcounter` attribute with your site code from goatcounter.com.

## Deploying (already done for you)

The site is published from the `apsideslabs.github.io` repository and served at **https://apsideslabs.github.io/**.
