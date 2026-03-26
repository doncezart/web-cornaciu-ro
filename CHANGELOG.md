# Changelog

All notable changes to the **cornaciu.ro** project are documented in this file.

---

## v1.9 — 2025-07-17

### Added — CMS Rework
- **Page tabs** in admin content editor — content organized into Pagina Principală, Despre Mine, Articole, Global tabs
- **`siteConfig` DB table** — key-value JSON store for structured site configuration (expertise order, contact entries)
- **Expertise drag-and-drop reorder** — admin panel to rearrange the order of practice area cards on the homepage
- **Dynamic contact entries** — add, remove, and edit contact info (address, phone, email, custom) from the admin, stored in `siteConfig`
- **Friendly field labels** — Romanian human-readable labels for common i18n keys in the content editor (e.g. `results.casesValue` → "📊 Număr cazuri")
- **Stat value i18n keys** — `results.casesValue`, `results.rateValue`, `results.yearsValue`, `results.recoveredValue` in all 3 locale files

### Changed
- `Hero.svelte` and `Results.svelte` — stat numbers now read from i18n keys instead of being hardcoded
- `ExpertiseGrid.svelte` — accepts `expertiseOrder` prop for configurable card order
- `ContactSection.svelte` — refactored to accept dynamic `contactEntries` prop with fallback defaults
- Homepage `+page.server.ts` — loads `siteConfig` rows and passes `expertiseOrder` + `contactEntries` to page
- Admin `continut/+page.server.ts` — fully rewritten with page definitions, section grouping, field metadata, and new `saveExpertiseOrder`/`saveContactEntries` actions
- Admin `continut/+page.svelte` — complete UI rewrite with page tabs, section accordions, expertise reorder panel, contact entries editor, and history/reset per field

---

## v1.8 — 2026-03-26

### Added — About Me Page & Navigation
- New `/despre` route — dedicated "About Me" page with biography, professional philosophy, credentials, and consultation CTA
- i18n support for the about page in all 3 languages (RO, EN, BG) via `aboutPage.*` keys
- Contrasting CTA card in the Expertise Grid section (replaces 6th card with dark-background link to `/despre`)
- "Learn More" CTA button in the About section linking to the `/despre` page

### Changed
- ExpertiseGrid now shows 5 practice areas + 1 CTA card (was 6 practice areas)
- About component imports `localePath` for locale-aware button link

---

## v1.7 — 2026-03-26

### Added — Project Management
- `docs/BRIEF.md` — project brief with tech stack, architecture, data models, and external APIs (inferred from codebase)
- `docs/DECISIONS.md` — 8 architectural decisions documented (CSS approach, Better Auth, Drizzle ORM, R2 storage, i18n with DB overrides, AI provider split, Markdown storage, audit logging)
- `docs/CONVENTIONS.md` — coding standards, naming conventions, folder structure, approved libraries, and off-limits rules
- `TASKS.md` — work queue with In Progress / Up Next / Backlog sections
- `.github/copilot-instructions.md` — AI assistant context framework (session protocol, reference files, behavior rules)

### Changed
- Restructured `CHANGELOG.md` to use versioned headings (`v1.X — date`) matching Git commit tags instead of date-only headings
- Consolidated entries that shipped in the same commit under a single version
- Added retroactive entries for v1.0–v1.4 (initial release and deployment fixes)

---

## v1.6.1 — 2026-03-23

### Fixed
- Regenerated `pnpm-lock.yaml` to match dependency changes

---

## v1.6 — 2026-03-23

### Added — Audit Log System
- `audit_log` database table — tracks every admin action with action type, entity, entity ID, JSON details, user ID/email, and timestamp
- `audit()` helper function (`src/lib/server/audit.ts`) for consistent logging across all endpoints
- **Logs** admin page (`/admin/logs`) — paginated table with color-coded entity badges, Romanian labels, entity filter dropdown, and date formatting
- "Logs" link added to admin sidebar navigation
- **24 events tracked** across 8 entity types:
  - **Article** (9): create, update, delete, togglePublish, toggleFeatured, translation.create, translation.update, translation.delete, translation.togglePublish
  - **Category** (3): create, update, delete
  - **Testimonial** (4): create, edit, delete, togglePublish
  - **Content** (4): save (with updated/reset key lists), reset, translate (with field count), restore
  - **Legal** (2): save, translate
  - **AI** (3): generateImage, translateArticle, summarize
  - **Upload** (1): image (with filename, type, size, URL)
  - **Auth** (1): signOut

### Added — Legal Page Editor
- **Legal pages admin** (`/admin/legal`) — edit Privacy Policy, GDPR Compliance, and Terms & Conditions directly from the admin panel
- Markdown editor using the existing `MarkdownEditor` component (toolbar, preview, image upload)
- Page tabs and locale picker for switching between 3 pages × 3 languages (RO, EN, BG)
- **AI translation** — one-click translate any legal page from Romanian to English or Bulgarian via Anthropic Claude, preserving Markdown structure
- `legal_page` database table — stores Markdown content per slug and locale
- Seed script (`scripts/seed-legal.mjs`) — pre-populates all 9 page/locale combinations from the original hardcoded HTML
- Public legal pages now load content from the database, with Markdown parsed to sanitized HTML via `marked` + `DOMPurify`
- **2 audit events** added: `legal.save` and `legal.translate` — tracked in the logs page with indigo badge

