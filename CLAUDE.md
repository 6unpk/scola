# Scola — Project Overview

A sauna and jjimjilbang discovery platform. Three sub-projects:

```
billvot/
├── scola-api/          # Rails 7.2 API + ActiveAdmin
├── scola-app/          # Next.js 16 frontend
└── navermap-scraper/   # Playwright-based Naver Maps scraper
```

---

## scola-app (Next.js)

**Package manager: pnpm (required)**
- Never use `npm install` — this project is based on `pnpm-lock.yaml`
- Add packages: `pnpm add <package>`
- Run: `pnpm dev` / `pnpm build`

**Stack**
- Next.js 16.2.2, React 19, TypeScript
- styled-components (theme system in use)
- Zustand (auth state — localStorage persist)
- Axios (API client — `src/lib/api.ts`)
- date-fns, lucide-react, @remixicon/react, motion

**Theme colors (`src/styles/theme.ts`)**
- No `border` or `muted` keys — use the gray scale directly:
  - Borders: `theme.colors.gray200`
  - Secondary text: `theme.colors.gray500`
  - Light background: `theme.colors.gray50`
- Primary: `#A62121` (red)

**API client**
- `src/lib/api.ts` — baseURL from `NEXT_PUBLIC_API_URL` env var (default: `http://localhost:3000`)
- JWT token is automatically injected into the Authorization header from the Zustand store

**Auth**
- `useAuthStore` (`src/store/authStore.ts`) — exposes `token`, `user`, `logout`, etc.
- Auto-logout on 401 response

---

## scola-api (Rails)

**Ruby version: 3.1.4** (via chruby, see `.ruby-version`)
- Confirm `chruby ruby-3.1.4` before running
- Always use `bundle exec rails ...`

**Stack**
- Rails 7.2, PostgreSQL
- Devise + devise-jwt (JWT authentication)
- ActiveAdmin (admin UI at `/admin`)
- Kaminari (pagination)

**Database**
- Connected via `DATABASE_URL` env var (`scola-api/.env`)
- Migration version must be `ActiveRecord::Migration[7.2]` — using `[8.0]` throws an error

**JWT auth gotcha**
- Tokens are signed with the `DEVISE_JWT_SECRET_KEY` env var
- `base_controller.rb` decodes using `ENV.fetch('DEVISE_JWT_SECRET_KEY') { Rails.application.credentials.secret_key_base }`
- If these two values differ in production, authentication silently fails — always keep them in sync

**Controller structure**
- Public API: `PlacesController`, `PostsController` (no auth)
- User API: under `api/v1/` — inherit from `BaseController`, which implements JWT decoding directly
- Admin session: `admin/sessions` (browser-based Devise, separate from JWT)

**Rake tasks**
```bash
bundle exec rails places:auto_categorize            # keyword-based category auto-mapping
bundle exec rails places:import_enriched            # import enriched_results.json into DB
DRY_RUN=1 bundle exec rails places:auto_categorize  # preview changes without writing
```

**Sprockets gotcha**
- If `app/assets/images/` doesn't exist, remove `link_tree ../images` from the manifest or deployment will error
- `app/assets/config/manifest.js` should only contain `//= link_directory ../stylesheets .css`

---

## navermap-scraper (Python)

**Package manager: uv**
- Run as `uv run enrich.py` — handles virtualenv automatically
- Running `python enrich.py` directly will fail with missing module errors (dotenv, etc.)

**Key files**
- `scraper.py` — collects place listings from Naver Maps search
- `enrich.py` — generates place profiles and review summaries via Gemini API
- `.env` — stores `GEMINI_API_KEY`

**Gemini model**: `gemini-2.5-flash-lite` (`gemini-2.0-flash-lite` is unavailable to new users)

**Naver review scraping**
- Navigating directly to `/review/visitor` redirects to the map homepage
- Always navigate to `https://map.naver.com/p/entry/place/{id}` first, then click the review tab

---

## Deployment

- scola-api: Railway — requires `DATABASE_URL` and `DEVISE_JWT_SECRET_KEY` env vars
- scola-app: Vercel — requires `NEXT_PUBLIC_API_URL` pointing to the production API
