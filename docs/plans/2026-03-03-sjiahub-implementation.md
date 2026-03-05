# SJIAHelp.com Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and deploy a Hugo + Congo site at sjiahelp.com on Cloudflare Pages that educates families about sJIA, promotes a pre-publication children's book with a Mailchimp waitlist, and curates resources.

**Architecture:** Hugo static site with Congo theme (git submodule), Cloudflare Pages Functions for Mailchimp subscribe endpoint, Gemini-generated images, and JSON-LD SEO schemas wired to Congo's `extend-head-uncached.html` partial.

**Tech Stack:** Hugo v0.155.3 extended, Congo theme (stable branch), Node.js + @google/genai + sharp for image generation, Cloudflare Pages Functions, Mailchimp API.

---

## Task 1: Initialize Hugo site and Git repo

**Files:**
- Create: `/c/Users/AndrewPhebus/MyProjects/Websites/sjia/` (already exists, is empty)

**Step 1: Initialize Hugo site**

Run from `C:/Users/AndrewPhebus/MyProjects/Websites/`:
```bash
hugo new site sjia --force
cd sjia
```
`--force` is required because the directory already exists with `docs/` and `preview.html` in it.

**Step 2: Initialize git**
```bash
git init
git config user.name "ShortiMcByte"
git config user.email "andrew.phebus@gmail.com"
```

**Step 3: Create .gitignore**

Create `sjia/.gitignore`:
```
public/
resources/
.hugo_build.lock
node_modules/
*.png
*.webp
*.ico
!static/images/.gitkeep
```

**Step 4: Verify Hugo scaffolded correctly**
```bash
ls
```
Expected: `archetypes/  assets/  content/  data/  docs/  hugo.toml  i18n/  layouts/  static/  themes/`

---

## Task 2: Add Congo theme as git submodule

**Files:**
- Create: `themes/congo/` (via submodule)

**Step 1: Add submodule**
```bash
git submodule add -b stable https://github.com/jpanther/congo.git themes/congo
```
Expected: clones Congo into `themes/congo/`, creates `.gitmodules`

**Step 2: Copy Congo's example config**
```bash
cp -r themes/congo/config.examples/default/* .
```
This creates `config/_default/` with `hugo.toml`, `languages.en.toml`, `menus.en.toml`, `params.toml`.

**Step 3: Remove the root hugo.toml Congo created during `hugo new site` (we now use config/_default/)**
```bash
rm hugo.toml
```

**Step 4: Verify config structure**
```bash
ls config/_default/
```
Expected: `hugo.toml  languages.en.toml  menus.en.toml  params.toml`

---

## Task 3: Configure site — hugo.toml

**Files:**
- Modify: `config/_default/hugo.toml`

Replace entire file with:
```toml
baseURL = "https://sjiahelp.com/"
languageCode = "en"
title = "SJIAHelp"
theme = "congo"

[pagination]
  pagerSize = 10

[sitemap]
  changeFreq = "weekly"
  priority = 0.5

[[sitemap.sitemaps]]
  name = "pages"
  disableKinds = []

[outputs]
  home = ["HTML", "RSS", "JSON"]

[services]
  [services.googleAnalytics]
    id = ""

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    noClasses = false
```

---

## Task 4: Configure site — params.toml

**Files:**
- Modify: `config/_default/params.toml`

Replace entire file with:
```toml
colorScheme = "sjiahub"
defaultAppearance = "light"
autoSwitchAppearance = false

description = "A resource hub for families, educators, and advocates navigating systemic juvenile idiopathic arthritis (sJIA). Learn about sJIA, find resources, and discover our children's book."

logo = "images/logo-mark.webp"
logoDark = "images/logo-mark.webp"

mainSections = []
showRecent = false
showRecentItems = 0

enableSearch = false
enableCodeCopy = false

[homepage]
  layout = "custom"
  showRecent = false

[article]
  showDate = false
  showViews = false
  showLikes = false
  showAuthor = false
  showBreadcrumbs = true
  showDraftLabel = false
  showEdit = false
  showReadingTime = false
  showTableOfContents = true
  showTaxonomies = false
  showWordCount = false
  showSummary = false
  showPagination = false

[list]
  showBreadcrumbs = true
  showTableOfContents = false
  showSummary = false

[sitemap]
  excludedKinds = []

[robots]
  enable = true

[footer]
  showCopyright = true
  showThemeAttribution = false
  showScrollToTop = true

[privacy]
  # No embedded third party scripts needed

[social]
  # Add social handles here when available
```

---

## Task 5: Configure menus and language

**Files:**
- Modify: `config/_default/menus.en.toml`
- Modify: `config/_default/languages.en.toml`

Replace `menus.en.toml` with:
```toml
[[main]]
  name = "About sJIA"
  pageRef = "about-sjia"
  weight = 10

[[main]]
  name = "The Book"
  pageRef = "book"
  weight = 20

[[main]]
  name = "Resources"
  pageRef = "resources"
  weight = 30

[[main]]
  name = "Our Story"
  pageRef = "our-story"
  weight = 40
```

Replace `languages.en.toml` with:
```toml
languageName = "English"
languageCode = "en"
weight = 1

title = "SJIAHelp"

[params]
  displayName = "EN"
  isoCode = "en"
  rtl = false
  dateFormat = "January 2, 2006"
  logo = "images/logo-mark.webp"
  description = "A resource hub for families, educators, and advocates navigating systemic juvenile idiopathic arthritis (sJIA)."
  author.name = "SJIAHelp"
```

