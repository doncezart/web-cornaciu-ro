# Cornaciu Law Office — cornaciu.ro

Professional website for **Cabinet Avocat Cornaciu**, a Romanian law firm. Built with SvelteKit 2, featuring a multilingual public site, an admin CMS with AI-powered content tools, and a blog system.

## Features

### Public Website
- **Homepage** with hero section, areas of expertise, results/statistics, about the firm, client testimonials, latest articles, and a contact section
- **Blog** — paginated article listing with category filters, individual article pages with Markdown rendering, related articles, and cross-language translation links
- **Multilingual** — Romanian (default, no URL prefix), English (`/en/...`), and Bulgarian (`/bg/...`) with full i18n for all UI strings
- **Legal pages** — Privacy Policy, Terms & Conditions, and GDPR compliance pages in all three languages
- **SEO** — dynamic XML sitemap, per-page meta tags via a reusable `<Seo>` component
- **Cookie consent** banner
- **Responsive** design with scroll-triggered animations

### Admin Panel (`/admin`)
- Protected by session-based authentication (email + password via [Better Auth](https://www.better-auth.com/))
- **Dashboard** — article/testimonial/category counts, articles per category breakdown, quick actions
- **Articles** — full CRUD, publish/unpublish, feature/unfeature, markdown editor with live preview, image uploads, edit history tracking
- **Categories** — create, rename, delete (with referential integrity checks)
- **Testimonials** — create, edit, delete, publish/unpublish, star ratings
- **Site Content Editor** — edit any UI text on the public site directly from the admin panel, grouped by section (hero, expertise, footer, etc.), per-locale, with override tracking and reset-to-default
- **Legal Page Editor** — edit Privacy Policy, GDPR, and Terms & Conditions pages in Markdown with live preview, per-locale (RO/EN/BG), with one-click AI translation via Anthropic Claude
- **Audit Log** (`/admin/logs`) — tracks every admin action (articles, categories, testimonials, content, legal pages, AI, uploads, auth) with entity badges, details, user attribution, filtering, and pagination

### AI-Powered Tools (admin only)
- **Cover image generation** — generates article cover art via OpenAI image API, styled to match the site's visual identity, and uploads to Cloudflare R2
- **Article summarization** — generates excerpt/summary using Anthropic Claude
- **Article translation** — translates title, excerpt, and content between Romanian, English, and Bulgarian using Anthropic Claude, and links translations via a `translationGroup` field
- **Site text translation** — batch-translates admin-edited UI text to EN/BG using Claude; uses source-hash tracking to only translate fields where the Romanian source changed, and never overwrites manually edited translations
- **Legal page translation** — translates legal pages from Romanian to English/Bulgarian using Claude, preserving Markdown formatting and professional legal tone

### Infrastructure
- **Database** — PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **File storage** — Cloudflare R2 (S3-compatible) for images with magic-byte validation and size limits
- **Auth** — [Better Auth](https://www.better-auth.com/) with Drizzle adapter
- **Deployment** — Node.js adapter, Docker Compose for local development database

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | SvelteKit 2 (Svelte 5)             |
| Language    | TypeScript                          |
| Database    | PostgreSQL + Drizzle ORM            |
| Auth        | Better Auth                         |
| Storage     | Cloudflare R2 (AWS S3 SDK)          |
| AI          | OpenAI (images), Anthropic (text)   |
| Markdown    | marked + isomorphic-dompurify       |
| Styling     | Vanilla CSS with custom properties  |
| Fonts       | Cormorant Garamond + Inter          |
| Runtime     | Node.js ≥ 22.12                     |
| Package Mgr | pnpm                                |

## Project Structure

```
src/
├── app.css                  # Global styles & CSS variables
├── app.html                 # HTML shell
├── hooks.server.ts          # Auth session + locale detection
├── lib/
│   ├── components/          # Svelte components (Nav, Hero, Footer, etc.)
│   ├── i18n/                # Translation files (ro.json, en.json, bg.json)
│   ├── server/
│   │   ├── audit.ts         # Audit log helper
│   │   ├── auth.ts          # Better Auth config
│   │   ├── r2.ts            # Cloudflare R2 upload helpers
│   │   └── db/
│   │       ├── index.ts     # Drizzle client
│   │       ├── schema.ts    # Article, Testimonial, Category tables
│   │       └── auth.schema.ts  # User, Session, Account tables
│   └── utils/
│       └── slugify.ts       # Slug generation (Latin + Cyrillic)
├── routes/
│   ├── (app)/[[lang]]/      # Public pages with optional locale prefix
│   │   ├── +page.svelte     # Homepage
│   │   ├── articole/        # Blog listing + article detail pages
│   │   ├── confidentialitate/  # Privacy Policy
│   │   ├── termeni/         # Terms & Conditions
│   │   └── gdpr/            # GDPR Compliance
│   ├── admin/               # Protected admin panel
│   │   ├── articole/        # Article management (list, create, edit)
│   │   ├── categorii/       # Category management
│   │   ├── continut/        # Site content/text editor with AI translate
│   │   ├── legal/           # Legal page editor with AI translate
│   │   ├── logs/            # Audit log viewer
│   │   └── testimoniale/    # Testimonial management
│   ├── api/                 # API endpoints
│   │   ├── generate-image/  # AI cover image generation
│   │   ├── summarize/       # AI article summarization
│   │   ├── translate/       # AI article translation
│   │   └── upload/          # File upload to R2
│   ├── login/               # Login page
│   └── sitemap.xml/         # Dynamic sitemap
scripts/
└── seed-admin.ts            # Seed initial admin user
```

## Getting Started

### Prerequisites
- Node.js ≥ 22.12
- pnpm
- Docker (for local PostgreSQL)

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Copy environment file and fill in values
cp .env.example .env

# Push database schema
pnpm db:push

# Seed an admin user
pnpm tsx scripts/seed-admin.ts

# Start dev server
pnpm dev
```

The app runs at `http://localhost:6969` by default.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ORIGIN` | Public site URL (e.g. `https://cornaciu.ro`) |
| `BETTER_AUTH_SECRET` | Auth secret key (32+ chars, high entropy) |
| `OPENAI_API_KEY` | OpenAI API key (for cover image generation) |
| `ANTHROPIC_API_KEY` | Anthropic API key (for summarization & translation) |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | R2 public bucket URL |

AI and R2 features are optional — the site works without them but admin AI tools and image uploads will be unavailable.

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (DB GUI) |
| `pnpm check` | Run svelte-check |

## Database Schema

**article** — Blog posts with multilingual support, markdown content, categories, featured/published flags, reading time, edit history, and translation grouping

**category** — Article categories (unique names)

**testimonial** — Client testimonials with author info, quotes, and star ratings

**legalPage** — Legal page content in Markdown, per slug (confidentialitate, gdpr, termeni) and locale

**siteText** — Per-locale UI text overrides with source-hash tracking for smart AI re-translation

**siteTextHistory** — Version history for site text fields, storing previous values before edits, deletes, translations, or restores

**auditLog** — Admin activity log with action type, entity, details (JSON), user attribution, and timestamps

**user / session / account / verification** — Better Auth authentication tables

## License

Private — All rights reserved.
