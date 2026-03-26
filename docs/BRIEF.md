# Project Brief — cornaciu.ro

## What This Project Does

Professional website and content management system for **Cabinet Avocat Cornaciu**, a Romanian law firm. The site serves as both a public-facing marketing presence and an internal content platform with AI-powered tools for article authoring, translation, and legal page management.

**Public site:** Homepage (hero, expertise areas, statistics, testimonials, featured articles, contact), blog with category filtering and pagination, legal pages (GDPR, Privacy Policy, Terms), multilingual support (RO/EN/BG), SEO with dynamic sitemap and JSON-LD structured data.

**Admin CMS:** Article CRUD with Markdown editor, category and testimonial management, site-wide UI text editor with per-locale overrides, legal page editor, audit log viewer, and AI-powered tools for image generation, article summarization, and translation.

---

## Who It's For

<!-- TODO: Fill in — e.g., the firm's clients (individuals, businesses?), geographic focus, primary practice areas -->

---

## Tech Stack & Architecture

| Layer         | Technology                                |
|---------------|-------------------------------------------|
| Framework     | SvelteKit 2 (Svelte 5)                   |
| Language      | TypeScript                                |
| Database      | PostgreSQL 15 + Drizzle ORM 0.45         |
| Auth          | Better Auth ~1.4 (email+password, Drizzle adapter) |
| Storage       | Cloudflare R2 (via AWS S3 SDK)           |
| AI — Images   | OpenAI `gpt-image-1`                     |
| AI — Text     | Anthropic `claude-sonnet-4-20250514`       |
| Markdown      | marked + isomorphic-dompurify            |
| Styling       | Vanilla CSS with custom properties        |
| Fonts         | Cormorant Garamond (serif) + Inter (sans) |
| Runtime       | Node.js ≥ 22.12                           |
| Package Mgr   | pnpm                                     |
| Dev Infra     | Docker Compose (PostgreSQL on port 5433)  |
| Adapter       | @sveltejs/adapter-node                    |

### Architecture

- **Monolith** — single SvelteKit app serving public pages, admin panel, and API
- **Server-side rendering** with SvelteKit's SSR; Node.js adapter for production
- **Route groups:** `(app)/[[lang]]/` for public pages with optional locale prefix; `admin/` for protected CMS; `api/` for backend endpoints
- **i18n:** File-based JSON translations (ro, en, bg) with DB-override layer via `siteText` table; admin edits override JSON defaults
- **Auth:** Session-based via Better Auth middleware in `hooks.server.ts`; admin layout guard redirects unauthenticated users
- **Media:** Uploads go to Cloudflare R2 with magic-byte MIME validation and 10MB limit
- **Audit:** Every admin mutation logged to `auditLog` table (24 event types across 8 entities)

---

## Key Data Models

### Content
- **article** — Multilingual blog posts (title, slug, Markdown content, excerpt, category FK, image URL, reading time, published/featured flags, lang, translationGroup UUID, edit history as JSON)
- **category** — Article categories (unique name)
- **testimonial** — Client quotes (quote, author name/title, star rating 1-5, published flag)

### CMS
- **siteText** — Per-locale UI text overrides (dot-notation key, locale, value, sourceHash for translation tracking)
- **siteTextHistory** — Version history for siteText entries (key, locale, old value, change type, timestamp)
- **legalPage** — Legal page Markdown content per slug (gdpr, termeni, confidentialitate) × locale (ro, en, bg)

### System
- **auditLog** — Action, entity, entityId, JSON details, userId, userEmail, timestamp
- **user / session / account / verification** — Better Auth tables

---

## External APIs & Services

| Service        | Purpose                    | Required? |
|----------------|----------------------------|-----------|
| PostgreSQL     | Primary database           | Yes       |
| Cloudflare R2  | Image/file storage (CDN)   | Optional — disables image upload |
| OpenAI API     | Article cover image generation | Optional — disables AI covers |
| Anthropic API  | Summarization, translation | Optional — disables AI text tools |

---

## Constraints & Non-Negotiables

<!-- TODO: Fill in — e.g., must stay on current stack, GDPR compliance requirements, performance budgets, hosting constraints, uptime requirements -->

---

## Out of Scope

<!-- TODO: Fill in — e.g., client portal, online payments, appointment booking, user registration, commenting system -->