---

## Task 6: Create custom Congo color scheme

**Files:**
- Create: `assets/css/schemes/sjiahub.css`

```css
/* SJIAHelp custom Congo color scheme — teal primary, amber accent */
:root {
  --color-primary-50:  240, 253, 250;
  --color-primary-100: 204, 251, 241;
  --color-primary-200: 153, 246, 228;
  --color-primary-300:  94, 234, 212;
  --color-primary-400:  45, 212, 191;
  --color-primary-500:  20, 184, 166;
  --color-primary-600:  13, 148, 136;
  --color-primary-700:  15, 118, 110;
  --color-primary-800:  17,  94,  89;
  --color-primary-900:  19,  78,  74;
  --color-primary-950:   4,  47,  46;
}
```

---

## Task 7: Create custom CSS overrides

**Files:**
- Create: `assets/css/custom.css`

```css
/* ============================================================
   SJIAHelp Custom Styles
   ============================================================ */

/* ---------- Amber accent utilities ---------- */
:root {
  --amber-400: #fbbf24;
  --amber-500: #f59e0b;
  --amber-600: #d97706;
  --amber-light: #fef3c7;
}

/* ---------- Site header / nav ---------- */
.header-wrapper {
  border-bottom: 2px solid rgb(var(--color-primary-700));
}

/* ---------- Homepage Hero ---------- */
.sjia-hero {
  background: linear-gradient(135deg,
    rgb(var(--color-primary-700)) 0%,
    rgb(var(--color-primary-600)) 60%,
    rgb(var(--color-primary-900)) 100%);
  color: #ffffff;
  padding: 5rem 2rem;
  text-align: center;
}

.sjia-hero h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.sjia-hero h1 em {
  color: var(--amber-400);
  font-style: normal;
}

.sjia-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 560px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.sjia-hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--amber-500);
  color: #1c1917;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--amber-600); color: #1c1917; }

.btn-outline {
  border: 2px solid #ffffff;
  color: #ffffff;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s;
}
.btn-outline:hover { background: rgba(255,255,255,0.15); color: #ffffff; }

/* ---------- Feature Cards ---------- */
.sjia-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 3.5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.sjia-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.05);
  border-top: 4px solid rgb(var(--color-primary-700));
  transition: transform 0.2s, box-shadow 0.2s;
}
.sjia-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,.1), 0 8px 24px rgba(0,0,0,.08);
}
.sjia-card.accent { border-top-color: var(--amber-500); }

.sjia-card-icon { font-size: 2.25rem; margin-bottom: 1rem; }

.sjia-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: rgb(var(--color-primary-700));
}
.sjia-card.accent h3 { color: #92400e; }

.sjia-card p {
  font-size: 0.95rem;
  color: #57534e;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.sjia-card-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--color-primary-700));
  text-decoration: none;
}
.sjia-card-link:hover { text-decoration: underline; }
.sjia-card.accent .sjia-card-link { color: #92400e; }

/* ---------- Book Section ---------- */
.sjia-book-section {
  background: rgb(var(--color-primary-50));
  border-top: 1px solid rgb(var(--color-primary-100));
  border-bottom: 1px solid rgb(var(--color-primary-100));
  padding: 4rem 2rem;
}

.sjia-book-inner {
  display: flex;
  align-items: center;
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.sjia-book-cover {
  width: 200px;
  min-width: 160px;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 20px rgba(0,0,0,.2);
}

.sjia-book-copy { flex: 1; min-width: 280px; }

.coming-soon-badge {
  display: inline-block;
  background: var(--amber-light);
  color: #92400e;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.sjia-book-copy h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.25;
}
.sjia-book-copy h2 em {
  color: rgb(var(--color-primary-700));
  font-style: normal;
}

.sjia-book-copy p {
  color: #57534e;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

/* ---------- Waitlist Form ---------- */
.waitlist-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.waitlist-form input[type="email"] {
  flex: 1;
  min-width: 200px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #d6d3d1;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.waitlist-form input[type="email"]:focus {
  border-color: rgb(var(--color-primary-600));
}

.waitlist-form button {
  background: rgb(var(--color-primary-700));
  color: #ffffff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.waitlist-form button:hover { background: rgb(var(--color-primary-800)); }

.waitlist-note {
  font-size: 0.8rem;
  color: #78716c;
  margin-top: 0.5rem;
}

.waitlist-status {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
}
.waitlist-status.success { color: rgb(var(--color-primary-700)); }
.waitlist-status.error   { color: #dc2626; }

/* ---------- Resources Page ---------- */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.resource-category {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}

.resource-category h3 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--color-primary-700));
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgb(var(--color-primary-100));
}

.resource-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resource-category li a {
  font-size: 0.9rem;
  color: rgb(var(--color-primary-700));
  text-decoration: none;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}
.resource-category li a::before {
  content: "→";
  color: var(--amber-500);
  font-weight: 700;
  flex-shrink: 0;
}
.resource-category li a:hover { text-decoration: underline; }

.resource-category li .resource-desc {
  font-size: 0.78rem;
  color: #78716c;
  margin-top: 0.15rem;
  margin-left: 1rem;
}

/* ---------- Disclaimer Footer Note ---------- */
.medical-disclaimer {
  background: #f5f5f4;
  border-left: 3px solid rgb(var(--color-primary-400));
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
  color: #78716c;
  border-radius: 0 0.25rem 0.25rem 0;
  margin-top: 2rem;
}

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .sjia-hero { padding: 3rem 1.25rem; }
  .sjia-book-inner { flex-direction: column; }
  .sjia-book-cover { width: 160px; margin: 0 auto; }
}
```

