/**
 * Data loaders for admin sub-pages (plan, team, documents).
 *
 * Queries as the signed-in user (anon key + RLS).
 *
 * Demo data is returned ONLY when Supabase is unconfigured (!supabase) or
 * NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=true. A real signed-in user with an empty
 * org receives real empty results, never fake data.
 */
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { demoGrowthAreas, demoTeam, demoDocuments } from "@/lib/content/demo";

// ---------------------------------------------------------------------------
// Growth status helpers
// ---------------------------------------------------------------------------

const GROWTH_STATUS_LABELS: Record<string, string> = {
  planning: "Planning",
  in_progress: "In progress",
  sustaining: "Sustaining",
  complete: "Complete",
};

// ---------------------------------------------------------------------------
// Plan
// ---------------------------------------------------------------------------

export type PlanGrowthArea = {
  id: string;
  domain: string;
  title: string;
  progress: number;
  statusLabel: string;
  planning: boolean;
};

export type AdminPlan = {
  isDemo: boolean;
  growthAreas: PlanGrowthArea[];
};

type GrowthRow = {
  id: string;
  domain: string;
  title: string;
  progress: number;
  status: string;
};

function demoPlan(): AdminPlan {
  return {
    isDemo: true,
    growthAreas: demoGrowthAreas.map((g) => ({
      id: g.title,
      domain: g.domain,
      title: g.title,
      progress: g.progress,
      statusLabel: g.status,
      planning: g.status === "Planning",
    })),
  };
}

function emptyPlan(): AdminPlan {
  return { isDemo: false, growthAreas: [] };
}

export async function getAdminPlan(): Promise<AdminPlan> {
  const supabase = await createClient();
  if (!supabase || isDemoMode()) return demoPlan();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyPlan();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const orgId = (profile as { organization_id: string | null } | null)?.organization_id;
  if (!orgId) return emptyPlan();

  const { data } = await supabase
    .from("growth_areas")
    .select("id, domain, title, progress, status")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as GrowthRow[];

  return {
    isDemo: false,
    growthAreas: rows.map((g) => ({
      id: g.id,
      domain: g.domain,
      title: g.title,
      progress: g.progress,
      statusLabel: GROWTH_STATUS_LABELS[g.status] ?? g.status,
      planning: g.status === "planning",
    })),
  };
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  role: string;
  initials: string;
};

export type AdminTeam = {
  isDemo: boolean;
  members: TeamMember[];
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  title: string | null;
  role: string;
};

function deriveInitials(fullName: string | null): string {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function demoAdminTeam(): AdminTeam {
  return {
    isDemo: true,
    members: demoTeam.map((m) => ({
      id: m.name,
      name: m.name,
      title: m.title,
      role: m.role,
      initials: m.initials,
    })),
  };
}

function emptyAdminTeam(): AdminTeam {
  return { isDemo: false, members: [] };
}

export async function getAdminTeam(): Promise<AdminTeam> {
  const supabase = await createClient();
  if (!supabase || isDemoMode()) return demoAdminTeam();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyAdminTeam();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const orgId = (profile as { organization_id: string | null } | null)?.organization_id;
  if (!orgId) return emptyAdminTeam();

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, title, role")
    .eq("organization_id", orgId);

  const rows = (data ?? []) as ProfileRow[];

  return {
    isDemo: false,
    members: rows.map((p) => ({
      id: p.id,
      name: p.full_name ?? "—",
      title: p.title ?? "—",
      role: p.role,
      initials: deriveInitials(p.full_name),
    })),
  };
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export type DocumentItem = {
  id: string;
  name: string;
  category: string;
  uploaded: string;
  size: string;
};

export type AdminDocuments = {
  isDemo: boolean;
  documents: DocumentItem[];
};

type DocumentRow = {
  id: string;
  name: string;
  category: string;
  size_bytes: number | null;
  created_at: string;
};

function formatCategory(raw: string): string {
  return raw.charAt(0).toUpperCase() + raw.slice(1).replace(/_/g, " ");
}

function formatSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function demoAdminDocuments(): AdminDocuments {
  return {
    isDemo: true,
    documents: demoDocuments.map((d) => ({
      id: d.name,
      name: d.name,
      category: d.category,
      uploaded: d.uploaded,
      size: d.size,
    })),
  };
}

function emptyAdminDocuments(): AdminDocuments {
  return { isDemo: false, documents: [] };
}

export async function getAdminDocuments(): Promise<AdminDocuments> {
  const supabase = await createClient();
  if (!supabase || isDemoMode()) return demoAdminDocuments();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyAdminDocuments();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const orgId = (profile as { organization_id: string | null } | null)?.organization_id;
  if (!orgId) return emptyAdminDocuments();

  const { data } = await supabase
    .from("documents")
    .select("id, name, category, size_bytes, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as DocumentRow[];

  return {
    isDemo: false,
    documents: rows.map((d) => ({
      id: d.id,
      name: d.name,
      category: formatCategory(d.category),
      uploaded: d.created_at.slice(0, 10),
      size: formatSize(d.size_bytes),
    })),
  };
}
