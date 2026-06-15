-- =====================================================================
-- RSI Flourishing Schools — initial schema, RLS, and storage buckets
-- Idempotent-ish: safe to run once on a fresh project.
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum (
    'public_user','applicant','school_admin','teacher',
    'school_team_member','rsi_facilitator','platform_admin'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'draft','submitted','under_review','interview','accepted','declined','withdrawn'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_category as enum (
    'flourishing_report','mission_statement','values','wellbeing_program',
    'sel_program','character_education','strategic_plan','school_improvement_plan','other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type growth_status as enum ('planning','in_progress','sustaining','complete');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('backlog','in_progress','review','done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type session_status as enum ('scheduled','completed','cancelled');
exception when duplicate_object then null; end $$;

-- ---------- Core tables ----------
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  type text,
  cohort text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role user_role not null default 'applicant',
  organization_id uuid references organizations(id) on delete set null,
  title text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references auth.users(id) on delete set null,
  organization_id uuid references organizations(id) on delete set null,
  school_name text,
  status application_status not null default 'submitted',
  payload jsonb not null default '{}'::jsonb,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  name text not null,
  category document_category not null default 'other',
  storage_path text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists analysis_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  source text not null default 'demo',
  summary text,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists growth_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  domain text not null,
  title text not null,
  rationale text,
  status growth_status not null default 'planning',
  progress int not null default 0 check (progress between 0 and 100),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  domains text[] not null default '{}',
  grade_levels text[] not null default '{}',
  evidence_strength text,
  difficulty text,
  is_public boolean not null default true,
  source_citation text default 'Placeholder citation',
  overview text,
  practical_steps text[] not null default '{}',
  related_research text,
  created_at timestamptz not null default now()
);

create table if not exists intervention_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  growth_area_id uuid references growth_areas(id) on delete set null,
  title text not null,
  description text,
  status task_status not null default 'backlog',
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists pd_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  scheduled_for timestamptz,
  facilitator_id uuid references auth.users(id) on delete set null,
  status session_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  prompt text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists forum_threads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  excerpt text,
  last_activity timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references forum_threads(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists facilitator_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Helper functions (SECURITY DEFINER avoids RLS recursion) ----------
create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'platform_admin');
$$;

create or replace function public.is_rsi_facilitator()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('rsi_facilitator','platform_admin')
  );
$$;

create or replace function public.is_org_member(org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and organization_id = org
  ) or public.is_rsi_facilitator();
$$;

create or replace function public.is_org_admin(org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and organization_id = org and role = 'school_admin'
  ) or public.is_rsi_facilitator();
$$;

-- ---------- New-user trigger: create a profile row ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'applicant'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Enable RLS ----------
alter table organizations      enable row level security;
alter table profiles           enable row level security;
alter table applications       enable row level security;
alter table documents          enable row level security;
alter table analysis_runs      enable row level security;
alter table growth_areas       enable row level security;
alter table resources          enable row level security;
alter table intervention_plans enable row level security;
alter table pd_sessions        enable row level security;
alter table reflections        enable row level security;
alter table forum_threads      enable row level security;
alter table forum_posts        enable row level security;
alter table facilitator_notes  enable row level security;
alter table audit_logs         enable row level security;

-- ---------- Policies ----------
-- profiles
drop policy if exists profiles_self_select on profiles;
create policy profiles_self_select on profiles for select
  using (id = auth.uid() or is_rsi_facilitator()
    or organization_id in (select organization_id from profiles where id = auth.uid()));
drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles for all
  using (is_platform_admin()) with check (is_platform_admin());

-- organizations
drop policy if exists orgs_member_select on organizations;
create policy orgs_member_select on organizations for select
  using (is_org_member(id));
drop policy if exists orgs_admin_update on organizations;
create policy orgs_admin_update on organizations for update
  using (is_org_admin(id)) with check (is_org_admin(id));
drop policy if exists orgs_facilitator_insert on organizations;
create policy orgs_facilitator_insert on organizations for insert
  with check (is_rsi_facilitator());

-- applications
drop policy if exists apps_insert_own on applications;
create policy apps_insert_own on applications for insert
  with check (submitted_by = auth.uid());
