# SJIAHelp.com — Site Design Document
**Date:** 2026-03-03
**Domain:** sjiahelp.com
**Hosting:** Cloudflare Pages
**Repo:** GitHub (AndrewPhebus / shortiMcByte account)

---

## Purpose

A resource hub for families, educators, and the broader public navigating systemic juvenile
idiopathic arthritis (sJIA). The site serves three primary goals:

1. Educate visitors about sJIA (what it is, symptoms, diagnosis, flares, treatment)
2. Promote the pre-publication children's book *Corbin and the Helpers Inside His Body*
3. Curate resources (medical orgs, advocacy groups, school tools, anti-inflammatory diet)

---

## Audience

- Parents of children with sJIA (primary)
- Educators, school staff, classmates
- Medical professionals (many have limited sJIA exposure due to its rarity)
- General public / broad awareness

---

## Site Architecture

| Route | Purpose |
|-------|---------|
| `/` | Home — hero + 3 feature cards (Learn, Book, Resources) |
| `/about-sjia/` | Education hub: what is sJIA, symptoms, diagnosis, flares, treatment |
| `/book/` | Book promotion + email waitlist signup |
| `/resources/` | Curated links by category (medical orgs, advocacy, school, diet) |
| `/our-story/` | Corbin's story and author's note |

Navigation: About sJIA / The Book / Resources / Our Story

---

## Visual Identity

### Color Palette

| Role | Name | Hex |
|------|------|-----|
| Primary | Deep Teal | `#0f766e` |
| Primary Light | Teal | `#0d9488` |
| Primary Dark | Teal Dark | `#134e4a` |
| Primary Mist | Teal Mist | `#ccfbf1` |
| Accent | Warm Amber | `#f59e0b` |
| Accent Light | Amber Light | `#fef3c7` |
| Background | Off-White | `#fafaf9` |
| Text | Dark Slate | `#1c1917` |

### Typography
- Font: Inter (system sans-serif fallback)
- Congo theme default, no custom font loading (avoids LCP penalty)

### Tone
- Warm but credible — approachable for parents and kids, structured enough for educators
  and medical professionals

### Tagline
"Understand it. Manage it. Live fully."

---

## Hugo Setup

- **SSG:** Hugo v0.155.3 extended
- **Theme:** Congo (via Hugo Modules)
- **Config format:** TOML
- **Congo color scheme:** Custom (teal/amber, defined in `assets/css/custom.css`)
- **Congo homepage layout:** `background` or `page` with custom hero partial override

---

## Images (Gemini-generated)

All generated with `generate-image.js` (copied from SBF site), converted to WebP via Sharp.

| File | Dimensions | Purpose |
|------|-----------|---------|
| `static/images/logo-mark.png` | 512x512 | Favicon source (shield/cell motif, teal) |
| `static/images/og-image.png` | 1200x630 | Default OG card |
| `static/images/hero-bg.webp` | 1920x800 | Hero background |
| `static/images/book-placeholder.webp` | 400x500 | Book cover placeholder |

Favicon pipeline: `logo-mark.png` -> `generate-favicons.js` -> all standard sizes + `.ico`

---

## Email Waitlist

- **Service:** Mailchimp (new audience list for sjiahelp.com)
- **Integration:** Cloudflare Pages Function at `functions/api/subscribe.js`
  (ported from SBF site, CORS updated to `https://sjiahelp.com`)
- **Env var:** `MAILCHIMP_API_KEY` set in Cloudflare Pages dashboard
- **Fields:** email (required), firstName (optional)
- **Honeypot:** included for spam prevention

---

## SEO & AI Overview Architecture

### Front Matter Template (every page)
```yaml
title: ""              # H1, og:title
description: ""        # 150-160 chars with keywords, og:description
keywords: []           # 5-7 targeted keywords
tags: []               # taxonomy
summary: ""            # 1-2 sentence summary for listing cards
```

### Structured Data (JSON-LD via `layouts/partials/seo-schema.html`)
Loaded from `layouts/partials/extend-head-uncached.html`:

| Schema | Scope |
|--------|-------|
| Organization | Homepage only |
| FAQPage | Every page (2-4 Q&As targeting "People Also Ask") |
| Speakable | All content pages |
| BreadcrumbList | Via Congo `enableStructuredBreadcrumbs = true` |
| Article | Via Congo automatically on content pages |

### Meta Tags
- Unique `<title>` per page with primary keyword
- `<meta name="description">` 150-160 chars
- Self-referencing canonical
- OG: title, description, image (1200x630), url
- Twitter card: `summary_large_image`
- Default OG image fallback, per-page featured images override

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://sjiahelp.com/sitemap.xml
```
AI crawlers (GPTBot, Google-Extended, Anthropic) must be allowed in Cloudflare Security settings.

### Sitemap priorities
- Homepage: 1.0
- Content pages: 0.7
- Other: 0.5

---

## Resources Page Categories

1. Medical Organizations & Research (CARRA, ACR, NIH/NIAMS)
2. Patient Advocacy Groups (Arthritis Foundation, sJIA Foundation, AARDA)
3. School & Educator Resources
4. Anti-Inflammatory Diet (prominent section)

---

## GitHub / Deployment

- **GitHub account:** AndrewPhebus (`gh auth switch --hostname github.com --user AndrewPhebus`)
- **Repo name:** `sjiahub` (new public repo under AndrewPhebus)
- **Branch:** `main`
- **Cloudflare Pages build command:** `hugo --minify`
- **Cloudflare Pages output dir:** `public`
- **Hugo version env var:** `HUGO_VERSION=0.155.3`

---

## Image Generation Prompts (Reference)

### Logo mark
```
Simple minimal icon: a friendly abstract shield shape with a small glowing cell or star
inside, representing the immune system. Solid deep teal color (#0f766e) on a white background.
Clean vector-style, suitable for a favicon. 512x512 pixels. No text, no words, no letters.
```

### OG image
```
1200x630 pixel social media card. Deep teal (#0f766e) to dark teal (#134e4a) gradient
background. Large bold white text area placeholder (no actual text). Warm amber (#f59e0b)
accent stripe or geometric shape. Clean, modern, professional. Medical/advocacy aesthetic.
No photos of people. No text, no words, no letters, no writing.
```

### Hero background
```
Soft watercolor-style abstract background. Gentle teal and off-white tones. Flowing organic
shapes suggesting cells or gentle motion. Warm, hopeful, calming. 1920x800 pixels. Very
subtle, low contrast, suitable as a background behind white text. No text, no people, no
letters, no writing.
```

### Book placeholder cover
```
Friendly children's book cover illustration style. A small child standing inside a large
friendly body silhouette filled with glowing colorful cartoon "helper" cells. Warm teal and
amber palette. Soft, welcoming, age-appropriate. 400x500 pixels portrait orientation.
No text, no words, no letters, no writing.
```
