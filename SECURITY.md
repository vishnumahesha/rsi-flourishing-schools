# Security

## Secrets and environment variables

Never commit `.env.local`. It is listed in `.gitignore` and must stay out of version control. Secrets live only in your local `.env.local` and in the Vercel project's Environment Variables (Project Settings → Environment Variables). The variables you need to configure are:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `AI_PROVIDER_API_KEY` (optional)

## If the service-role key is exposed

Treat any accidental exposure (committed to git, logged, leaked in a response) as a full compromise. Steps:

1. Go to Supabase → Settings → API → JWT Secret and rotate it immediately. This invalidates all existing tokens and sessions.
2. Remove the old key from all Vercel environment variables and set the new one.
3. Redeploy on Vercel so the new key takes effect.
4. Audit git history and purge the secret if it was committed (use `git filter-repo` or contact GitHub support for force-push cleanup on remote history).

## Service-role key usage rules

The service-role key bypasses Row Level Security. It must:

- Only ever be read in server-side code (API routes, server components, server actions).
- Never be imported into a client component or any file that runs in the browser.
- Never appear in any value that starts with `NEXT_PUBLIC_`, which is exposed to the client bundle.

If you need to call `createServiceClient`, the import must be in a file under `app/api/`, `app/(server)/`, or a `lib/supabase/server.ts` helper. If you find yourself importing it from a client component, stop and use the user session client instead.

## Dashboard reads and writes — RLS is the boundary

All dashboard data access uses the RLS-respecting user session client (`createClient` from `@/lib/supabase/server`). Row Level Security policies on each table are the authoritative access control layer. Do not disable RLS on any table in production. Do not work around RLS by reaching for the service-role client unless there is a documented, server-side-only reason (for example, an admin-only migration route).

## Google OAuth credentials

OAuth credentials are configured in two places: Supabase Auth → Providers → Google, and Google Cloud Console → OAuth consent screen. See `DEPLOYMENT.md` for the exact setup steps. Keep the Google Client Secret out of version control; set it only in Supabase and Vercel.

## Reporting a vulnerability

If you discover a security vulnerability in this project, please report it by emailing **flourishingschools@fas.harvard.edu**. Include a description of the issue, steps to reproduce, and the potential impact. Do not file a public GitHub issue for security vulnerabilities. We aim to acknowledge reports within 48 hours.