drop policy if exists apps_select on applications;
create policy apps_select on applications for select
  using (submitted_by = auth.uid() or is_rsi_facilitator()
    or (organization_id is not null and is_org_admin(organization_id)));
drop policy if exists apps_review_update on applications;
create policy apps_review_update on applications for update
  using (is_rsi_facilitator()) with check (is_rsi_facilitator());

-- generic org-scoped read/write helper pattern
drop policy if exists docs_rw on documents;
create policy docs_rw on documents for all
  using (is_org_member(organization_id)) with check (is_org_member(organization_id));

drop policy if exists analysis_rw on analysis_runs;
create policy analysis_rw on analysis_runs for all
  using (is_org_member(organization_id)) with check (is_org_member(organization_id));

drop policy if exists growth_rw on growth_areas;
create policy growth_rw on growth_areas for all
  using (is_org_member(organization_id)) with check (is_org_member(organization_id));

drop policy if exists plans_rw on intervention_plans;
create policy plans_rw on intervention_plans for all
  using (is_org_member(organization_id)) with check (is_org_member(organization_id));

drop policy if exists sessions_select on pd_sessions;
create policy sessions_select on pd_sessions for select
  using (is_org_member(organization_id));
drop policy if exists sessions_manage on pd_sessions;
create policy sessions_manage on pd_sessions for all
  using (is_rsi_facilitator()) with check (is_rsi_facilitator());

-- reflections: private to author; facilitators may read
drop policy if exists reflections_owner on reflections;
create policy reflections_owner on reflections for all
  using (author_id = auth.uid()) with check (author_id = auth.uid());
drop policy if exists reflections_facilitator_read on reflections;
create policy reflections_facilitator_read on reflections for select
  using (is_rsi_facilitator());

-- forum
drop policy if exists threads_rw on forum_threads;
create policy threads_rw on forum_threads for all
  using (is_org_member(organization_id)) with check (is_org_member(organization_id));
drop policy if exists posts_select on forum_posts;
create policy posts_select on forum_posts for select
  using (exists (select 1 from forum_threads t
    where t.id = thread_id and is_org_member(t.organization_id)));
drop policy if exists posts_insert on forum_posts;
create policy posts_insert on forum_posts for insert
  with check (author_id = auth.uid() and exists (select 1 from forum_threads t
    where t.id = thread_id and is_org_member(t.organization_id)));

-- facilitator notes: facilitators/admins only
drop policy if exists notes_facilitator on facilitator_notes;
create policy notes_facilitator on facilitator_notes for all
  using (is_rsi_facilitator()) with check (is_rsi_facilitator());

-- resources: public read of public rows; facilitators manage
drop policy if exists resources_public_read on resources;
create policy resources_public_read on resources for select
  using (is_public or is_rsi_facilitator());
drop policy if exists resources_manage on resources;
create policy resources_manage on resources for all
  using (is_rsi_facilitator()) with check (is_rsi_facilitator());

-- audit logs: platform admin only
drop policy if exists audit_admin on audit_logs;
create policy audit_admin on audit_logs for select using (is_platform_admin());

-- ---------- Storage buckets ----------
insert into storage.buckets (id, name, public) values
  ('school-documents','school-documents', false),
  ('resource-files','resource-files', true),
  ('profile-avatars','profile-avatars', true),
  ('public-assets','public-assets', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "public read resource-files" on storage.objects;
create policy "public read resource-files" on storage.objects for select
  using (bucket_id in ('resource-files','profile-avatars','public-assets'));

drop policy if exists "auth upload avatars" on storage.objects;
create policy "auth upload avatars" on storage.objects for insert
  with check (bucket_id = 'profile-avatars' and auth.role() = 'authenticated');

drop policy if exists "school-docs read members" on storage.objects;
create policy "school-docs read members" on storage.objects for select
  using (bucket_id = 'school-documents' and auth.role() = 'authenticated');

drop policy if exists "school-docs write members" on storage.objects;
create policy "school-docs write members" on storage.objects for insert
  with check (bucket_id = 'school-documents' and auth.role() = 'authenticated');
