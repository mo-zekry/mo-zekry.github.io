# mo-zekry.github.io

Bilingual (English / Arabic) personal tech blog powered by Eleventy. The site source lives under `src/` and the generated site is written to `docs/`.

Key points
- Eleventy (11ty) as static site generator
- Output directory: `docs/` (used for GitHub Pages or other static hosts)
- Languages supported: English and Arabic (content under `src/content/{en,ar}/posts/`)

Prerequisites
- Node.js >= 18
- npm (or compatible package manager)

Install

```bash
npm ci
```

Development

- Start local dev server (Eleventy live-reload):

```bash
npm start
# or
npx @11ty/eleventy --serve
```

Build

```bash
npm run build
```

Clean build artifacts

```bash
npm run clean
```

Where to look
- Generated output: `docs/`
- Source templates and content: `src/`
  - `src/_includes/layouts/` — Nunjucks templates
  - `src/_data/site.json` — site metadata (title, repoOwner, repoName, branch)
  - `src/content/en/posts/` and `src/content/ar/posts/` — Markdown posts
  - `src/assets/` — CSS and static assets

CI / Deployment
- There is a GitHub Actions workflow at `.github/workflows/build-and-deploy.yml` that builds the site on push to `main` and deploys the `docs/` folder using `peaceiris/actions-gh-pages`.

Repository metadata
- name: `mo-zekry.github.io`
- Eleventy config entrypoint: `.eleventy.js` (project `main` in package.json)

Adding a post
- Create a Markdown file in the appropriate language folder with frontmatter, example:

```yaml
---
title: "My post title"
date: 2026-01-15
lang: en
layout: layouts/post.njk
---

Post content...
```

The site constructs raw-file URLs using values in `src/_data/site.json` (repoOwner, repoName, branch).

Gaps & recommendations
- Missing `author` and contact info in `package.json` and `src/_data/site.json` — add author and email/links.
- No `dev` script defined (you tried `npm run dev`) — consider adding a `dev` alias for `start`:
  ```json
  "dev": "eleventy --serve --watch"
  ```
- Tests: there are no automated tests. Add a simple linting or CI test step if desired.
- Contribution guidelines: no `CONTRIBUTING.md` or CODE_OF_CONDUCT — add if accepting contributions.
- License: `package.json` lists `ISC` but there's no LICENSE file — add a LICENSE file if you want clarity for reuse.
- Accessibility and i18n checks: consider adding automated checks for RTL rendering and language metadata (lang attributes).
- Search / indexing: there's no client-side search or RSS feed — consider adding an RSS feed and a small search index for posts.
- Missing explicit instructions for local preview URL and port (Eleventy defaults to `http://localhost:8080`) — mention if you prefer a different port.

Contact / help
- Open issues at the repository issues page. For development questions, include Node.js version and OS when filing issues.

If you want, I can:
- add a `dev` script and an example `CONTRIBUTING.md`
- add a minimal `LICENSE` file
- scaffold RSS, search, or tag pages

---
Generated/updated on 2026-01-15

Media (images & videos)

- Place images in `src/assets/images/` and videos in `src/assets/videos/`. These folders are copied to `docs/assets/images/` and `docs/assets/videos/` on build.
- You can embed images and videos directly in Markdown (images via standard `![alt](assets/images/foo.jpg)` and videos via raw HTML), or use the provided shortcodes in Nunjucks/Markdown (Eleventy uses Nunjucks for Markdown templates):

   Image shortcode:

   ```njk
   {% img "assets/images/photo.jpg", "A descriptive alt", "responsive-class" %}
   ```

   Video shortcode (MP4 fallback):

   ```njk
   {% video "assets/videos/clip.mp4", "assets/images/clip-poster.jpg", "video-class" %}
   ```

- Shortcodes add `loading="lazy"` on images and produce basic markup; customize classes in your CSS (`src/assets/css/styles.css`).

Language & Theme (system defaults)

- The site will automatically use the visitor's system color-scheme preference (`prefers-color-scheme`) for initial theme. You can toggle theme with the header button; the choice is saved to `localStorage` and persisted across visits.
- The root path (`/`) will auto-redirect to `/en/` or `/ar/` based on the browser/system language (e.g., `navigator.language`). If you explicitly choose a language via the navigation links, that preference is saved and will be respected on future visits.
- To override a saved language, clear `localStorage.lang` in browser devtools or click the other language link in the header.

# mo-zekry.github.io

This repository is a bilingual (English/Arabic) tech blog built with Eleventy. Posts are stored as Markdown files under `src/content/{en,ar}/posts/`. Each post includes a link to its raw `.md` file (hosted on GitHub) so readers can view the original markdown.

---

## Quick start ✅

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Run a local dev server:

   ```bash
   npm start
   ```

3. Build for production:

   ```bash
   npm run build
   ```

A GitHub Action (`.github/workflows/build-and-deploy.yml`) builds the site on `main` and deploys the generated content to the `gh-pages` branch using `peaceiris/actions-gh-pages`.

---

## Project structure 🔧

- `src/content/en/posts/` - English `.md` posts
- `src/content/ar/posts/` - Arabic `.md` posts
- `src/_includes/layouts/` - Templates
- `src/assets/` - Static assets (CSS, images)
- `src/_data/site.json` - Site metadata (repo owner/name/branch)
- `docs/` - Generated site output (build artifact)

---

## How to add a post ✍️

Create a `.md` file in the appropriate language folder with frontmatter similar to:

```yaml
---
title: "Post title"
date: 2026-01-15
lang: en # or ar
layout: layouts/post.njk
---

Your Markdown content...
```

When published, the site will provide a link to the raw markdown file. Example raw file URL structure:

```
https://raw.githubusercontent.com/<repoOwner>/<repoName>/<branch>/src/content/en/posts/<your-file>.md
```

---

If you want, I can also add more features (tags, search, RSS, or better Arabic typography). Let me know which features you prefer.
