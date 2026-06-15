# RSI Flourishing Schools — Professional Development Platform

A production Next.js 15 platform for the RSI Flourishing Schools Professional Development Program: a public marketing site plus a role-based school PD workspace (applicant → school admin → teacher → team → RSI facilitator), backed by Supabase with row-level security and AI-assisted analysis, recommendations, and reflective coaching.

> **Status:** Scaffolding complete and verified. `tsc --noEmit` and `next build` both pass (49 routes). Several features intentionally ship as clearly-labeled demonstrations until live data is wired — see **[Known stubs](#known-stubs--honest-status)** below.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (CSS-first `@theme` token system) + custom design system
- **Supabase** (Postgres, Auth, Storage, RLS) via `@supabase/ssr`
- **framer-motion** for marketing motion
- **lucide-react** icons, **Radix** primitives
- **Anthropic Messages API** for AI features, with a deterministic mock fallback

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev
```

The public site and dashboards render **without** any environment variables (auth and persistence degrade gracefully to demo mode), so you can run `npm run dev` immediately.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | for auth/data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for auth/data | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | server writes | Service-role key (server-only; never exposed) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical site URL (auth redirects, OG) |
| `AI_PROVIDER_API_KEY` | optional | Anthropic API key — enables live AI; omit for mock mode |
| `AI_MODEL` | optional | Model id (default `claude-sonnet-4-6`) |

When `AI_PROVIDER_API_KEY` is absent, the analyze / recommend / coach features return deterministic, clearly-labeled demonstration output drawn only from the curated resource library. **They never fabricate research citations.**

## Database

SQL lives in `db/`:

- `db/migrations/0001_init.sql` — 14 tables, enums, RLS helper functions (`is_platform_admin`, `is_rsi_facilitator`, `is_org_member`, `is_org_admin`), the `handle_new_user` trigger, all RLS policies, and 4 storage buckets (`school-documents` private; `resource-files`, `profile-avatars`, `public-assets` public).
- `db/seed/seed.sql` — demonstration data: one organization, four users (created via `auth.users` so the new-user trigger provisions profiles, which are then promoted to their roles), curated resources, growth areas, PD sessions, intervention plans, reflections, forum threads, and a facilitator note.

Apply with the Supabase SQL editor, the Supabase MCP, or the CLI. After signup, promote your own account:

```sql
update profiles set role = 'platform_admin' where email = 'you@example.com';
```

## Project structure

```
app/
  (public)/        Marketing site (home, about, research, impact, PD, resources, apply, legal)
  (auth)/          Login / signup (Supabase email auth, Suspense-wrapped)
  (dashboard)/     Role-aware workspace (applicant, admin, teacher, team, facilitator)
  api/             AI routes (analyze-school, recommend-resources, coach) + applications
components/        brand, marketing, dashboard, forms, resources, ai, ui (primitives)
lib/
  ai/              provider + analyze-school + recommend-resources + coach (mock fallback)
  auth/            roles + dashboard path routing
  content/         curated resources, navigation, home, research, blog, demo, dashboard-nav
  supabase/        server / client / middleware helpers (null-safe without env)
  validation/      Zod application schema
db/                migrations + seed
types/             shared types + domain constants
```

## Responsible AI

AI output is positioned as decision-support for a human facilitator, never as assessment, diagnosis, or clinical/legal/crisis advice. Recommendations are restricted to the curated library; any model-suggested resource slug not in that library is discarded before display. All research references in seed and curated content are `Placeholder citation` and must be replaced with verified sources before production.

## Known stubs & honest status

- **Demo data everywhere in dashboards.** Dashboard pages render content from `lib/content/demo.ts`, clearly labeled. Wiring them to live Supabase queries is the next step.
- **In-session-only persistence.** The reflection journal and the team action board keep changes in React state for the session; they do not yet write to Supabase.
- **Placeholder citations.** No real research is cited anywhere.
- **AI mock fallback** runs unless `AI_PROVIDER_API_KEY` is set.
- **Application submission** validates and (when authenticated + configured) inserts into `applications`; otherwise it returns a demo-safe success.
- **Seeded demo users** exist to populate the data model; create your own admin via signup and promote it.

## Verification

```bash
npx tsc --noEmit   # type check (passes)
npm run build      # production build (passes — 49 routes)
```
