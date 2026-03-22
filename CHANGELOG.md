# Changelog

All notable changes to the **cornaciu.ro** project are documented in this file.

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
