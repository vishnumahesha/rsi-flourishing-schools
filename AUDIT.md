# RSI Flourishing Schools — Platform Audit

Read-only inventory of the live codebase to inform redesign and rewrite decisions.
Method: source was read directly across `app/`, `components/`, `lib/`, `db/`, `public/`, and config. Citations are `file:line`. Stubs/placeholders/dead code are flagged plainly. Items inferred rather than proven are marked _(unverified)_.

**Stack:** Next.js 15.1.6 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Supabase (Postgres + Auth + Storage + RLS). Generated 2026-06-16.

**One-line state of the union:** Polished, coherent marketing + dashboard shell with a real, RLS-correct read layer and graceful demo fallback everywhere — but it is **pre-launch**: write persistence is missing for the two interactive features, ~7 dashboard buttons are non-functional, all 8 resource citations are placeholders, several pages carry "this is a demo" disclaimers, and Google OAuth is code-complete but blocked on dashboard config.

---

## 1. Route map

Status legend: **LIVE** = finished/wired (static content or real Supabase write) · **DEMO-FALLBACK** = real RLS query with demo fallback on empty/no-session · **STUB** = placeholder / coming-soon / depends on unconfigured external (AI) · **DEAD** = unused. "Static" public pages have no Supabase reads (content from `lib/content/*`).

### Public (`app/(public)/`)
| Path | File | Purpose | Access | Status |
|---|---|---|---|---|
| `/` | `page.tsx` | Landing: problem→process→audiences→resources→impact | public | LIVE (static) |
| `/about` | `about/page.tsx` | Mission + 4 guiding principles | public | LIVE (static) |
| `/research` | `research/page.tsx` | 3-pillar framework, survey measures, real citation | public | LIVE (static) |
| `/professional-development` | `professional-development/page.tsx` | Program structure via ProcessTimeline | public | LIVE (static) |
| `/impact` | `impact/page.tsx` | Intended outcomes + "Stories to come" | public | LIVE w/ STUB section (`impact/page.tsx:48-56`) |
| `/resources` | `resources/page.tsx` | Filterable public resource library | public | LIVE (static; **placeholder citations**) |
| `/flourishing-schools-project` | `flourishing-schools-project/page.tsx` | Survey background + real references | public | LIVE (static) |
| `/get-involved` | `get-involved/page.tsx` | 6-pathway participation hub | public | LIVE (static) |
| `/contact` | `contact/page.tsx` | Contact form + placeholder emails | public | STUB (form does not send; emails are `example.org`) |
| `/blog` | `blog/page.tsx` | Post list + featured post | public | STUB (placeholder posts, no detail pages, non-interactive filters) |
| `/privacy` | `privacy/page.tsx` | Data-handling prose | public | LIVE (draft; self-described "not a substitute") |
| `/responsible-ai` | `responsible-ai/page.tsx` | AI does/never-does guardrails | public | LIVE (static) |
| `/apply` | `apply/page.tsx` | 6-step application wizard | public | LIVE writes (persists when authed+configured; **file upload simulated**, localStorage draft) |

### Auth (`app/(auth)/` + `app/auth/`)
| Path | File | Purpose | Access | Status |
|---|---|---|---|---|
| `/login` | `(auth)/login/page.tsx` | Email/password + Google sign-in | public | LIVE (Google blocked on dashboard config — see §6) |
| `/signup` | `(auth)/signup/page.tsx` | Account creation + email confirm | public | LIVE |
| `/auth/callback` | `auth/callback/route.ts` | OAuth code→session exchange, error forwarding | public | LIVE |

