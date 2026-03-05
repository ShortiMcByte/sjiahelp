# SJIAHelp.com — Project Instructions

## Project Overview

Hugo + Congo website for sjiahelp.com — a resource hub for families and educators navigating systemic juvenile idiopathic arthritis (sJIA). The site promotes a pre-publication children's book (*Corbin and the Helpers Inside His Body*) and curates sJIA resources.

## Key Facts

- **Domain:** sjiahelp.com
- **GitHub Repo:** https://github.com/ShortiMcByte/sjiahub (under ShortiMcByte account)
- **Hosting:** Cloudflare Pages
- **Build command:** `hugo --minify`
- **Output dir:** `public`
- **Hugo version:** 0.155.3 extended

## GitHub Account

Use **ShortiMcByte** (andrew.phebus@gmail.com) for all pushes.
Switch with: `gh auth switch --user ShortiMcByte`
Do NOT use AndrewPhebus account (that is the andrewphebus.com personal site).

## Tech Stack

- Hugo v0.155.3 + Congo theme (git submodule at `themes/congo`, stable branch)
- No Go required — theme installed as git submodule
- Node.js + `@google/genai` + `sharp` for image generation
- Cloudflare Pages Functions for Mailchimp subscribe endpoint

## Brand

- **Colors:** Purple primary (#6d28d9), amber accent (#f59e0b)
- **Color scheme file:** `assets/css/schemes/sjiahub.css` (named sjiahub but contains purple values)
- **Logo:** Inline SVG in `layouts/_partials/logo.html` — purple shield + amber star + "SJIAHelp" wordmark. Override bypasses Congo's `resources.Get` (which fails on SVGs).
- **Custom CSS:** `assets/css/custom.css`

## Congo Theme Notes

- Config lives in `config/_default/` (not root hugo.toml)
- Color schemes go in `assets/css/schemes/<name>.css`
- SEO injection uses `layouts/partials/extend-head-uncached.html` (NOT extend-head.html — must be uncached for per-page context)
- Congo's logo partial uses `resources.Get` which requires images in `assets/` not `static/`. Avoid this by overriding `layouts/_partials/logo.html` with inline SVG.
- To hide the site title text next to logo: `showTitle = false` in `[header]` section of `params.toml`
- Theme partials override path: `layouts/_partials/` (note underscore)

## Site Structure

| Route | Content file |
|-------|-------------|
| `/` | `content/_index.md` |
| `/about-sjia/` | `content/about-sjia/index.md` |
| `/book/` | `content/book/index.md` |
| `/resources/` | `content/resources/index.md` |
| `/our-story/` | `content/our-story/index.md` |

## Email Waitlist

- Cloudflare Pages Function: `functions/api/subscribe.js`
- Mailchimp list ID and dc: **still placeholders** — update after creating Mailchimp audience
- MAILCHIMP_API_KEY: set as env var in Cloudflare Pages dashboard (not yet configured)

## SEO

- JSON-LD schemas in `layouts/partials/seo-schema.html`
- Per-page FAQ schema driven by `faq:` array in front matter
- OG/Twitter meta included in same partial

## Image Generation

Scripts at project root (copied from SBF site):
- `generate-image.js` — Gemini 2.5 Flash
- `generate-favicons.js` — all favicon sizes from logo-mark.png
- `convert-to-webp.js` — PNG → WebP

Images in `static/images/` (served via URL) AND `assets/images/` (for Hugo asset pipeline).
Requires `GEMINI_API_KEY` env var.

## ImportDocs Folder

`ImportDocs/` contains 12 Word documents with rich resource content:
- 504 accommodation guides (checklist, meeting notes, what is a 504, website code)
- sJIA guides: anti-inflammatory diet, caregiver mental health, community groups, explaining to others, helpful websites, insurance escalation, sibling resources, traveling with sJIA

These are candidates for future content pages or downloadable resources.

## Cloudflare Pages — Still Needed

- [ ] Connect Cloudflare Pages to ShortiMcByte/sjiahub
- [ ] Set env vars: `HUGO_VERSION=0.155.3`, `MAILCHIMP_API_KEY`
- [ ] Enable submodule cloning in build settings
- [ ] Create Mailchimp audience for sjiahelp.com, update listId + dc in subscribe.js
- [ ] Disable Rocket Loader + Cloudflare Fonts in Speed settings
- [ ] Allow AI crawlers in Security > Bots settings
