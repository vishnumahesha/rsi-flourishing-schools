/**
 * Live dashboard data loaders.
 *
 * These query Supabase AS THE SIGNED-IN USER (anon key + session cookies),
 * so Row Level Security decides what each role can see. When the backend is
 * not configured, there is no session, or the queries return nothing, each
 * loader falls back to the demonstration data so a page never breaks.
 *
 * Nothing here fabricates records: fields with no column in the schema
 * (e.g. enrollment, a per-school program "stage") are shown as "—" or derived
 * transparently from real values, never invented.
 */
import { createClient } from "@/lib/supabase/server";
import {
  demoSchool,
  demoGrowthAreas,
  demoSessions,
  demoCohort,
} from "@/lib/content/demo";

// ---------------------------------------------------------------------------
// Admin overview
// ---------------------------------------------------------------------------

export type AdminGrowthArea = {
  id: string;
  title: string;
  progress: number;
  statusLabel: string;
  planning: boolean;
};

export type AdminSession = {
  id: string;
  title: string;
  dateLabel: string;
  facilitator: string;
  upcoming: boolean;
};

export type AdminOverview = {
  isDemo: boolean;
  schoolName: string;
  subtitle: string;
  educators: number | string;
  enrollment: number | string;
  growthAreas: AdminGrowthArea[];
  sessions: AdminSession[];
};

const GROWTH_STATUS_LABELS: Record<string, string> = {
  planning: "Planning",
  in_progress: "In progress",
  sustaining: "Sustaining",
  complete: "Complete",
};

const STAFF_ROLES = ["school_admin", "teacher", "school_team_member"];

type OrgRow = { id: string; name: string; type: string | null; cohort: string | null };
type GrowthRow = { id: string; title: string; progress: number; status: string };
type SessionRow = { id: string; title: string; scheduled_for: string | null; status: string };

function isoDate(value: string | null): string {
  if (!value) return "Date TBD";
  return value.slice(0, 10);
}