### Dashboard (`app/(dashboard)/dashboard/`) — all gated by middleware (auth required); role separation is by nav + RLS, **not** per-route role checks _(see §6)_
| Path | File | Purpose | Role | Status |
|---|---|---|---|---|
| `/dashboard` | `page.tsx` | Redirect to role home | any authed | LIVE |
| `/dashboard/admin` | `admin/page.tsx` | School overview: stats, growth areas, sessions | school_admin | DEMO-FALLBACK |
| `/dashboard/admin/analysis` | `admin/analysis/page.tsx` | AI school analysis | school_admin | STUB (AI; mock fallback) |
| `/dashboard/admin/plan` | `admin/plan/page.tsx` | Growth plan + linked practices | school_admin | DEMO-FALLBACK (resource links hardcoded) |
| `/dashboard/admin/resources` | `admin/resources/page.tsx` | AI resource recommender | school_admin | STUB (AI; mock fallback) |
| `/dashboard/admin/team` | `admin/team/page.tsx` | Staff roster | school_admin | DEMO-FALLBACK (+ stub "Invite member") |
| `/dashboard/admin/documents` | `admin/documents/page.tsx` | Document list | school_admin | DEMO-FALLBACK (+ stub "Upload") |
| `/dashboard/teacher` | `teacher/page.tsx` | Teacher home: counts, recent reflection | teacher | DEMO-FALLBACK |
| `/dashboard/teacher/reflections` | `teacher/reflections/page.tsx` | Reflection journal | teacher | DEMO-FALLBACK reads + **STUB writes** |
| `/dashboard/teacher/coach` | `teacher/coach/page.tsx` | AI reflective coach chat | teacher | STUB (AI; mock fallback, ephemeral) |
| `/dashboard/teacher/resources` | `teacher/resources/page.tsx` | AI resource recommender | teacher | STUB (AI; mock fallback) |
| `/dashboard/team` | `team/page.tsx` | Kanban action board | school_team_member | DEMO-FALLBACK reads + **STUB writes** |
| `/dashboard/team/forum` | `team/forum/page.tsx` | Discussion thread list | school_team_member | DEMO-FALLBACK (+ stub "New thread", no detail page) |
| `/dashboard/applicant` | `applicant/page.tsx` | Application status tracker | applicant | DEMO-FALLBACK |
| `/dashboard/facilitator` | `facilitator/page.tsx` | Cohort overview | rsi_facilitator / platform_admin | DEMO-FALLBACK |
| `/dashboard/facilitator/schools` | `facilitator/schools/page.tsx` | Per-school detail | facilitator | DEMO-FALLBACK |
| `/dashboard/facilitator/sessions` | `facilitator/sessions/page.tsx` | PD sessions list | facilitator | DEMO-FALLBACK (+ stub "Schedule") |
| `/dashboard/facilitator/notes` | `facilitator/notes/page.tsx` | Private facilitator notes | facilitator | DEMO-FALLBACK (+ stub "Add note") |

### API (`app/api/`)
| Path | File | Method | Purpose | Persists? |
|---|---|---|---|---|
| `/api/applications` | `api/applications/route.ts` | POST | Validate (Zod) + insert application | **YES** → `applications` (when authed+configured) |
| `/api/ai/analyze-school` | `api/ai/analyze-school/route.ts` | POST | Growth-area suggestions from curated library | No (ephemeral; mock if no AI key) |
| `/api/ai/coach` | `api/ai/coach/route.ts` | POST | Reflective coach reply | No (ephemeral; mock if no AI key) |
| `/api/ai/recommend-resources` | `api/ai/recommend-resources/route.ts` | POST | Ranked resource recommendations | No (ephemeral; mock if no AI key) |

---

## 2. Page-by-page breakdown

### Public pages

**`/` — `app/(public)/page.tsx`**
- **Function:** Primary landing/marketing narrative.
- **Content:** Hero → TrustStrip → "The challenge" (3 problem cards) → "How it works" (6-step ProcessTimeline) → "For everyone in the school community" (5 audience cards) → AIHumanSection (dark) → "Public resource library" (3 featured) → "Impact" (6 outcomes) → closing line "Case studies, testimonials, and network-level results will appear here as the program progresses" (`page.tsx:134-136`) → CTA. Soft copy: `page.tsx:43` "rely on hunches" (unsubstantiated baseline).
- **Data:** None (static from `lib/content/home.ts`, `resources.ts`). No writes.
- **Visual:** Hero uses display ramp + tree illustration (mix-blend). Problem header uses `size="display"`. Grids `sm:grid-cols-2 lg:grid-cols-3`. Distinctive brand layer; grids still mostly symmetric.
- **Issues/opps:** Homepage Problem grid is the prime spot for the planned 12-col asymmetry; impact teaser is soft.

