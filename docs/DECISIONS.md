# Architectural Decisions — cornaciu.ro

---

### 1. Vanilla CSS over a CSS framework

**Decision:** Use plain CSS with custom properties instead of Tailwind, UnoCSS, or similar utility frameworks.

**Why:** The site has a distinct visual identity (Cormorant Garamond serif + Inter sans, warm legal palette) that benefits from hand-crafted styles. The component count is modest (~13), so a utility framework adds overhead without proportional benefit.

**Alternatives considered:** Tailwind CSS, Open Props.

**Date:** Project inception (pre-changelog).

---

### 2. Better Auth for authentication

**Decision:** Use Better Auth with Drizzle adapter for email+password session-based auth.

**Why:** Lightweight, integrates natively with SvelteKit hooks and Drizzle ORM, no external auth service dependency. Single admin user model — no need for OAuth or multi-provider flows.

**Alternatives considered:** Lucia Auth (deprecated), Auth.js, custom session management.

**Date:** Project inception.

---

### 3. Drizzle ORM over Prisma

**Decision:** Use Drizzle ORM with postgres.js driver.

**Why:** Type-safe schema-as-code, lightweight (no binary engine), excellent SvelteKit integration, supports push-based schema sync for rapid iteration and migration-based workflow for production.

**Alternatives considered:** Prisma, Kysely, raw SQL.

**Date:** Project inception.

---

### 4. Cloudflare R2 for media storage

**Decision:** Store uploaded images on Cloudflare R2 via the AWS S3 SDK.

**Why:** S3-compatible API with zero egress fees. Public bucket URL (`cdn.cornaciu.ro`) for direct image serving. No need for a separate CDN layer.

**Alternatives considered:** Local filesystem, AWS S3, Cloudflare Images.

**Date:** Project inception.

---

### 5. File-based i18n with DB override layer

**Decision:** Base translations live in JSON files (`ro.json`, `en.json`, `bg.json`). Admin can override any key per locale via the `siteText` table. `createT()` merges DB overrides on top of JSON defaults.

**Why:** JSON files provide a fast, versionable baseline. DB overrides let non-developers edit UI text without code deploys. Source-hash tracking prevents stale translations.

**Alternatives considered:** Pure DB translations, paraglide-js, i18next.

**Date:** 2026-03-22.

---

### 6. OpenAI for images, Anthropic for text

**Decision:** Use OpenAI's `gpt-image-1` model for cover art generation and Anthropic's `claude-sonnet-4-20250514` for summarization and translation.

**Why:** Best-in-class for each modality at time of implementation. Image generation needs DALL-E-quality output; text tasks need Claude's long-context and instruction-following for legal-grade translation.

**Alternatives considered:** Using a single provider for both, Stability AI for images.

**Date:** Project inception.

---

### 7. Markdown for content storage

**Decision:** Store article and legal page content as raw Markdown in the database. Parse to HTML on the server at request time using `marked` + `DOMPurify`.

**Why:** Markdown is portable, diffable, and familiar. Server-side parsing with sanitization prevents XSS. No need for a rich-text WYSIWYG storage format.

**Alternatives considered:** HTML storage, ProseMirror/TipTap JSON, block-based editor (editor.js).

**Date:** Project inception.

---

### 8. Comprehensive audit logging

**Decision:** Log every admin mutation to an `auditLog` table with action, entity, details (JSON), and user attribution.

**Why:** Accountability and traceability for a professional law firm site. Enables rollback investigation and admin activity monitoring.

**Alternatives considered:** File-based logging, external logging service.

**Date:** 2026-03-23.

---

<!-- Template for new decisions:

### N. Decision title

**Decision:**
**Why:**
**Alternatives considered:**
**Date:**

-->