---

## Task 8: Create homepage layout

Congo expects a `layouts/index.html` for a custom homepage. We extend Congo's base.

**Files:**
- Create: `layouts/index.html`

```html
{{ define "main" }}

{{/* Hero */}}
<section class="sjia-hero">
  <h1>Understand it.<br><em>Live fully.</em></h1>
  <p>A hub for families, educators, and advocates navigating systemic juvenile idiopathic arthritis.</p>
  <div class="sjia-hero-buttons">
    <a href="/book/" class="btn-primary">Get the Book</a>
    <a href="/about-sjia/" class="btn-outline">Learn About sJIA</a>
  </div>
</section>

{{/* Feature cards */}}
<div class="sjia-cards">
  <div class="sjia-card">
    <div class="sjia-card-icon">🧬</div>
    <h3>Learn About sJIA</h3>
    <p>Understand what systemic juvenile idiopathic arthritis is, how it affects kids, and why early diagnosis matters.</p>
    <a href="/about-sjia/" class="sjia-card-link">Start here →</a>
  </div>
  <div class="sjia-card accent">
    <div class="sjia-card-icon">📖</div>
    <h3>Corbin and the Helpers Inside His Body</h3>
    <p>A picture book that helps children, classmates, and educators understand sJIA in simple, hopeful terms.</p>
    <a href="/book/" class="sjia-card-link">Join the waitlist →</a>
  </div>
  <div class="sjia-card">
    <div class="sjia-card-icon">🔗</div>
    <h3>Resources</h3>
    <p>Curated links to medical organizations, advocacy groups, school tools, and anti-inflammatory diet guidance.</p>
    <a href="/resources/" class="sjia-card-link">Browse resources →</a>
  </div>
</div>

{{/* Book teaser */}}
<section class="sjia-book-section">
  <div class="sjia-book-inner">
    <img src="/images/book-placeholder.webp" alt="Corbin and the Helpers Inside His Body — children's book cover" class="sjia-book-cover">
    <div class="sjia-book-copy">
      <span class="coming-soon-badge">Coming Soon</span>
      <h2>The book we <em>needed</em> didn't exist.<br>So we wrote it.</h2>
      <p>When Corbin returned to school on high-dose steroids and classmates didn't understand why he looked different, we searched for a book to help explain sJIA. We couldn't find one — so we wrote <em>Corbin and the Helpers Inside His Body</em>, a picture book for children, families, and educators navigating sJIA together.</p>
      {{ partial "waitlist-form.html" (dict "context" "home") }}
    </div>
  </div>
</section>

{{ end }}
```

---

## Task 9: Create waitlist form partial

**Files:**
- Create: `layouts/partials/waitlist-form.html`

```html
{{/* Waitlist form — context: "home", "book" */}}
{{ $btnText := "Notify Me When Available" }}
{{ if eq .context "book" }}{{ $btnText = "Join the Waitlist" }}{{ end }}

<form class="waitlist-form" id="waitlist-{{ .context }}">
  <input type="email" name="email" placeholder="your@email.com" required>
  <button type="submit">{{ $btnText }}</button>
  {{/* Honeypot */}}
  <div style="position:absolute;left:-5000px;" aria-hidden="true">
    <input type="text" name="b_trap" tabindex="-1" value="">
  </div>
</form>
<p class="waitlist-note">We'll email you when it's available. No spam, ever.</p>
<div class="waitlist-status" id="waitlist-status-{{ .context }}"></div>

<script>
(function() {
  const form = document.getElementById('waitlist-{{ .context }}');
  const status = document.getElementById('waitlist-status-{{ .context }}');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = form.querySelector('[name="email"]').value;
    const honeypot = form.querySelector('[name="b_trap"]').value;
    if (honeypot) return;
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = "You're on the list! We'll be in touch.";
        status.className = 'waitlist-status success';
        form.reset();
      } else {
        status.textContent = data.message || 'Something went wrong. Try again.';
        status.className = 'waitlist-status error';
      }
    } catch {
      status.textContent = 'Network error. Please try again.';
      status.className = 'waitlist-status error';
    } finally {
      btn.disabled = false;
      btn.textContent = '{{ $btnText }}';
    }
  });
})();
</script>
```

---

## Task 10: Create SEO schema partial

**Files:**
- Create: `layouts/partials/seo-schema.html`
- Create: `layouts/partials/extend-head-uncached.html`

### `layouts/partials/seo-schema.html`