**`/about` — `app/(public)/about/page.tsx`**
- **Function:** Mission + principles. **Content:** Hero, 3 prose paras (`prose-rsi`), "What guides us" (4 cards: Research first / Human-led / School-specific / Sustained over time). Soft copy: `about/page.tsx:17` "not hype or guesswork"; `:29` "build durable practice, not one-off workshops" (unquantified). **Data:** none. **Visual:** narrow prose + `sm:grid-cols-2` cards (now with hover, per recent cascade). Copy here is among the strongest/most concrete on the site. **Issues:** principle claims are assertions without linked evidence.

**`/research` — `app/(public)/research/page.tsx`**
- **Function:** Framework + survey + research-to-practice loop. **Content:** Hero, "The framework" (`size="display"`, 3 pillar cards) with **real citation** VanderWeele & Hinton (2024) (`research/page.tsx:44-47`, mono), "The survey" (5 measures), "Research in practice" (numbered loop). **Data:** none (`lib/content/research.ts`). **Visual:** strongest page — `lg:grid-cols-2` split, real asymmetry, gold dots. **Issues:** no link to actual survey instrument / sample report.

**`/professional-development` — `professional-development/page.tsx`**
- **Function:** Program structure. **Content:** Hero, ProcessTimeline (shared 6 steps), ResponsibleAINotice, CTA. **Data:** none. **Visual:** timeline-dominant, very short page. **Issues:** thin; each phase could carry hours/format/role detail (none stated anywhere — flag for RSI to supply, do not invent).

**`/impact` — `impact/page.tsx`**
- **Function:** Outcomes + future stories. **Content:** Hero ("From insight to lasting improvement" — soft), "Outcomes" (6 cards), "Stories to come" (3 dashed "Coming soon" cards, `:48-56`). **Data:** none. **Visual:** ghost placeholder cards read as unfinished. **Issues:** outcomes are program claims, not validated; placeholder section has no date.

**`/resources` — `resources/page.tsx`**
- **Function:** Public library. **Content:** Hero + `ResourceLibrary` (search + domain/grade/evidence filters, card grid). **Data:** static `lib/content/resources.ts` (8 items), client-side filter. **CRITICAL:** every `sourceCitation` = "Placeholder citation" (`resources.ts:24,52,80,108,136,164,192,220`); `relatedResearch` strings hedge ("Aligns with research on…"). **Visual:** standard filter+grid. **Issues:** unsourced evidence claims are the top credibility risk.

**`/flourishing-schools-project` — `flourishing-schools-project/page.tsx`**
- **Function:** Survey background. **Content:** Hero, 3 prose paras, "Selected references" card with **2 real citations** (VanderWeele & Hinton 2024; Kristjánsson & VanderWeele 2025), now mono. Soft copy: `:35-36` "groups…may need more support" (vague criteria). **Data:** none. **Visual:** narrow prose + reference card. Solid.

**`/get-involved` — `get-involved/page.tsx`**
- **Function:** Participation hub. **Content:** Hero + 6 pathway cards (Apply / Data Collaborative / Resources / Events→/blog / Partnerships→/contact / Contact). **Data:** none. **Visual:** `sm:grid-cols-2 lg:grid-cols-3`, raw `Card` with hover (added in cascade). Most "template" page — 6 identical cards. **Issues:** "Events" points at blog (no events); partnership copy generic.

**`/contact` — `contact/page.tsx`**
- **Function:** Contact. **Content:** Hero, `lg:grid-cols-[1.3fr_1fr]`: ContactForm (left) + two info cards (right). Disclaimer "Contact addresses are placeholders for this demo platform" (`contact/page.tsx:53-54`); emails `flourishingschools@example.org`, `hello@example.org`. **Data:** ContactForm is client-only, shows "Message received" but **does not send/store**. **Status:** STUB. **Issues:** placeholder emails + non-sending form undercut trust.

**`/blog` — `blog/page.tsx`**
- **Function:** News list. **Content:** Hero, category pill buttons (non-interactive), featured post (`md:grid-cols-2`, right panel = "Full article coming soon"), grid of 6 summaries (`lib/content/blog.ts`, dated early-2026). Disclaimer "Posts are placeholder content for this demo platform" (`blog/page.tsx:79`). **Data:** static, no detail routes. **Status:** STUB. **Issues:** no article pages, filters do nothing, featured image missing.

