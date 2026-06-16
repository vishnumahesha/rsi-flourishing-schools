-- =====================================================================
-- RSI Flourishing Schools — migration 0003: launch-readiness tables
-- Forward migration. Apply AFTER 0001 and 0002 via Supabase SQL editor/CLI.
-- Adds: resource_saves, resource_files. Reuses helpers from 0001
-- (is_org_member, is_rsi_facilitator). Idempotent-ish (if not exists).
-- =====================================================================

-- ---------- Resource saves (per-user bookmarks) ----------
create table if not exists public.resource_saves (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resources(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (resource_id, user_id)
);
create index if not exists resource_saves_user_idx on public.resource_saves (user_id);
create index if not exists resource_saves_resource_idx on public.resource_saves (resource_id);

-- ---------- Resource files (attachments for resources) ----------
create table if not exists public.resource_files (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resources(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  bucket text not null default 'resource-files',
  public boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists resource_files_resource_idx on public.resource_files (resource_id);

-- ---------- Enable RLS ----------
alter table public.resource_saves enable row level security;
alter table public.resource_files enable row level security;

-- ---------- Privileges (RLS still gates rows) ----------
grant select, insert, delete on public.resource_saves to authenticated;
grant select on public.resource_files to anon, authenticated;
grant insert, update, delete on public.resource_files to authenticated;

-- ---------- Policies: resource_saves (each user manages their own) ----------
drop policy if exists resource_saves_owner on public.resource_saves;
create policy resource_saves_owner on public.resource_saves for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Policies: resource_files ----------
-- Public can read files marked public; facilitators/platform admins read all.
drop policy if exists resource_files_public_read on public.resource_files;
create policy resource_files_public_read on public.resource_files for select
  using (public or public.is_rsi_facilitator());
-- Only facilitators/platform admins manage resource files.
drop policy if exists resource_files_manage on public.resource_files;
create policy resource_files_manage on public.resource_files for all
  using (public.is_rsi_facilitator()) with check (public.is_rsi_facilitator());