```html
{{/* Organization schema — homepage only */}}
{{ if .IsHome }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SJIAHelp",
  "url": "https://sjiahelp.com/",
  "logo": "https://sjiahelp.com/images/og-image.webp",
  "description": "A resource hub for families, educators, and advocates navigating systemic juvenile idiopathic arthritis (sJIA).",
  "founder": { "@type": "Person", "name": "Andrew Phebus" }
}
</script>
{{ end }}

{{/* FAQPage schema — defined per page via front matter faq array */}}
{{ with .Params.faq }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{ range $i, $qa := . }}{{ if $i }},{{ end }}{
      "@type": "Question",
      "name": {{ $qa.q | jsonify }},
      "acceptedAnswer": {
        "@type": "Answer",
        "text": {{ $qa.a | jsonify }}
      }
    }{{ end }}
  ]
}
</script>
{{ end }}

{{/* Speakable schema — all content pages */}}
{{ if not .IsHome }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "article p:first-of-type"]
  },
  "url": {{ .Permalink | jsonify }}
}
</script>
{{ end }}

{{/* OG and Twitter meta */}}
{{ $ogImage := "/images/og-image.webp" }}
{{ with .Params.featured_image }}{{ $ogImage = . }}{{ end }}
<meta property="og:title" content="{{ .Title }} | SJIAHelp">
<meta property="og:description" content="{{ with .Params.description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta property="og:image" content="{{ .Site.BaseURL }}{{ $ogImage | strings.TrimPrefix "/" }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:type" content="{{ if .IsHome }}website{{ else }}article{{ end }}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ .Title }} | SJIAHelp">
<meta name="twitter:description" content="{{ with .Params.description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta name="twitter:image" content="{{ .Site.BaseURL }}{{ $ogImage | strings.TrimPrefix "/" }}">
{{ with .Params.keywords }}<meta name="keywords" content="{{ delimit . ", " }}">{{ end }}
<link rel="canonical" href="{{ .Permalink }}">
```

### `layouts/partials/extend-head-uncached.html`

```html
{{ partial "seo-schema.html" . }}
```

---

## Task 11: Create robots.txt

**Files:**
- Create: `static/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://sjiahelp.com/sitemap.xml
```

---

## Task 12: Set up image generation scripts

Copy from SBF site, update package.json.

**Files:**
- Create: `generate-image.js` (copy from SBF)
- Create: `generate-favicons.js` (copy from SBF)
- Create: `remove-bg.js` (copy from SBF)
- Create: `package.json`

**Step 1: Copy scripts from SBF**
```bash
cp /c/Users/AndrewPhebus/MyProjects/Websites/SBF/generate-image.js .
cp /c/Users/AndrewPhebus/MyProjects/Websites/SBF/generate-favicons.js .
cp /c/Users/AndrewPhebus/MyProjects/Websites/SBF/remove-bg.js .
```

**Step 2: Create package.json**
```json
{
  "dependencies": {
    "@google/genai": "^1.41.0"
  },
  "devDependencies": {
    "sharp": "^0.34.5"
  }
}
```

**Step 3: Install dependencies**
```bash
npm install
```

**Step 4: Create placeholder images directory**
```bash
mkdir -p static/images
touch static/images/.gitkeep
```

---

## Task 13: Generate site images with Gemini

Requires `GEMINI_API_KEY` env var set. Run each command, verify output file is created.

**Step 1: Generate logo mark**
```bash
node generate-image.js "Simple minimal icon: a friendly rounded shield shape with a small glowing geometric star or cell inside, representing a protective immune system helper. Solid deep teal color (#0f766e) on a pure white background. Clean vector-style lines, very minimal detail, bold and recognizable at small sizes, suitable as a website favicon. 512x512 pixels square. No text, no words, no letters, no writing, no gradients." "static/images/logo-mark.png"
```

**Step 2: Generate OG image**
```bash
node generate-image.js "1200x630 pixel social media card for a children's health awareness website. Deep teal (#0f766e) to dark teal (#134e4a) gradient background sweeping from left to right. A warm amber (#f59e0b) diagonal accent stripe in the bottom right corner. Simple abstract watercolor-style white cell or bubble shapes floating gently in the background. Clean, modern, professional. Warm and hopeful feeling. No photos of people. No text, no words, no letters, no writing." "static/images/og-image.png"
```

**Step 3: Generate hero background**
```bash
node generate-image.js "Soft abstract watercolor-style background image 1920 by 800 pixels wide. Gentle flowing organic shapes in muted teal and off-white tones. Very subtle low-contrast design suitable as a background behind white text overlay. Calming, hopeful, medical-adjacent aesthetic. Suggests gentle cellular or fluid motion. No people, no text, no words, no letters, no writing." "static/images/hero-bg.png"
```

**Step 4: Generate book placeholder cover**
```bash
node generate-image.js "Friendly children's book cover illustration style. A small cheerful child silhouette standing inside a large glowing friendly body outline filled with tiny colorful cartoon helper characters (round, smiley, cell-like creatures). Warm teal and amber color palette. Soft rounded shapes, gentle lighting, age-appropriate and welcoming. Portrait orientation 400 by 500 pixels. No text, no words, no letters, no writing." "static/images/book-placeholder.png"
```

**Step 5: Verify all four files exist**
```bash
ls -lh static/images/*.png
```
Expected: 4 PNG files, each > 50KB

---

## Task 14: Convert images to WebP and generate favicons

**Step 1: Create convert-to-webp.js**
```js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const files = [
  { in: "static/images/logo-mark.png",       out: "static/images/logo-mark.webp",       q: 90 },
  { in: "static/images/og-image.png",         out: "static/images/og-image.webp",         q: 85 },
  { in: "static/images/hero-bg.png",           out: "static/images/hero-bg.webp",           q: 80 },
  { in: "static/images/book-placeholder.png", out: "static/images/book-placeholder.webp", q: 85 },
];

(async () => {
  for (const f of files) {
    if (!fs.existsSync(f.in)) { console.log(`SKIP (not found): ${f.in}`); continue; }
    await sharp(f.in).webp({ quality: f.q }).toFile(f.out);
    const size = (fs.statSync(f.out).size / 1024).toFixed(0);
    console.log(`✓ ${f.out} (${size} KB)`);
  }
})();
```

**Step 2: Run conversion**
```bash
node convert-to-webp.js
```

**Step 3: Update generate-favicons.js source path and run**