**`/privacy` — `privacy/page.tsx`**
- **Function:** Data-handling overview. **Content:** Hero + 5 prose sections (minimization, use of uploads, role-based access, AI processing→/responsible-ai, security). Disclaimer "not a substitute for an organization's formal privacy policy" (`:52-54`). **Data:** none. **Issues:** reads as draft; no retention/deletion/breach policy.

**`/responsible-ai` — `responsible-ai/page.tsx`**
- **Function:** AI guardrails. **Content:** Hero, ResponsibleAINotice, `sm:grid-cols-2` does/never-does lists (Check/X), 2 prose sections. **Data:** none (hardcoded lists). **Issues:** "curated database" curation process undefined; no UI example of the "draft" label it promises.

**`/apply` — `apply/page.tsx`** (form: `components/forms/ApplicationForm.tsx`)
- **Function:** 6-step application wizard (school info → background → goals → team → documents → review). **Content:** Stepper + per-step fields via `field-helpers` (FieldShell, ChipMultiSelect, RadioRow); review screen with edit links. **Data:** auto-saves draft to `localStorage` (`rsi-application-draft`); final submit POSTs `/api/applications` which **inserts to `applications`** when authed+configured (Zod-validated), else returns a demo-mode message. **File uploads are simulated** _(unverified exact line; comment indicates simulation)_. **Visual:** distinctive multi-step wizard. **Issues:** no review-timeline/cost stated anywhere; report-format not validated.

**`/login` & `/signup`** (form: `components/forms/AuthForm.tsx`)
- **Function:** Auth. **Content:** Google button + divider + email/password (+ full name on signup); inline errors. Shows "Authentication not configured" if `NEXT_PUBLIC_SUPABASE_URL` missing (`AuthForm.tsx:27-42`). **Data:** real Supabase Auth (`signInWithPassword`, `signUp`, `signInWithOAuth`). **Status:** LIVE. **Issues:** no password-reset link; Google flow blocked on config (§6).

### Dashboard pages (condensed — full data table in §1; loaders in §3 note)

- **`/dashboard`** — role redirect via `dashboardPathForRole()`; reads `profiles.role`. LIVE.
- **`/dashboard/admin`** (`getAdminOverview`, `lib/dashboard/queries.ts`) — reads `organizations`, `growth_areas`, `pd_sessions`, `profiles`(staff count). Enrollment stat shows "—" (no column — honest). DEMO-FALLBACK. No writes.
- **`/dashboard/admin/analysis`** — `AnalysisPanel` → `/api/ai/analyze-school`. STUB (mock without `AI_PROVIDER_API_KEY`). No persistence of results.
- **`/dashboard/admin/plan`** (`getAdminPlan`) — reads `growth_areas`; practice links **hardcoded** by domain (`admin/plan/page.tsx:9-13`); empty when no slug map. DEMO-FALLBACK, read-only.
- **`/dashboard/admin/resources`** — `ResourceRecommender` → `/api/ai/recommend-resources`. STUB.
- **`/dashboard/admin/team`** (`getAdminTeam`) — reads `profiles`(org); initials derived; null title → "—". DEMO-FALLBACK. **"Invite member" button has no handler.**
- **`/dashboard/admin/documents`** (`getAdminDocuments`) — reads `documents`(org); formats size/category. Static lock-privacy notice always shown. DEMO-FALLBACK. **"Upload" button has no handler.**
- **`/dashboard/teacher`** (`getTeacherOverview`) — counts `reflections`(author) + active `intervention_plans`(owner), latest reflection. "This cycle: Belonging" is **hardcoded** (`teacher/page.tsx:18`). DEMO-FALLBACK.
- **`/dashboard/teacher/reflections`** (`getTeacherReflections` + `ReflectionEditor`) — reads `reflections`(author). **New entries save to local state only (`ReflectionEditor.tsx:29-41`); no insert. Button says "Saved (this session)".** DEMO-FALLBACK reads + STUB writes. Prompts hardcoded (`ReflectionEditor.tsx:9-14`).
- **`/dashboard/teacher/coach`** — `CoachChat` → `/api/ai/coach`. STUB; chat history ephemeral.
- **`/dashboard/teacher/resources`** — `ResourceRecommender` (default `["belonging"]`). STUB.
- **`/dashboard/team`** (`getTeamTasks` + `ActionBoard`) — reads `intervention_plans`+`growth_areas`(domain)+`profiles`(initials). **Drag updates local state only (`ActionBoard.tsx:23-25`); no `.update()`.** DEMO-FALLBACK reads + STUB writes. DemoNotice claims "production syncs across your team in real time" — not implemented.
- **`/dashboard/team/forum`** (`getTeamForum`) — reads `forum_threads`+`forum_posts`(reply counts)+`profiles`(author). DEMO-FALLBACK. **"New thread" has no handler; threads don't open.**
- **`/dashboard/applicant`** (`getApplicantOverview`) — reads latest `applications`(submitted_by); steps derived from status+timestamps, **no fabricated dates** (`applicant.ts` step logic). DEMO-FALLBACK.
- **`/dashboard/facilitator`** (`getFacilitatorOverview`) — reads all `organizations` (RLS lets facilitators see all) + `growth_areas`(avg progress) + `profiles`(educator counts); flag derived from progress (0→New, <30→Needs check-in, else On track). DEMO-FALLBACK.
- **`/dashboard/facilitator/schools`** (`getFacilitatorSchools`) — `organizations` + grouped `growth_areas`; no per-school flag (no column — dropped rather than invented). DEMO-FALLBACK.
- **`/dashboard/facilitator/sessions`** (`getFacilitatorSessions`) — `pd_sessions` split scheduled/past. DEMO-FALLBACK. **"Schedule" has no handler.**
- **`/dashboard/facilitator/notes`** (`getFacilitatorNotes`) — `facilitator_notes` + org-name lookup. DEMO-FALLBACK. **"Add note" has no handler.**