### Added — Version History for Site Text
- `siteTextHistory` database table — automatically archives every previous value before it is overwritten, deleted, translated, or restored
- History entries store: key, locale, old value, source hash, change type (`edit` / `delete` / `translate` / `restore`), and timestamp
- Per-field history counter badge (🕓) in the content editor — click to expand and view all previous versions
- One-click **Restaurează** button to restore any previous version, with the current value archived first
- History actions: `history` (fetch per-field history, last 20 entries) and `restore` (restore a specific version by ID)
- All mutation actions (`save`, `reset`, `translate`) now archive the old value before making changes

### Fixed — Pending Translation Counter
- Translation counter no longer counts fields where the Romanian text is still at its JSON default
- Only fields with admin-edited RO overrides are counted as needing translation to EN/BG

### Security — Hardening
- R2 upload: file extension whitelist — only `jpg`, `jpeg`, `png`, `webp`, `gif`, `avif` accepted
- Cookie: `secure: true` on locale preference cookie
- `.env.example`: added all required environment variables (R2, Anthropic, OpenAI)

---

## v1.5 — 2026-03-22

### Added — Admin Site Content Editor
- **Content Editor** (`/admin/continut`) — admin can edit every UI text on the public site, grouped by section (hero, expertise, footer, etc.), per locale, without touching code
- `siteText` database table to store per-locale text overrides, with `source_hash` column for translation tracking
- i18n override layer: `createT(locale, overrides?)` checks DB values first, then falls back to JSON defaults
- All public pages and layout wired to load and apply DB overrides
- "Conținut Site" link added to admin sidebar

### Added — AI Translate for Site Text
- "Traducere AI" button on the content editor for EN/BG locales, batch-translates all pending fields via Anthropic Claude
- Smart translation tracking: stores MD5 hash of the Romanian source text alongside each translation
  - Only translates fields where the RO text was customized via admin
  - Re-translates when the RO source changes (stale hash)
  - Never overwrites manually edited translations (`source_hash = null`)
- Per-field "AI" badge and blue left border for auto-translated entries
- Pending translation counter in the translation bar

### Added — Documentation
- Comprehensive `README.md` replacing the default SvelteKit boilerplate
- `STYLE_GUIDE.md` with writing guidelines for Romanian legal website text (based on analysis of ea-avocat.ro and piperea.ro)
- `CHANGELOG.md` (this file)

---

## v1.4 — 2026-03-16

### Fixed
- Added `@sveltejs/adapter-node` to `pnpm-lock.yaml` (was missing after adapter switch)

---

## v1.3 — 2026-03-16

### Changed
- Added `engines.node >= 22.12.0` requirement to `package.json`

---

## v1.2 — 2026-03-16

### Fixed
- Removed unnecessary `pnpm-workspace.yaml`

---

## v1.1 — 2026-03-16

### Changed
- Switched SvelteKit adapter from `adapter-auto` to `adapter-node` for production deployment

---

## v1.0 — 2026-03-16

### Added — Initial Release
- **Public website** — homepage with hero, expertise grid (6 practice areas), results/statistics, about section, client testimonials, featured articles, and contact section with office address
- **Blog system** — article listing with pagination and category filters, individual article pages with Markdown rendering, related articles, and cross-language translation links
- **Multilingual support** — Romanian (default, no URL prefix), English (`/en/...`), and Bulgarian (`/bg/...`) with full i18n via JSON translation files
- **Legal pages** — Privacy Policy, Terms & Conditions, and GDPR compliance in all three languages (hardcoded HTML)
- **SEO** — dynamic XML sitemap, per-page meta tags via reusable `<Seo>` component with JSON-LD structured data (`LegalService`)
- **Cookie consent** banner for GDPR compliance
- **Admin panel** (`/admin`) — protected by session-based auth (email + password via Better Auth)
  - **Dashboard** — article/testimonial/category counts, articles per category breakdown
  - **Articles** — full CRUD, publish/unpublish, feature/unfeature, Markdown editor with live preview and formatting toolbar, image uploads to Cloudflare R2, edit history tracking, translation management across languages via `translationGroup` UUID
  - **Categories** — create, rename, delete with referential integrity checks
  - **Testimonials** — create, edit, delete, publish/unpublish, star ratings (1–5)
- **API endpoints** (admin-only):
  - `POST /api/upload` — file upload to Cloudflare R2 with MIME type and magic-byte validation (10 MB limit)
  - `POST /api/generate-image` — AI cover image generation via OpenAI `gpt-image-1`, styled to match site identity, uploaded to R2
  - `POST /api/summarize` — article excerpt generation via Anthropic Claude
  - `POST /api/translate` — full article translation (title, excerpt, content) between RO/EN/BG via Anthropic Claude
- **Authentication** — Better Auth with Drizzle adapter, email + password, session-based with HTTP-only secure cookies
- **Database** — PostgreSQL with Drizzle ORM; tables: `article`, `category`, `testimonial`, `user`, `session`, `account`, `verification`
- **Infrastructure** — Docker Compose for local PostgreSQL, `seed-admin.ts` script for initial admin user
- **Design** — vanilla CSS with custom properties, Cormorant Garamond (serif) + Inter (sans) fonts, scroll-triggered reveal animations, responsive layout