Edit `generate-favicons.js` — make sure `sourcePath` points to `"static/images/logo-mark.png"` and `outputDir` points to `"static/"`.

```bash
node generate-favicons.js
```

Expected: `static/favicon.ico`, `static/favicon-16x16.png`, `static/favicon-32x32.png`, `static/apple-touch-icon.png`, `static/android-chrome-192x192.png`, `static/android-chrome-512x512.png`

---

## Task 15: Write content — Homepage

**Files:**
- Create: `content/_index.md`

```markdown
---
title: "SJIAHelp — sJIA Resources for Families and Educators"
description: "A resource hub for families, educators, and advocates navigating systemic juvenile idiopathic arthritis (sJIA). Learn, find resources, and discover our children's book."
keywords: ["sJIA", "systemic juvenile idiopathic arthritis", "sJIA resources", "children's arthritis", "autoinflammatory disease kids"]
faq:
  - q: "What is sJIA?"
    a: "sJIA (systemic juvenile idiopathic arthritis) is a rare autoinflammatory condition affecting children. It causes inflammation in the joints and can impact other parts of the body including the heart, lungs, and eyes. Unlike infectious illness, sJIA cannot be passed from one person to another."
  - q: "Is sJIA contagious?"
    a: "No. sJIA is not contagious. It is an autoinflammatory condition, meaning it originates inside the immune system — not from a germ or virus. You cannot catch sJIA from a child who has it."
  - q: "What is a flare in sJIA?"
    a: "A flare is when a child's immune system becomes overactive, causing symptoms like fever, joint pain, stiffness, and fatigue even without an infection. Flares can start quickly, may last hours or days, and can come back after periods of feeling well."
---
```

---

## Task 16: Write content — About sJIA

**Files:**
- Create: `content/about-sjia/index.md`

```markdown
---
title: "What Is sJIA? Understanding Systemic Juvenile Idiopathic Arthritis"
description: "Learn what sJIA is, how it affects children, what causes flares, and how it is diagnosed and treated. A plain-language guide for families, educators, and advocates."
keywords: ["what is sJIA", "systemic juvenile idiopathic arthritis symptoms", "sJIA diagnosis", "sJIA flares", "autoinflammatory disease children"]
summary: "A plain-language guide to sJIA — what it is, how flares work, and how children are diagnosed and treated."
faq:
  - q: "How is sJIA different from other types of juvenile arthritis?"
    a: "sJIA (systemic JIA) is a subtype of juvenile idiopathic arthritis that affects the whole body, not just the joints. It can cause spiking fevers, rashes, and inflammation in organs like the heart and lungs — not seen in most other JIA subtypes. It is classified as an autoinflammatory rather than autoimmune condition."
  - q: "Why is sJIA hard to diagnose?"
    a: "sJIA is rare and its symptoms — recurring fever, joint pain, fatigue — overlap with many other conditions. There is no single definitive test. Diagnosis is made by ruling out other causes and observing the pattern of symptoms over time, which can take months."
  - q: "What triggers an sJIA flare?"
    a: "Common triggers include illness (like a cold or infection) and emotional stress or anxiety. However, many flares have no identifiable trigger, and flares are never the child's fault."
  - q: "Can sJIA go into remission?"
    a: "Yes. While there is no cure, treatments can bring about disease remission with few or no symptoms. Some children achieve sustained remission; others experience ongoing or recurring flares. Every child's course is different."
---

## What Is sJIA?

Systemic juvenile idiopathic arthritis (sJIA) is a rare autoinflammatory condition that affects children. It causes inflammation — pain, swelling, and redness — in the joints, but it can also impact other parts of the body including the muscles, heart, lungs, and eyes.

The word *systemic* means the condition affects the whole body, not just one area. The word *idiopathic* means the cause is not fully known. Doctors and researchers are still learning about sJIA every day.

## Inside the Body: The Helpers

Inside everyone's body is a team of helpers — the immune system. Their job is to find germs, trap them, and flush them out so we get better. When the helpers are doing their job, we might feel a fever, ache, or tiredness. That's normal.

In sJIA, the helpers get overactive. They begin working in places where there are no germs — no cold, no flu — but the body responds as though there are. This causes inflammation, pain, and fatigue even when a child is not sick with an infection.

## What Are Flares?

A **flare** is when the immune system overreacts and causes symptoms. During a flare, a child may experience:

- Fever (sometimes very high)
- Joint pain and stiffness, especially in the morning
- Fatigue or low energy
- Rash (a faint salmon-colored rash is common)
- Swollen lymph nodes

Flares can start quickly and may last a few hours or several days. For some children, symptoms are worst in the morning or evening. For others, flares last all day. Just because a child feels better in the afternoon does not mean they were not genuinely sick that morning.

**Flares are never the child's fault.** Even when a child does everything right — sleeps well, manages stress, stays healthy — flares can still happen.

## Diagnosis

sJIA is notoriously difficult to diagnose. Its symptoms — recurring fever, joint pain, fatigue — overlap with many other conditions. There is no single blood test or scan that confirms sJIA.

Diagnosis typically involves:
- Ruling out infections, cancer, and other inflammatory conditions
- Observing the pattern of symptoms over at least six weeks
- Blood tests to look at inflammatory markers (though these are not definitive)
- Evaluation by a pediatric rheumatologist

Many families wait months or years before receiving a diagnosis. If you suspect sJIA, ask for a referral to a **pediatric rheumatologist** — a specialist in childhood inflammatory conditions.

## Treatment

Treatment varies by child and may change over time. Common approaches include:

- **NSAIDs** (non-steroidal anti-inflammatory drugs) for mild symptoms
- **Corticosteroids** (like prednisone) to quickly reduce severe inflammation
- **Biologic medications** (like IL-1 or IL-6 inhibitors) that specifically target the overactive immune signals in sJIA
- **Regular monitoring** of eyes, heart, and lungs

Some medicines act quickly; others take weeks to show full effect. Some medications can temporarily change how a child looks or feels — for example, corticosteroids can cause facial puffiness. These effects are temporary and related to the medicine, not the disease.

## Living With sJIA

Living with sJIA means living with uncertainty. A child may feel well one day and face a difficult flare the next. School attendance, activities, and social plans may need to flex.

What children with sJIA need most is understanding — from family, teachers, friends, and medical teams. With the right support, children with sJIA can live full, active lives.

<div class="medical-disclaimer">
This page is for informational purposes only and is not a substitute for medical advice. Always consult your child's rheumatology care team for guidance specific to your situation.
</div>
```