---

## 3. Design system inventory

### Tokens — all in `app/globals.css`
- **Brand colors** (`:9-22`): crimson `#9e1b32`, crimson-strong `#851428`, crimson-soft `#f7e9eb`; navy `#16233f`, navy-soft `#243456`, navy-ink `#0d1730`; ivory `#faf6ec`, ivory-deep `#f2ebd9`, surface `#fffdf7`; gold `#c0993f`, gold-soft `#e7d6a6`; slate `#51607a`, mist `#a7bed0`, sage `#8fa889`. (~5 working hues + neutrals — restrained, on-brand.)
- **Semantic** (`:25-31`): background=ivory, foreground `#182039`, muted `#69728a`, card=surface, line `rgba(22,35,63,.10)`, line-strong `.16`, ring `rgba(158,27,50,.38)`.
- **Fonts** (`app/layout.tsx:5-24`, exposed `globals.css:61-63`): Display **Fraunces** (`--font-fraunces`, opsz), Sans **Inter** (`--font-inter`), Mono **IBM Plex Mono** 400/500/600 (`--font-plex-mono`, added in last cascade).
- **Type ramp (Editorial):** section `clamp(1.875rem,3.2vw,2.5rem)` + display `clamp(3rem,6vw,4.5rem)` (`SectionHeader.tsx:46-47`); hero `clamp(3.25rem,7vw,5.5rem)` (`PageHero.tsx:26`, `MarketingHero.tsx:19`); base headings weight 460, tracking -0.021em (`globals.css:92-99`, in `@layer base`).
- **Radii** (`:33`, `:64-68`): base `0.85rem`; md .6 / lg .85 / xl 1.25 / 2xl 1.75 / 3xl 2.45 rem.
- **Shadows** (`:34-36`): soft / card / float (elevation-calibrated).
- **Signature utilities:** `.bg-flourish` (radial wash), `.bg-navy-deep`, `.grain` (SVG noise overlay), `.gold-rule`, `.text-gradient-gold`, `.glass`/`.glass-dark` (`:112-170`).

