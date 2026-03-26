# Coding Conventions — cornaciu.ro

## Language & Runtime

- **TypeScript** — strict mode, all source files in `src/`
- **Node.js ≥ 22.12** — runtime for both dev and production
- **pnpm** — package manager (lockfile committed)

## Formatting & Style

- SvelteKit default formatting (no Prettier/ESLint config committed — follow existing file style)
- CSS: vanilla with custom properties defined in `src/app.css`
- SQL/schema: Drizzle ORM schema-as-code in `src/lib/server/db/`
- Markdown content stored raw in DB, parsed server-side with `marked` + `DOMPurify`

## Naming Conventions

- **Files:** kebab-case for routes and scripts, camelCase for lib modules (`slugify.ts`, `auth.ts`)
- **Components:** PascalCase (`.svelte` files in `src/lib/components/`)
- **Database tables:** camelCase in Drizzle schema (`siteText`, `auditLog`, `legalPage`)
- **DB columns:** camelCase (Drizzle maps to snake_case in SQL)
- **Routes:** Romanian names for public pages (`articole`, `confidentialitate`, `termeni`, `categorii`, `testimoniale`, `continut`)
- **i18n keys:** dot-notation (`nav.about`, `hero.title`, `contact.phone`)
- **API endpoints:** English (`/api/upload`, `/api/generate-image`, `/api/summarize`, `/api/translate`)

## Folder Structure

```
src/
├── app.css                 # Global styles & CSS variables
├── app.html                # HTML shell
├── hooks.server.ts         # Auth + locale middleware
├── lib/
│   ├── actions/            # Svelte use:action directives
│   ├── assets/             # Static assets imported by components
│   ├── components/         # Reusable Svelte components
│   ├── i18n/               # Translation JSON files + i18n helpers
│   ├── server/             # Server-only code
│   │   ├── audit.ts        # Audit log helper
│   │   ├── auth.ts         # Better Auth config
│   │   ├── r2.ts           # R2 upload helpers
│   │   └── db/             # Drizzle client + schema
│   └── utils/              # Shared utilities (slugify, etc.)
├── routes/
│   ├── (app)/[[lang]]/     # Public pages (locale-prefixed)
│   ├── admin/              # Protected admin CMS
│   ├── api/                # REST-style API endpoints
│   ├── login/              # Auth page
│   └── sitemap.xml/        # Dynamic sitemap
scripts/                    # One-off scripts (seed-admin, seed-legal)
docs/                       # Project documentation
```

## Approved Libraries

| Library | Purpose |
|---------|---------|
| svelte, @sveltejs/kit, @sveltejs/adapter-node | Framework & build |
| drizzle-orm, drizzle-kit, postgres | Database ORM & driver |
| better-auth | Authentication |
| @aws-sdk/client-s3 | Cloudflare R2 uploads |
| openai | Cover image generation |
| @anthropic-ai/sdk | Text summarization & translation |
| marked | Markdown → HTML parsing |
| isomorphic-dompurify | HTML sanitization |
| vite | Build tool (via SvelteKit) |

## Off-Limits

- No CSS frameworks (Tailwind, Bootstrap, etc.) — use vanilla CSS with custom properties
- No client-side routing libraries — use SvelteKit's built-in router
- No ORMs other than Drizzle
- No external auth services (Auth0, Clerk, etc.) — Better Auth handles everything
- No rich-text editors replacing Markdown — content stays as Markdown source