---

## Task 17: Write content — Book

**Files:**
- Create: `content/book/index.md`

```markdown
---
title: "Corbin and the Helpers Inside His Body — A Children's Book About sJIA"
description: "A picture book for children, families, and educators that explains systemic juvenile idiopathic arthritis in simple, hopeful terms. Join the waitlist for our upcoming publication."
keywords: ["sJIA children's book", "juvenile arthritis book for kids", "explaining sJIA to children", "Corbin and the Helpers", "autoinflammatory disease picture book"]
summary: "A picture book that helps children, classmates, and educators understand sJIA — coming soon."
featured_image: "images/book-placeholder.webp"
faq:
  - q: "What age is this book for?"
    a: "The book is written for children approximately ages 5 to 10, but it is designed to be read and discussed with children of all ages, as well as teachers, school nurses, and classmates who want to understand what a friend with sJIA is experiencing."
  - q: "Why was this book written?"
    a: "When Corbin was diagnosed with sJIA in 2024, his family searched for a book to help explain his condition to classmates and teachers. No such book existed, so they wrote one — the book they needed but couldn't find."
  - q: "When will the book be available?"
    a: "The book is currently in pre-publication. Join the waitlist to be notified the moment it becomes available."
---

<span class="coming-soon-badge">Coming Soon</span>

## The book we needed didn't exist. So we wrote it.

When Corbin was diagnosed with systemic juvenile idiopathic arthritis in August 2024, his family was grateful to finally have answers. But answers were only the beginning.

When Corbin returned to school on high-dose steroids, the changes in his appearance were startling to classmates and even to adults — making an already difficult transition even harder. His family searched for a book to help explain what was happening. Something age-appropriate, honest, and hopeful.

They couldn't find one.

So they wrote the book they needed: *Corbin and the Helpers Inside His Body — A Story About sJIA*.

## About the Book

*Corbin and the Helpers Inside His Body* is a picture book for children ages 5 to 10. It tells the story of Corbin — a kid who loves video games, swimming, and the playground — and the overactive immune system helpers inside his body that sometimes cause trouble, even when there are no germs to fight.

The book covers:

- What the immune system does and how it's supposed to work
- Why sJIA causes symptoms even without an infection
- What a "flare" is and why it isn't the child's fault
- What a child with sJIA might experience at school and at home
- The superhero medical team helping to manage sJIA
- A message of empathy — that everyone has hard days others can't always see

The book is written for children, but it's equally valuable for teachers, school nurses, and classmates who want to understand what a friend with sJIA is going through.

## Join the Waitlist

Be the first to know when the book is available.

{{ partial "waitlist-form.html" (dict "context" "book") }}

## About the Author

*Written by a parent who needed this book and couldn't find it.*

This book was inspired by Corbin, diagnosed with sJIA at age 8. His family's experience — the hospital stays, the confusing symptoms, the medication side effects, the school challenges — became the foundation for a story that didn't yet exist.

*Corbin and the Helpers Inside His Body* was written so that no family has to face a classroom moment without the words to explain what's happening.
```

---

## Task 18: Write content — Resources

**Files:**
- Create: `content/resources/index.md`