### Component catalog (`find components -name '*.tsx'` → 42 components)
- **ui/ (16):** badge, button (CVA, 8 variants), card(+sub), checkbox, container, dialog, dropdown-menu, input, label, progress, select, separator, sheet, skeleton, tabs, textarea. Standard shadcn-style primitives.
- **marketing/ (8):** `MarketingHero` (hero+tree image), `PageHero` (reusable hero), `SectionHeader` (eyebrow+ramp+`size`/`tone`), `ProcessTimeline` (framer-motion alternating), `Reveal`(+Stagger/StaggerItem), `sections` (TrustStrip / AIHumanSection / CTASection), `cards` (FeatureCard, AudienceCard, ImpactMetricCard, ResearchPillarCard, ResourceCard), `ResponsibleAINotice`, **`DashboardPreview` — DEAD (0 imports, see §6)**.
- **layout/ (2):** `SiteHeader` (sticky glass nav + mobile sheet), `SiteFooter` (navy-deep, multi-column).
- **forms/ (4 + helpers):** `AuthForm`, `ApplicationForm` (6-step wizard, localStorage), `ContactForm` (no send), `ReflectionEditor` (session-only), `field-helpers`.
- **auth/ (1):** `AuthErrorBanner` (reads `?error`/`#error`, dismiss, strips URL — added recently).
- **dashboard/ (3):** `DashboardShell` (topbar+sidebar+mobile sheet), `ActionBoard` (kanban, session-only), `primitives` (PageHeading, DemoNotice, StatCard, DashCard, EmptyState).
- **ai/ (3):** `CoachChat`, `AnalysisPanel`, `ResourceRecommender` (all client, all → `/api/ai/*`, ephemeral).
- **resources/ (1):** `ResourceLibrary` (search + 3 filters + Stagger grid).
- **brand/ (2):** `Logo` (SVG mark, variants), **`FlourishMotif` — DEAD (0 imports, see §6)**.

### Motion
- Framer Motion: `Reveal`/`Stagger` (scroll fade-up, `useReducedMotion`), `ProcessTimeline` (per-step), `DashboardPreview` (dead).
- CSS keyframes (`globals.css:170-205`): float-soft, float-softer, fade-up, shimmer (skeleton).
- `prefers-reduced-motion` honored globally (`globals.css:204-211`) **and** in framer components. Good.

### Accessibility gaps (from component scan)
| Gap | Location | Severity |
|---|---|---|
| Icon-only Send button missing `aria-label` | `components/ai/CoachChat.tsx:~132` | HIGH |
| Footer links `text-white/60` on `#0d1730` (~4.2:1) fail AA small-text | `SiteFooter.tsx:~49-68` | MED |
| Logo subtext `text-white/60` on dark | `brand/Logo.tsx:~65` | MED |
| No visible focus ring on RadioRow / ChipMultiSelect toggles | `forms/field-helpers.tsx:~57-106` | MED |
| Dialog: no initial focus / autofocus | `ui/dialog.tsx:~27-49` | MED |
| Input/textarea placeholder contrast (muted/70) | `ui/input.tsx:10`, `ui/textarea.tsx:9` | LOW-MED |
| No skip-to-content link | `SiteHeader`, `DashboardShell` | LOW |
- **Positives:** global `:focus-visible` crimson ring (`globals.css:98-102`); `aria-hidden` on decorative grain/motif/accent; `role="progressbar"`/`separator`/`alert`/`radio`; label↔field pairing; reduced-motion respected. Line numbers marked `~` are approximate _(verify before fixing)_.

---

## 4. Visual asset inventory

| File | Dimensions | Size | Used in | Status |
|---|---|---|---|---|
| `public/images/flourishing-hero.png` | 2688×1536 | 3.51 MB | `MarketingHero.tsx:51-52` (alt ✓ descriptive) | USED — **oversized** |
| `public/images/accent-burst.png` | 2048×2048 | 2.63 MB | `sections.tsx:61-62` (alt="" + aria-hidden ✓) | USED — **oversized** |

- **Only 2 images exist** (6.14 MB total). `public/brand/` empty. Both correctly wired with proper alt handling — **no alt-text violations.**
- **Oversized sources:** 3.5 MB / 2.6 MB PNGs; next/image optimizes delivery but the source files are heavy. Downscale to ~1600px / re-export.

### Missing-imagery shot list (for newly generated images)
1. **OG / social share image — MISSING entirely.** No `openGraph.images` in `app/layout.tsx:36-43` or any page metadata. Needs a 1200×630 site default + ideally per-key-page (home, research, impact, program). **Highest-impact gap for sharing/SEO.**
2. **Blog featured image** — `blog/page.tsx:55-60` shows a "Full article coming soon" colored box.
3. **Blog post thumbnails** — `blog/page.tsx:65-75` text-only cards.
4. **Impact case-study cards** — `impact/page.tsx:48-56` three "Coming soon" placeholders (pair with real content when it exists; do not fabricate).
5. **Resource cards** — `cards.tsx` ResourceCard is text/badge only; optional domain thumbnails.
6. **Featured resource row (home)** — `page.tsx:100-112` no imagery.