function demoAdminOverview(): AdminOverview {
  return {
    isDemo: true,
    schoolName: demoSchool.name,
    subtitle: `${demoSchool.type} · ${demoSchool.cohort}`,
    educators: demoSchool.educators,
    enrollment: demoSchool.enrollment,
    growthAreas: demoGrowthAreas.map((g) => ({
      id: g.title,
      title: g.title,
      progress: g.progress,
      statusLabel: g.status,
      planning: g.status === "Planning",
    })),
    sessions: demoSessions.map((s) => ({
      id: s.title,
      title: s.title,
      dateLabel: s.date,
      facilitator: s.facilitator,
      upcoming: s.status === "Upcoming",
    })),
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = await createClient();
  if (!supabase) return demoAdminOverview();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoAdminOverview();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const organizationId = (profile as { organization_id: string | null } | null)?.organization_id;
  if (!organizationId) return demoAdminOverview();

  const { data: orgData } = await supabase
    .from("organizations")
    .select("id, name, type, cohort")
    .eq("id", organizationId)
    .maybeSingle();

  const org = orgData as OrgRow | null;
  if (!org) return demoAdminOverview();

  const [growthRes, sessionRes, educatorRes] = await Promise.all([
    supabase
      .from("growth_areas")
      .select("id, title, progress, status")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("pd_sessions")
      .select("id, title, scheduled_for, status")
      .eq("organization_id", org.id)
      .order("scheduled_for", { ascending: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .in("role", STAFF_ROLES),
  ]);

  const growthRows = (growthRes.data ?? []) as GrowthRow[];
  const sessionRows = (sessionRes.data ?? []) as SessionRow[];

  return {
    isDemo: false,
    schoolName: org.name,
    subtitle:
      [org.type, org.cohort].filter(Boolean).join(" · ") ||
      "Flourishing Schools program",
    educators: educatorRes.count ?? 0,
    // No enrollment column exists in the schema — never invent a figure.
    enrollment: "—",
    growthAreas: growthRows.map((g) => ({
      id: g.id,
      title: g.title,
      progress: g.progress,
      statusLabel: GROWTH_STATUS_LABELS[g.status] ?? g.status,
      planning: g.status === "planning",
    })),
    sessions: sessionRows.map((s) => ({
      id: s.id,
      title: s.title,
      dateLabel: isoDate(s.scheduled_for),
      facilitator: "RSI Facilitator",
      upcoming: s.status === "scheduled",
    })),
  };
}

// ---------------------------------------------------------------------------
// Facilitator overview
// ---------------------------------------------------------------------------

export type FacilitatorFlag = "success" | "warning" | "muted";

export type FacilitatorSchool = {
  id: string;
  name: string;
  stageLabel: string;
  educators: number;
  progress: number;
  flagLabel: string;
  flagVariant: FacilitatorFlag;
};

export type FacilitatorOverview = {
  isDemo: boolean;
  schools: FacilitatorSchool[];
  totalEducators: number;
  avgProgress: number;
};

function flagFor(label: string): FacilitatorFlag {
  if (label === "Needs check-in") return "warning";
  if (label === "New") return "muted";
  return "success";
}

/** Derive a check-in signal from real progress — computed, not fabricated. */
function deriveFlag(progress: number): string {
  if (progress === 0) return "New";
  if (progress < 30) return "Needs check-in";
  return "On track";
}

function demoFacilitatorOverview(): FacilitatorOverview {
  const schools: FacilitatorSchool[] = demoCohort.map((c) => ({
    id: c.name,
    name: c.name,
    stageLabel: c.stage,
    educators: c.educators,
    progress: c.progress,
    flagLabel: c.flag,
    flagVariant: flagFor(c.flag),
  }));
  return {
    isDemo: true,
    schools,
    totalEducators: schools.reduce((s, c) => s + c.educators, 0),
    avgProgress: Math.round(
      schools.reduce((s, c) => s + c.progress, 0) / schools.length,
    ),
  };
}

type FacilitatorProfileRow = { organization_id: string | null; role: string };
type FacilitatorGrowthRow = { organization_id: string | null; progress: number };

export async function getFacilitatorOverview(): Promise<FacilitatorOverview> {
  const supabase = await createClient();
  if (!supabase) return demoFacilitatorOverview();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoFacilitatorOverview();

  // RLS lets a facilitator read every organization; a non-facilitator only
  // sees their own. Either way we render whatever the session is allowed.
  const { data: orgData } = await supabase
    .from("organizations")
    .select("id, name, type, cohort")
    .order("name", { ascending: true });

  const orgs = (orgData ?? []) as OrgRow[];
  if (orgs.length === 0) return demoFacilitatorOverview();

  const [growthRes, profileRes] = await Promise.all([
    supabase.from("growth_areas").select("organization_id, progress"),
    supabase.from("profiles").select("organization_id, role").in("role", STAFF_ROLES),
  ]);

  const growthRows = (growthRes.data ?? []) as FacilitatorGrowthRow[];
  const profileRows = (profileRes.data ?? []) as FacilitatorProfileRow[];

  const progressByOrg = new Map<string, number[]>();
  for (const row of growthRows) {
    if (!row.organization_id) continue;
    const list = progressByOrg.get(row.organization_id) ?? [];
    list.push(row.progress);
    progressByOrg.set(row.organization_id, list);
  }

  const educatorsByOrg = new Map<string, number>();
  for (const row of profileRows) {
    if (!row.organization_id) continue;
    educatorsByOrg.set(row.organization_id, (educatorsByOrg.get(row.organization_id) ?? 0) + 1);
  }

  const schools: FacilitatorSchool[] = orgs.map((org) => {
    const progresses = progressByOrg.get(org.id) ?? [];
    const progress = progresses.length
      ? Math.round(progresses.reduce((s, p) => s + p, 0) / progresses.length)
      : 0;
    const flagLabel = deriveFlag(progress);
    return {
      id: org.id,
      name: org.name,
      stageLabel: org.cohort || org.type || "Flourishing Schools program",
      educators: educatorsByOrg.get(org.id) ?? 0,
      progress,
      flagLabel,
      flagVariant: flagFor(flagLabel),
    };
  });

  const totalEducators = schools.reduce((s, c) => s + c.educators, 0);
  const avgProgress = schools.length
    ? Math.round(schools.reduce((s, c) => s + c.progress, 0) / schools.length)
    : 0;

  return { isDemo: false, schools, totalEducators, avgProgress };
}