```markdown
---
title: "sJIA Resources for Families, Educators, and Medical Professionals"
description: "Curated resources for navigating systemic juvenile idiopathic arthritis — medical organizations, patient advocacy groups, school support tools, and anti-inflammatory diet guidance."
keywords: ["sJIA resources", "juvenile arthritis resources", "CARRA sJIA", "Arthritis Foundation kids", "anti-inflammatory diet children", "sJIA school accommodations"]
summary: "Curated links to medical organizations, advocacy groups, school tools, and anti-inflammatory diet resources for families and educators."
faq:
  - q: "Where can I find a pediatric rheumatologist for sJIA?"
    a: "The Childhood Arthritis and Rheumatology Research Alliance (CARRA) and the American College of Rheumatology both provide physician finders. The Arthritis Foundation also offers support resources and can help connect families with specialists."
  - q: "Are there school accommodations available for a child with sJIA?"
    a: "Yes. Children with sJIA may qualify for a 504 plan or IEP accommodations. Common supports include modified attendance policies, rest breaks, elevator access, and flexibility for medical appointments. The Arthritis Foundation provides school resources to help families work with educators."
---

<div class="resource-grid">

<div class="resource-category">
<h3>Medical Organizations & Research</h3>
<ul>
  <li>
    <a href="https://carragroup.org" target="_blank" rel="noopener">CARRA — Childhood Arthritis & Rheumatology Research Alliance</a>
    <div class="resource-desc">Leading research organization for pediatric rheumatic diseases. Physician finder and clinical trial information.</div>
  </li>
  <li>
    <a href="https://www.rheumatology.org/I-Am-A/Patient-Caregiver/Diseases-Conditions/Juvenile-Idiopathic-Arthritis" target="_blank" rel="noopener">American College of Rheumatology — JIA Overview</a>
    <div class="resource-desc">Clinical overview of juvenile idiopathic arthritis subtypes including sJIA.</div>
  </li>
  <li>
    <a href="https://www.niams.nih.gov/health-topics/juvenile-arthritis" target="_blank" rel="noopener">NIH / NIAMS — Juvenile Arthritis</a>
    <div class="resource-desc">National Institute of Arthritis and Musculoskeletal and Skin Diseases — research updates and clinical information.</div>
  </li>
</ul>
</div>

<div class="resource-category">
<h3>Patient Advocacy & Support</h3>
<ul>
  <li>
    <a href="https://www.arthritis.org/diseases/juvenile-idiopathic-arthritis" target="_blank" rel="noopener">Arthritis Foundation — JIA & sJIA</a>
    <div class="resource-desc">Patient resources, community support, and advocacy for children and families living with arthritis.</div>
  </li>
  <li>
    <a href="https://sjiafoundation.org" target="_blank" rel="noopener">sJIA Foundation</a>
    <div class="resource-desc">Dedicated to improving outcomes for children with sJIA through research, education, and family support.</div>
  </li>
  <li>
    <a href="https://www.aarda.org" target="_blank" rel="noopener">AARDA — American Autoimmune Related Diseases Association</a>
    <div class="resource-desc">Broad advocacy for autoimmune and autoinflammatory disease awareness and research.</div>
  </li>
</ul>
</div>

<div class="resource-category">
<h3>School & Educator Resources</h3>
<ul>
  <li>
    <a href="https://www.arthritis.org/juvenile-arthritis/resources/school-success" target="_blank" rel="noopener">Arthritis Foundation — School Success Program</a>
    <div class="resource-desc">Guides for parents and teachers to support students with juvenile arthritis in school.</div>
  </li>
  <li>
    <a href="https://www.arthritis.org/juvenile-arthritis/resources/kids-get-arthritis-too" target="_blank" rel="noopener">Kids Get Arthritis Too</a>
    <div class="resource-desc">Resources specifically for children with arthritis and the families and educators who support them.</div>
  </li>
  <li>
    <a href="https://carragroup.org/patient-resources" target="_blank" rel="noopener">CARRA Patient & Family Resources</a>
    <div class="resource-desc">Educational materials for families navigating pediatric rheumatic disease diagnosis and treatment.</div>
  </li>
</ul>
</div>

<div class="resource-category">
<h3>Anti-Inflammatory Diet</h3>
<ul>
  <li>
    <a href="https://www.arthritis.org/health-wellness/healthy-living/nutrition/anti-inflammatory/the-ultimate-arthritis-diet" target="_blank" rel="noopener">Arthritis Foundation — The Ultimate Arthritis Diet</a>
    <div class="resource-desc">Evidence-based dietary guidance focused on reducing inflammation, including Mediterranean diet principles.</div>
  </li>
  <li>
    <a href="https://www.health.harvard.edu/staying-healthy/foods-that-fight-inflammation" target="_blank" rel="noopener">Harvard Health — Foods That Fight Inflammation</a>
    <div class="resource-desc">Overview of foods that support reduced inflammation — useful starting point for families.</div>
  </li>
  <li>
    <a href="https://www.arthritis.org/health-wellness/healthy-living/nutrition/healthy-eating/best-vegetables-for-arthritis" target="_blank" rel="noopener">Arthritis Foundation — Best Foods for Kids With Arthritis</a>
    <div class="resource-desc">Kid-friendly guidance on anti-inflammatory foods and meal ideas.</div>
  </li>
</ul>
</div>

</div>

<div class="medical-disclaimer">
Resource links are provided for informational purposes only. SJIAHelp does not endorse specific organizations or treatments. Always consult your child's rheumatology care team before making changes to diet, medication, or treatment.
</div>
```

---

## Task 19: Write content — Our Story

**Files:**
- Create: `content/our-story/index.md`

