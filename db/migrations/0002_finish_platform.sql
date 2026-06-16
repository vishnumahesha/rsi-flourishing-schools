-- =====================================================================
-- RSI Flourishing Schools — migration 0002: launch-finishing tables
-- Forward migration. Apply AFTER 0001_init.sql via the Supabase SQL editor
-- or CLI. Safe to run once on the existing project.
--
-- Adds: contact_messages, newsletter_signups, invitations.
-- Reuses helper functions from 0001 (is_platform_admin, is_rsi_facilitator,
-- is_org_admin). Public can INSERT into contact/newsletter; only admins read.
-- =====================================================================

-- ---------- Contact messages ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  organization text,
  role text,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ---------- Newsletter signups ----------
create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now()
);
create unique index if not exists newsletter_signups_email_key on public.newsletter_signups (lower(email));

-- ---------- Invitations ----------
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  invited_email text not null,
  invited_role text not null,
  invited_by uuid references public.profiles(id) on delete set null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);
create index if not exists invitations_org_idx on public.invitations (organization_id);
create index if not exists invitations_email_idx on public.invitations (lower(invited_email));

-- ---------- Enable RLS ----------
alter table public.contact_messages  enable row level security;
alter table public.newsletter_signups enable row level security;
alter table public.invitations        enable row level security;

-- ---------- Privileges (RLS still gates rows) ----------
grant insert on public.contact_messages  to anon, authenticated;
grant insert on public.newsletter_signups to anon, authenticated;
grant select, insert, update on public.invitations to authenticated;
grant select on public.contact_messages  to authenticated;
grant select on public.newsletter_signups to authenticated;

-- ---------- Policies ----------
-- contact_messages: anyone may submit; only platform admins may read.
drop policy if exists contact_public_insert on public.contact_messages;
create policy contact_public_insert on public.contact_messages for insert
  with check (true);
drop policy if exists contact_admin_select on public.contact_messages;
create policy contact_admin_select on public.contact_messages for select
  using (public.is_platform_admin());

-- newsletter_signups: anyone may sign up; only platform admins may read.
drop policy if exists newsletter_public_insert on public.newsletter_signups;
create policy newsletter_public_insert on public.newsletter_signups for insert
  with check (true);
drop policy if exists newsletter_admin_select on public.newsletter_signups;
create policy newsletter_admin_select on public.newsletter_signups for select
  using (public.is_platform_admin());

-- invitations: org admins (or facilitators) manage invites for their org.
drop policy if exists invitations_admin_insert on public.invitations;
create policy invitations_admin_insert on public.invitations for insert
  with check (public.is_org_admin(organization_id) and invited_by = auth.uid());
drop policy if exists invitations_admin_select on public.invitations;
create policy invitations_admin_select on public.invitations for select
  using (public.is_org_admin(organization_id) or public.is_rsi_facilitator());
drop policy if exists invitations_admin_update on public.invitations;
create policy invitations_admin_update on public.invitations for update
  using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));
