# Final Remaining Setup — external / dashboard-only steps

These cannot be completed from the codebase (they require Supabase/Google dashboard access, billing, or a real browser session). Everything in code is built and verified; the items below are the gate to a real pilot. No secrets appear in this file.

## 1. Apply database migrations to the live Supabase project
Apply in order via Supabase SQL editor or CLI (`supabase db push`):
- `db/migrations/0001_init.sql` (core tables — likely already applied)
- `db/migrations/0002_finish_platform.sql` (contact_messages, newsletter_signups, invitations)
- `db/migrations/0003_final_launch_readiness.sql` (resource_saves, resource_files)

Until 0002/0003 are applied, the dependent features fail **gracefully and honestly** (no fake success):
- Contact form → shows a fallback asking to email flourishingschools@fas.harvard.edu.
- Team invite → shows the real DB error instead of claiming an email was sent.
- Resource save / resource files → save action reports it could not persist.

**Verify after applying** (Supabase SQL editor):
```sql
select table_name from information_schema.tables
where table_schema='public'
  and table_name in ('invitations','contact_messages','newsletter_signups','resource_saves','resource_files');
-- Confirm RLS is on:
select relname, relrowsecurity from pg_class
where relname in ('contact_messages','newsletter_signups','invitations','resource_saves','resource_files');
```

## 2. Rotate the Supabase service-role key (treat as compromised)
A service-role key was pasted in chat history earlier in development. Before any real pilot:
1. Supabase → Settings → API → **roll the JWT secret** (rotates anon + service-role keys).
2. Update Vercel env vars (`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — Project → Settings → Environment Variables.
3. Update local `.env.local`.
4. Redeploy.
Note: the app no longer imports the service-role client anywhere (verified `git grep`), so anon+RLS is the live security boundary.

## 3. Google OAuth (dashboard config — code is complete)
The "Continue with Google" button, callback code-exchange, and the global `AuthErrorBanner` (reads `?error` and `#error`) are implemented. To make login succeed:
- Supabase → Auth → Providers → Google: **Enabled**, Client ID + Client Secret (must match the Google Cloud client exactly — the live "Unable to exchange external code" error indicates a Client-Secret mismatch).
- Supabase → Auth → URL Configuration: Site URL `https://rsi-flourishing.vercel.app`; Additional Redirect URLs `http://localhost:3000/auth/callback` and `https://rsi-flourishing.vercel.app/auth/callback`.
- Google Cloud → OAuth client → Authorized redirect URI: `https://cwhnvbutorpaequjowgc.supabase.co/auth/v1/callback` (the Supabase callback, not the app URL).
**Untested from here** (no browser): full Google round-trip. Verify manually once configured.

## 4. Storage buckets
Confirm these exist (created by 0001): `school-documents` (PRIVATE), `resource-files`, `profile-avatars`, `public-assets`. The admin document upload writes to `school-documents` and never generates a public URL. **Untested from here** (needs an authenticated admin session): upload round-trip + that an anonymous user cannot read a `school-documents` object.

## 5. Test users + role QA (needs Auth admin or signups)
Create test users (do NOT commit passwords) and matching `profiles` rows with roles: `applicant`, `school_admin`, `teacher`, `school_team_member`, `rsi_facilitator`, `platform_admin`, linked to a test organization. Then run the role checklist in `LAUNCH_QA.md`. Persistence flows (reflections, action-board status, forum threads/replies, facilitator notes, document upload, invites) are RLS-correct and build-verified but **not** verified end-to-end against the live DB from here (dashboards are auth-gated; cannot curl through them).

## 6. Demo-mode behavior (now safe)
Authenticated users no longer see demo data on empty orgs. Demo data renders **only** when Supabase is unconfigured OR `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=true`. Leave that env var unset (or false) in production.

## 7. Content (see REAL_CONTENT_TODO.md)
Replace placeholder citations and add real RSI/HFP content before pilot.