```markdown
---
title: "Our Story — Why We Built SJIAHelp"
description: "Corbin was diagnosed with sJIA in August 2024 at age 8. This is our family's story — and why we created SJIAHelp and the children's book for every family navigating this rare disease."
keywords: ["sJIA family story", "child diagnosed sJIA", "systemic juvenile idiopathic arthritis diagnosis story", "Corbin sJIA book"]
summary: "Corbin was diagnosed with sJIA in August 2024. This is our story — and why we built SJIAHelp."
faq:
  - q: "Who is Corbin?"
    a: "Corbin is an 8-year-old who loves video games, swimming, and playing on the playground. He was diagnosed with systemic juvenile idiopathic arthritis (sJIA) in August 2024 by a team at Johns Hopkins. His family created SJIAHelp and the children's book to help other families navigate the same difficult journey."
  - q: "Why did you create SJIAHelp?"
    a: "After Corbin's diagnosis, we discovered that there were very few resources designed to help explain sJIA to children, classmates, and educators. SJIAHelp is our effort to build the hub we wished had existed — a place where families, educators, and medical professionals can find clear, honest, hopeful information."
---

## This Is Corbin's Story

Corbin is 8 years old. He lives at the beach. He loves video games, swimming in the ocean, and playing on the playground.

In August 2024, Corbin was diagnosed with systemic juvenile idiopathic arthritis — sJIA.

We were incredibly lucky. We had an amazing team of doctors at Johns Hopkins who recognized what was happening quickly. Not all children with sJIA are that fortunate. Many families wait months or even years for a diagnosis — watching their child cycle through fevers, joint pain, and exhaustion without answers.

We were grateful for those answers. But diagnosis was only the beginning.

## What Came After

The months that followed involved hospital stays, missed school, insurance appeals for medication, and the anxiety of not knowing when the next flare would come — or which treatment would finally work.

When Corbin returned to school on high-dose corticosteroids, the changes in his appearance were startling to classmates and adults alike. His face was puffy. He looked different. He didn't always recognize himself in photos.

Making that transition harder was the fact that most people — including many adults — had never heard of sJIA. We struggled to explain what was happening in terms that were accurate but accessible.

## The Book We Couldn't Find

We searched for a children's book that could help explain sJIA to Corbin's classmates, his teachers, and to Corbin himself.

We couldn't find one.

So we wrote it.

*Corbin and the Helpers Inside His Body — A Story About sJIA* is the book we needed. It explains the immune system through the metaphor of "helpers" who sometimes get too excited. It validates the emotional experience of living with uncertainty. It asks for empathy — because everyone has hard days that others can't always see.

## Why SJIAHelp

SJIAHelp exists because the information is scattered, the awareness is low, and families navigating a new diagnosis deserve a clear starting point.

We are not doctors. We are a family that has lived this — the waiting rooms, the lab draws, the "I don't know how I'll feel tomorrow" conversations with an eight-year-old.

SJIAHelp is our small effort to make the path a little easier for the family that comes after us.

---

*Have a story to share or a resource to suggest? [Reach out.](mailto:hello@sjiahelp.com)*
```

---

## Task 20: Create Cloudflare Pages Function

**Files:**
- Create: `functions/api/subscribe.js`

```js
export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://sjiahelp.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const body = await context.request.json();
    const { email, firstName } = body;

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, message: "Valid email required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = context.env.MAILCHIMP_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: "Newsletter temporarily unavailable." }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Update listId and dc after creating the Mailchimp audience for sjiahelp.com
    const listId = "MAILCHIMP_LIST_ID_PLACEHOLDER";
    const dc     = "MAILCHIMP_DC_PLACEHOLDER";  // e.g. "us19" — found in your Mailchimp API key

    const memberData = {
      email_address: email,
      status: "subscribed",
    };

    if (firstName) {
      memberData.merge_fields = { FNAME: firstName };
    }

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "You're on the list! We'll be in touch." }),
        { status: 200, headers: corsHeaders }
      );
    }

    if (data.title === "Member Exists") {
      return new Response(
        JSON.stringify({ success: true, message: "You're already on the list — we'll be in touch!" }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong. Please try again." }),
      { status: 500, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error. Please try again later." }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://sjiahelp.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
```

**Note:** Replace `MAILCHIMP_LIST_ID_PLACEHOLDER` and `MAILCHIMP_DC_PLACEHOLDER` with values from your Mailchimp account after creating the sJIAHub audience list.

---

## Task 21: Test local build

**Step 1: Run Hugo dev server**
```bash
hugo server
```
Expected: Server running at http://localhost:1313, no errors.

**Step 2: Check each page loads**
- http://localhost:1313/ — hero, cards, book section
- http://localhost:1313/about-sjia/ — full article
- http://localhost:1313/book/ — book page with waitlist form
- http://localhost:1313/resources/ — resource grid
- http://localhost:1313/our-story/ — Corbin's story

**Step 3: Run production build**
```bash
hugo --minify
```
Expected: `public/` generated, 0 errors.

---

## Task 22: Create GitHub repo and push

**Step 1: Confirm active account is ShortiMcByte**
```bash
gh auth status
```
Expected: `ShortiMcByte` shows `Active account: true`

**Step 2: Create repo**
```bash
gh repo create sjiahub --public --description "SJIAHelp.com — Resources and book for families navigating sJIA"
```

**Step 3: Add remote and push**
```bash
git remote add origin https://github.com/ShortiMcByte/sjiahub.git
git add .
git commit -m "feat: initial SJIAHelp site with Congo theme, content, and Cloudflare Functions"
git push -u origin main
```

**Step 4: Verify**
```bash
gh repo view ShortiMcByte/sjiahub --web
```

---

## Post-Deploy Checklist (manual steps after Cloudflare Pages is configured)

- [ ] Set `MAILCHIMP_API_KEY` in Cloudflare Pages environment variables
- [ ] Update `listId` and `dc` in `functions/api/subscribe.js` with real Mailchimp audience values
- [ ] Set Hugo version in Cloudflare Pages: env var `HUGO_VERSION=0.155.3`
- [ ] Set build command: `hugo --minify`
- [ ] Set output directory: `public`
- [ ] Enable submodule cloning in Cloudflare Pages settings
- [ ] In Cloudflare Security > Bots: disable "AI Crawlers and Scrapers" blocking
- [ ] Disable Rocket Loader and Cloudflare Fonts in Cloudflare Speed settings
- [ ] Verify in Google Search Console (DNS TXT record) and submit sitemap
- [ ] Delete `preview.html` from root before or after initial deploy