---

## 5. Content quality flags (ranked — do NOT rewrite yet; never invent stats/citations)

| # | file:line | Problem |
|---|---|---|
| 1 | `lib/content/resources.ts:24,52,80,108,136,164,192,220` | **All 8 resources show "Placeholder citation"** — top credibility risk; requires real sources from RSI |
| 2 | `app/(public)/contact/page.tsx:53-54` + `example.org` emails | "addresses are placeholders for this demo" — kills contact trust |
| 3 | `app/(public)/blog/page.tsx:79` | "Posts are placeholder content for this demo platform" |
| 4 | `app/(public)/apply/page.tsx` (submit + upload notices) | "demo submission / file handling simulated" — finality is illusory |
| 5 | `app/(public)/privacy/page.tsx:52-54` | "not a substitute for a formal privacy policy" — reads as draft |
| 6 | `app/(public)/impact/page.tsx:48-56` + `page.tsx:134-136` | "Coming soon" / "will appear here as the program progresses" — open-ended, no date |
| 7 | `app/(public)/about/page.tsx:17` | "not hype or guesswork" — assertion, no evidence standard |
| 8 | `app/(public)/about/page.tsx:29` | "build durable practice, not one-off workshops" — unquantified |
| 9 | `app/(public)/page.tsx:43` / `lib/content/home.ts` | "rely on hunches" / "test scores capture only part" — unsubstantiated baseline |
| 10 | `app/(public)/flourishing-schools-project/page.tsx:35-36` | "groups…may need more support" — vague criteria |
| 11 | `lib/content/resources.ts` `relatedResearch` | "Aligns with research on…" — hedge without citation |
| 12 | `app/(public)/responsible-ai/page.tsx:15` | "only from a curated, evidence-based database" — curation process undefined |
| 13 | dashboard `teacher/page.tsx:18` | "This cycle: Belonging" hardcoded — not real |
| 14 | `team/page.tsx` DemoNotice | "production syncs across your team in real time" — not implemented (misleading) |

**Hard rule honored:** placeholder citations are left as-is and flagged; no stats/testimonials/partners/citations invented here.

---

## 6. Known gaps + dead code

### Write-persistence gaps
- **Reflection journal** (`ReflectionEditor.tsx:29-41`): saves to local state, button says "Saved (this session)"; **no insert to `reflections`.** Lost on refresh. HIGH (misleading).
- **Action board** (`ActionBoard.tsx:23-25`): drag updates local state; **no `.update()` to `intervention_plans`.** Reverts on refresh. HIGH (misleading copy).
- **Non-functional buttons (no `onClick`):** Invite member (`admin/team`), Upload (`admin/documents`), New thread (`team/forum`), Add note (`facilitator/notes`), Schedule (`facilitator/sessions`); ContactForm send (`/contact`). Forum threads also have no detail route.

### Placeholder data / seed
- `lib/content/resources.ts` — 8 placeholder citations (also seeded in DB: `resources` rows are public).
- `db/seed/seed.sql` — demo org (`Riverbend`), 4 demo `auth.users` with bcrypt('FlourishDemo123!'), demo growth/sessions/plans/reflections/forum/notes. **Demo-only; must not be seeded into production.**

### Dead code
- **`components/brand/FlourishMotif.tsx` — DEAD.** `grep -rn FlourishMotif` → only the definition; 0 imports.
- **`components/marketing/DashboardPreview.tsx` — DEAD.** 0 imports (its only consumer, `MarketingHero`, was switched to the hero image). Safe to delete.

