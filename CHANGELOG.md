# Changelog

All notable changes to the **cornaciu.ro** project are documented in this file.

---

## 2026-03-23 (2)

### Added — Legal Page Editor
- **Legal pages admin** (`/admin/legal`) — edit Privacy Policy, GDPR Compliance, and Terms & Conditions directly from the admin panel
- Markdown editor using the existing `MarkdownEditor` component (toolbar, preview, image upload)
- Page tabs and locale picker for switching between 3 pages × 3 languages (RO, EN, BG)
- **AI translation** — one-click translate any legal page from Romanian to English or Bulgarian via Anthropic Claude, preserving Markdown structure
- `legal_page` database table — stores Markdown content per slug and locale
- Seed script (`scripts/seed-legal.mjs`) — pre-populates all 9 page/locale combinations from the original hardcoded HTML
- Public legal pages now load content from the database, with Markdown parsed to sanitized HTML via `marked` + `DOMPurify`
- **2 audit events** added: `legal.save` and `legal.translate` — tracked in the logs page with indigo badge

---

## 2026-03-23

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

### Security — Hardening
- R2 upload: file extension whitelist — only `jpg`, `jpeg`, `png`, `webp`, `gif`, `avif` accepted
- Cookie: `secure: true` on locale preference cookie
- `.env.example`: added all required environment variables (R2, Anthropic, OpenAI)

---

## 2026-03-22 (2)

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

---

## 2026-03-22

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
