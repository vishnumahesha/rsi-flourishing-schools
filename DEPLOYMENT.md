# Deployment

This app is a standard Next.js 15 project. The two external services are **Supabase** (database/auth/storage) and **Vercel** (hosting).

## 1. Supabase

A project has already been provisioned for this build:

- **Project ref:** `cwhnvbutorpaequjowgc`
- **Region:** us-east-1
- **Plan:** Free
- **Status:** ACTIVE_HEALTHY

The schema migration (`db/migrations/0001_init.sql`) and seed (`db/seed/seed.sql`) have been applied to it.

To stand up a **fresh** project instead:

1. Create a project at https://supabase.com (or via the Supabase MCP / CLI).
2. Run `db/migrations/0001_init.sql` in the SQL editor.
3. (Optional) Run `db/seed/seed.sql` for demonstration data.
4. Confirm the four storage buckets exist: `school-documents` (private), `resource-files`, `profile-avatars`, `public-assets`.
5. Grab **Project URL**, **anon/publishable key**, and **service-role key** from Project Settings → API.

### Auth configuration

- Enable **Email** auth (Authentication → Providers).
- Add your deployed origin to **Redirect URLs**, including `/auth/callback`.
- Set **Site URL** to your production domain.

## 2. Vercel

1. Import the GitHub repository into Vercel (New Project → Import).
2. Framework preset: **Next.js** (auto-detected). No build overrides needed.
3. Add environment variables (Project → Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | your project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service-role key (keep secret) |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` |
   | `AI_PROVIDER_API_KEY` | (optional) Anthropic key for live AI |
   | `AI_MODEL` | (optional) e.g. `claude-sonnet-4-6` |

4. Deploy. Verify the response headers carry `x-vercel-id`:

   ```bash
   curl -sI https://<your-deployment-url> | grep -i x-vercel-id
   ```

## 3. First-run checklist

- [ ] Public site loads (`/`, `/resources`, `/apply`).
- [ ] Sign up, confirm email, land on `/dashboard`.
- [ ] Promote your account: `update profiles set role='platform_admin' where email='you@example.com';`
- [ ] Facilitator dashboard shows seeded cohort data.
- [ ] (If AI key set) `/dashboard/teacher/coach` returns live responses; otherwise demo responses.

## Notes

- `next.config.mjs` sets `eslint.ignoreDuringBuilds: true`; **TypeScript errors still fail the build**.
- Middleware refreshes the Supabase session and guards `/dashboard`; it no-ops without Supabase env vars, so previews never break.
- `package-lock.json` is not committed — run `npm install` to generate it (or commit your own for reproducible CI).

---

## Google OAuth setup

**Supabase side:**

1. Supabase → Authentication → Providers → Google: enable the provider, paste in the Client ID and Client Secret from Google Cloud, and copy the Supabase callback URL shown there (it looks like `https://<project-ref>.supabase.co/auth/v1/callback`).

**Supabase URL configuration:**

2. Supabase → Authentication → URL Configuration:
   - Site URL: `https://rsi-flourishing.vercel.app`
   - Additional Redirect URLs: `http://localhost:3000/auth/callback` and `https://rsi-flourishing.vercel.app/auth/callback`

**Google Cloud side:**

3. In Google Cloud Console → APIs & Services → OAuth consent screen: configure the app name, support email, and authorized domains.
4. In Credentials → OAuth 2.0 Client IDs: add the **Supabase callback URL** (`https://<project-ref>.supabase.co/auth/v1/callback`) as an Authorized Redirect URI. This must match exactly — not the app URL, the Supabase one. A mismatch causes `redirect_uri_mismatch` errors.

---

## Supabase Auth URL configuration

- **Site URL:** `https://rsi-flourishing.vercel.app`
- **Additional Redirect URLs:** `http://localhost:3000/auth/callback`, `https://rsi-flourishing.vercel.app/auth/callback`

For local development add `http://localhost:3000` to the Additional Redirect URLs list. Do not use the Site URL field for localhost; use the Additional Redirect URLs field so it does not override production.

---

## Storage buckets

The migration `db/migrations/0001_init.sql` creates four buckets:

| Bucket | Access |
| --- | --- |
| `school-documents` | Private (no public URL) |
| `resource-files` | Public |
| `profile-avatars` | Public |
| `public-assets` | Public |

`school-documents` is private — users access files through signed URLs generated server-side, not direct public links. Do not flip it to public. The three public buckets serve static assets; their RLS policies still control who can upload or delete.

---

## RLS / migrations

- Apply migrations in order by running each file in `db/migrations/` through the Supabase SQL editor (Dashboard → SQL Editor → New query) or via the Supabase CLI (`supabase db push`).
- All tables have RLS enabled. Never run `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` in production.
- Policy changes are also SQL migrations — add a new numbered file rather than editing old ones.
- After applying a migration, smoke-check the affected tables in the Supabase Table Editor to confirm policies are active.

**Production smoke checks** — after every deploy, confirm these routes return 200:

```bash
curl -so /dev/null -w "%{http_code}" https://rsi-flourishing.vercel.app/
curl -so /dev/null -w "%{http_code}" https://rsi-flourishing.vercel.app/login
curl -so /dev/null -w "%{http_code}" https://rsi-flourishing.vercel.app/resources
curl -so /dev/null -w "%{http_code}" https://rsi-flourishing.vercel.app/apply
```
