# Launch QA

Honest QA record. Public/route checks were executed (curl, local cold dev). **Authenticated role flows are code- and RLS-verified but NOT executed end-to-end from this environment** (no browser; dashboards are auth-gated and the live DB cannot be driven through a session here). Items needing a real login are marked **UNTESTED (needs login)** and listed in `FINAL_REMAINING_SETUP.md`.

## Build gate (executed)
- `npm run typecheck` → exit 0
- `npm run lint` → exit 0 (No ESLint warnings or errors)
- `npm run build` → exit 0

## Public + auth routes (executed — local cold dev, all 200)
`/`, `/about`, `/research`, `/impact`, `/get-involved`, `/blog`, `/flourishing-schools-project`, `/professional-development`, `/resources`, `/apply`, `/contact`, `/privacy`, `/responsible-ai`, `/login`, `/signup` → **200**.
Honesty checks: blog "demo platform" disclaimer absent; contact uses `flourishingschools@fas.harvard.edu` (no `example.org`); resource cards show "Draft · citation pending" instead of presenting placeholder citations as real.

## Dashboard route guards (executed)
`/dashboard`, `/dashboard/profile`, `/dashboard/settings`, `/dashboard/team/forum` → **307** redirect when unauthenticated (middleware guard works).

## Role matrix (code-verified; end-to-end UNTESTED — needs login)

### Role: public visitor
- Pages tested: all public routes above — **200, executed**.
- Dead buttons: none found (contact persists or honest fallback; resource cards link to detail; CTAs route).
- DemoNotice on public: only intentional/demo-flagged.

### Role: applicant
- Reads real Supabase rows: code-correct (`getApplicantOverview`, RLS `apps_select` own rows). **UNTESTED (needs login).**
- DemoNotice: only in demo mode now (hardened). Empty real account → new "No application yet" empty state (added this pass).
- Writes: application submit via `/api/applications` (RLS `apps_insert_own`). **UNTESTED (needs login).**

### Role: school_admin
- Pages: overview, documents (upload→`school-documents` + `documents` row), analysis (AI, now auth-guarded + `analysis_runs` insert), resources, team (invite→`invitations`), plan, growth areas, sessions.
- Writes: document upload, invite. **UNTESTED (needs login + migration 0002 for invites).**
- Cross-role leakage: prevented by RLS (`is_org_member`/`is_org_admin`). Code-verified.

### Role: teacher
- Pages: overview, resources, reflections (load + create via server action on `reflections`), coach (AI, auth-guarded, mock fallback).
- Writes: reflection insert (RLS `reflections_owner`). **UNTESTED (needs login).**

### Role: school_team_member
- Pages: action board (status persist → `intervention_plans.status`), forum list, forum detail `[threadId]`, create thread, reply.
- Writes: status update, thread create, reply (RLS org-member). **UNTESTED (needs login).**

### Role: rsi_facilitator
- Pages: cohort overview, schools, sessions, notes (add note → `facilitator_notes`).
- Cross-school read via RLS facilitator path. Writes: add note (RLS `notes_facilitator`). **UNTESTED (needs login).**

### Role: platform_admin
- Inherits facilitator views; RLS helpers grant platform-admin read. No service-role in client (verified `git grep`). Code-verified.

## Demo-fallback safety (code-verified)
All dashboard loaders now return demo data ONLY when Supabase is unconfigured or `NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=true`. An authenticated user with an empty org gets real empty states, never fake "Riverbend" data. (Behavior verified by code; confirm visually once logged in.)

## Responsive (UNTESTED — needs browser)
375 / 768 / 1440 px manual checks not run from here. Layouts are mobile-first Tailwind; verify in browser before pilot.

## Storage / Google OAuth / live migrations
All **UNTESTED from here** — see `FINAL_REMAINING_SETUP.md` for the exact manual verification steps.
