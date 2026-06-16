# RSI Flourishing Schools

A research-backed professional development platform for schools that participated in the Flourishing Schools Project. The platform serves multiple audiences from a single codebase: public visitors exploring the project, school applicants, school administrators, teachers, school teams, and RSI facilitators managing cohorts. It is not affiliated with or endorsed by Harvard University beyond the factual context of the Flourishing Schools Project research.

**Production:** https://rsi-flourishing.vercel.app

## Stack

- **Next.js 15** (App Router, React 19, TypeScript strict)
- **Tailwind CSS v4** (CSS-first `@theme` token system)
- **Supabase** (Postgres + Auth + Storage + RLS) via `@supabase/ssr`
- **Vercel** (hosting, auto-deploy from Git)
- **Framer Motion** for marketing animations
- **Radix UI** primitives, **Lucide React** icons, **React Hook Form** + Zod validation
- **Fonts:** Fraunces (display), Inter (body), IBM Plex Mono (code/data)
- **AI:** Anthropic Messages API with a deterministic mock fallback when no key is set

## Local setup

```bash
git clone <repo-url>
cd rsi-flourishing
npm install
cp .env.example .env.local   # fill in values — see Environment variables below
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` and fill in each value. Never commit `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key — server-only; bypasses RLS; never expose to the browser |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for auth redirects and metadata (e.g. `https://rsi-flourishing.vercel.app`) |
| `AI_PROVIDER_API_KEY` | Anthropic API key — optional; AI features return safe mock responses when absent |
| `AI_MODEL` | Optional override for the model used by AI routes (default: `claude-sonnet-4-6`) |

## Supabase setup

1. Create a project at https://supabase.com.
2. Open the SQL editor and apply migrations in order:
   - `db/migrations/0001_init.sql` — core schema: 14 tables, enums, RLS policies, helper functions, `handle_new_user` trigger, and 4 storage buckets.
   - `db/migrations/0002_finish_platform.sql` — adds `contact_messages`, `newsletter_signups`, and `invitations`. Required for the contact form and invite system to persist data.
3. Optionally run `db/seed/seed.sql` to load demonstration data (one organization, four demo users, resources, PD sessions, and facilitator notes). This data is fake and for development/demo purposes only.
4. Confirm the storage buckets exist:

   | Bucket | Access |
   | --- | --- |
   | `school-documents` | Private (signed URLs only) |
   | `resource-files` | Public |
   | `profile-avatars` | Public |
   | `public-assets` | Public |

5. Grab the Project URL, anon key, and service-role key from Project Settings → API and set them in `.env.local`.

For Auth URL configuration, Google OAuth setup, and redirect URL requirements see [DEPLOYMENT.md](DEPLOYMENT.md).

After signing up, promote your account to admin:

```sql
update profiles set role = 'platform_admin' where email = 'you@example.com';
```

## Scripts

From `package.json`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` (TypeScript strict check) |

## Deployment

The app deploys to Vercel. Either push to the connected Git branch (auto-deploy) or run:

```bash
vercel --prod
```

Add all environment variables under Project → Settings → Environment Variables before deploying. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full first-run checklist, Google OAuth wiring, and production smoke checks.

## Project structure

```
app/
  (public)/          Public marketing site
    about/           About the program
    research/        Research background
    impact/          Impact data
    flourishing-schools-project/
    professional-development/
    resources/       Resource library (+ /[slug] detail pages)
    apply/           School application form
    contact/         Contact form
    get-involved/
    responsible-ai/
    blog/
    privacy/
  (auth)/            Login and signup (Supabase email auth)
  (dashboard)/       Role-based workspace
    dashboard/
      applicant/     Application status tracking
      admin/         School admin tools
      teacher/       Teacher PD workspace + AI coach
      team/          School team board
      facilitator/   RSI facilitator cohort management
  api/
    ai/
      analyze-school/
      recommend-resources/
      coach/
    applications/
  auth/callback/     Supabase OAuth callback handler

components/          brand, marketing, dashboard, forms, resources, ai, ui
lib/
  ai/                AI provider + analyze/recommend/coach with mock fallback
  auth/              Role helpers and dashboard path routing
  content/           Curated resources, navigation copy, demo data
  supabase/          server / client / middleware helpers
  validation/        Zod schemas
db/
  migrations/        0001_init.sql, 0002_finish_platform.sql
  seed/              seed.sql (demo data only)
types/               Shared TypeScript types and domain constants
```

## Security

See [SECURITY.md](SECURITY.md) for the full policy. Key points:

- Never commit `.env.local`. It is in `.gitignore`.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Use it only in server-side code (`app/api/`, server components, server actions). Never import it from a client component or any `NEXT_PUBLIC_` variable.
- RLS policies on each table are the authoritative access boundary. Do not disable RLS on any table in production.
- If the service-role key is ever exposed, rotate it immediately in Supabase → Settings → API → JWT Secret, then update Vercel and redeploy.
- Report security vulnerabilities to flourishingschools@fas.harvard.edu — do not file a public issue.

## Known limitations

- **Migration 0002 required for contact and invites.** If `0002_finish_platform.sql` has not been applied, contact form submissions and team invitations will not persist to the database.
- **Google OAuth requires explicit configuration.** Both Supabase (Authentication → Providers → Google) and Google Cloud Console (OAuth consent screen + credentials) must be set up. A missing or mismatched redirect URI causes `redirect_uri_mismatch` errors. See [DEPLOYMENT.md](DEPLOYMENT.md).
- **AI features need `AI_PROVIDER_API_KEY`.** Without it, the analyze-school, recommend-resources, and coach endpoints return clearly labeled mock responses. This is a safe fallback, not an error.
- **Resource library is statically curated.** The public resource library is backed by `lib/content/resources.ts`. All research citations in that file are marked as placeholders and must be replaced with verified sources before production use.
- **Email delivery is not wired.** Contact form submissions and team invitations are stored in the database but no outbound email is sent. A transactional email service (e.g. Resend, Postmark) needs to be integrated.
- **Placeholder citations throughout.** No real research is cited in the seed data or curated content. These must be replaced before the platform is used in a real program context.