### Config / housekeeping
- **Google OAuth:** code-complete (`AuthForm.handleGoogle` + `auth/callback/route.ts` exchange + `AuthErrorBanner`). **Currently blocked on dashboard config:** Supabase Site URL was localhost, and the live failure "Unable to exchange external code" indicates a Client Secret mismatch in the Supabase Google provider. Fixes are dashboard-only (Supabase Auth URL config + re-paste Google Client Secret + confirm redirect URI). _(External config, not code.)_
- **Stray lockfile** `/Users/newstudent/package-lock.json` (89-byte stub) outside the repo triggers Next.js "inferred workspace root" warning. Delete it or set `outputFileTracingRoot`.
- **Service-role usage:** `/api/applications` uses `createServiceClient() ?? supabase` to insert. Gated by a prior session check and the `apps_insert_own` RLS policy already protects the insert, so the service client is unnecessary — recommend removing and relying on anon+RLS. Constrained blast radius today (one table).
- **`.env.local`:** present locally and **gitignored** (`.gitignore` covers `.env*.local`; verified). Not committed — the live secret exists only in the local file and Vercel env, not the repo. `AI_PROVIDER_API_KEY` is unset, so all AI features return safe mocks. `NEXT_PUBLIC_SITE_URL` in the local file is `http://localhost:3000` (the Supabase dashboard Site URL is the relevant one for redirects).
- **next.config.mjs:** ESLint ignored during builds; image `remotePatterns` for Supabase + a Higgsfield CDN _(confirm the latter is still needed)_.

---

## 7. Prioritized change backlog (ordered by impact ÷ effort within group)

Effort S/M/L · Risk low/med/high.

### A. Content rewrite (mostly blocked on RSI-supplied facts — never invent)
1. **Resolve the 8 placeholder citations** — replace with real peer-reviewed sources or remove the evidence-strength claims. *Why:* #1 credibility blocker. **L · low (code) / blocked on RSI sources.**
2. **Strip "demo" disclaimers from production pages** (contact emails, blog notice, apply demo notice, privacy "not a substitute"). *Why:* they actively signal "not real." **S–M · low** (some need real content/policy first).
3. **Tighten soft copy toward stated facts** (about, impact, home baseline) — use the concrete things RSI already says (3-pillar framework, monthly sessions across a year, real citations). *Why:* premium feel; honesty. **M · low** (flag spots needing a real number).

### B. Visual / UI polish
4. **Accessibility fixes** — Send-button `aria-label`, dark-region contrast (footer/logo `/60`→higher), focus rings on RadioRow/ChipMultiSelect, dialog autofocus. *Why:* HIGH a11y item + WCAG AA. **S · low.**
5. **Downscale the 2 oversized PNGs** (~6 MB → ~1600px). *Why:* payload/repo weight. **S · low.**
6. **Homepage 12-col asymmetry + Get-Involved regrid + PageHero variation** (the held layout items). *Why:* breaks remaining template symmetry. **M · med** (visual regression risk → review live).

### C. New imagery needed
7. **OG / social share image** (site default 1200×630 + key pages). *Why:* every shared link is currently bare; SEO/social. **S–M · low.**
8. **Blog featured + post thumbnails.** *Why:* blog reads unfinished. **M · low** (needs images; pair with real posts).
9. **Impact case-study imagery** — only alongside real case studies. **M · low / blocked on real content.**

### D. Functional gaps
10. **Persist reflections** (POST → insert `reflections`, revalidate). *Why:* fixes misleading "Saved". **M · med.**
11. **Persist action-board moves** (update `intervention_plans.status` on drop). *Why:* fixes misleading "syncs in real time". **M · med.**
12. **Google OAuth dashboard config** (Supabase Site URL + Client Secret + redirect URI). *Why:* login currently fails. **S · low** (external config, not code).
13. **Implement the 5 stub buttons + forum thread create/detail + contact send.** *Why:* completeness. **L · med** (each = modal + endpoint + RLS).
14. **Remove service-role from `/api/applications`; rely on RLS.** *Why:* least-privilege. **S · low.**
15. **Delete dead code** (`FlourishMotif`, `DashboardPreview`) + stray `~/package-lock.json`. *Why:* hygiene. **S · low.**
16. **Guard production seeding** (ensure `seed.sql` demo users/citations never run in prod). *Why:* safety. **S · low.**

**Suggested first sprint (high impact ÷ low effort):** #4 (a11y), #12 (OAuth config), #7 (OG image), #2 (disclaimers), #14/#15/#16 (hygiene) — then #10/#11 (persistence) and #1/#3 (content with RSI).

---

_Uncertainty notes:_ accessibility line numbers marked `~` are approximate; apply-page file-upload simulation and a few AI-route specifics were reported by inventory agents and not line-verified here; Google provider/Client-Secret state is inferred from the live error message, not read from any dashboard.
