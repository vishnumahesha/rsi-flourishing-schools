/**
 * Data loaders for facilitator sub-pages (sessions, notes, schools).
 * Mirrors the pattern in queries.ts: query as the signed-in user via RLS,
 * fall back to demo data when Supabase is unconfigured, no user, or no rows.
 */
import { createClient } from "@/lib/supabase/server";
import {
  demoSessions,
  demoFacilitatorNotes,
  demoCohort,
  demoGrowthAreas,
} from "@/lib/content/demo";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function isoDate(value: string | null): string {
  if (!value) return "Date TBD";
  return value.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export type Session = {
  id: string;
  title: string;
  dateLabel: string;
};

export type FacilitatorSessionsResult = {
  isDemo: boolean;
  upcoming: Session[];
  past: Session[];
};

type PdSessionRow = {
  id: string;
  title: string;
  scheduled_for: string | null;
  status: string;
};

export async function getFacilitatorSessions(): Promise<FacilitatorSessionsResult> {
  const supabase = await createClient();
  if (!supabase) return demoSessionsResult();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoSessionsResult();

  const { data } = await supabase
    .from("pd_sessions")
    .select("id, title, scheduled_for, status")
    .order("scheduled_for", { ascending: true });

  const rows = (data ?? []) as PdSessionRow[];
  if (rows.length === 0) return demoSessionsResult();

  const toSession = (r: PdSessionRow): Session => ({
    id: r.id,
    title: r.title,
    dateLabel: isoDate(r.scheduled_for),
  });

  return {
    isDemo: false,
    upcoming: rows.filter((r) => r.status === "scheduled").map(toSession),
    past: rows.filter((r) => r.status !== "scheduled").map(toSession),
  };
}

function demoSessionsResult(): FacilitatorSessionsResult {
  const toSession = (s: (typeof demoSessions)[number]): Session => ({
    id: s.title,
    title: s.title,
    dateLabel: s.date,
  });
  return {
    isDemo: true,
    upcoming: demoSessions.filter((s) => s.status === "Upcoming").map(toSession),
    past: demoSessions.filter((s) => s.status !== "Upcoming").map(toSession),
  };
}

// ---------------------------------------------------------------------------
// Facilitator notes
// ---------------------------------------------------------------------------

export type FacilitatorNote = {
  id: string;
  school: string;
  date: string;
  note: string;
};

export type FacilitatorNotesResult = {
  isDemo: boolean;
  notes: FacilitatorNote[];
};

type FacilitatorNoteRow = {
  id: string;
  organization_id: string | null;
  body: string;
  created_at: string;
};

type OrgRow = { id: string; name: string };

export async function getFacilitatorNotes(): Promise<FacilitatorNotesResult> {
  const supabase = await createClient();
  if (!supabase) return demoNotesResult();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoNotesResult();

  const [notesRes, orgsRes] = await Promise.all([
    supabase
      .from("facilitator_notes")
      .select("id, organization_id, body, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("organizations").select("id, name"),
  ]);

  const rows = (notesRes.data ?? []) as FacilitatorNoteRow[];
  if (rows.length === 0) return demoNotesResult();

  const orgMap = new Map<string, string>();
  for (const org of ((orgsRes.data ?? []) as OrgRow[])) {
    orgMap.set(org.id, org.name);
  }

  return {
    isDemo: false,
    notes: rows.map((r) => ({
      id: r.id,
      school: r.organization_id ? (orgMap.get(r.organization_id) ?? "—") : "—",
      date: isoDate(r.created_at),
      note: r.body,
    })),
  };
}

function demoNotesResult(): FacilitatorNotesResult {
  return {
    isDemo: true,
    notes: demoFacilitatorNotes.map((n) => ({
      id: n.id,
      school: n.school,
      date: n.date,
      note: n.note,
    })),
  };
}

// ---------------------------------------------------------------------------
// Schools
// ---------------------------------------------------------------------------

export type FacilitatorSchoolDetail = {
  id: string;
  name: string;
  descriptor: string;
  progress: number;
  growthAreaTitles: string[];
};

export type FacilitatorSchoolsResult = {
  isDemo: boolean;
  schools: FacilitatorSchoolDetail[];
};

type OrgDetailRow = { id: string; name: string; type: string | null; cohort: string | null };
type GrowthAreaRow = { organization_id: string | null; title: string; progress: number };

export async function getFacilitatorSchools(): Promise<FacilitatorSchoolsResult> {
  const supabase = await createClient();
  if (!supabase) return demoSchoolsResult();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoSchoolsResult();

  const [orgsRes, growthRes] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name, type, cohort")
      .order("name", { ascending: true }),
    supabase.from("growth_areas").select("organization_id, title, progress"),
  ]);

  const orgs = (orgsRes.data ?? []) as OrgDetailRow[];
  if (orgs.length === 0) return demoSchoolsResult();

  const progressByOrg = new Map<string, number[]>();
  const titlesByOrg = new Map<string, string[]>();

  for (const row of ((growthRes.data ?? []) as GrowthAreaRow[])) {
    if (!row.organization_id) continue;
    const progresses = progressByOrg.get(row.organization_id) ?? [];
    progresses.push(row.progress);
    progressByOrg.set(row.organization_id, progresses);

    const titles = titlesByOrg.get(row.organization_id) ?? [];
    titles.push(row.title);
    titlesByOrg.set(row.organization_id, titles);
  }

  return {
    isDemo: false,
    schools: orgs.map((org) => {
      const progresses = progressByOrg.get(org.id) ?? [];
      const progress = progresses.length
        ? Math.round(progresses.reduce((s, p) => s + p, 0) / progresses.length)
        : 0;
      const descriptor =
        [org.type, org.cohort].filter(Boolean).join(" · ") ||
        "Flourishing Schools program";
      return {
        id: org.id,
        name: org.name,
        descriptor,
        progress,
        growthAreaTitles: (titlesByOrg.get(org.id) ?? []).slice(0, 3),
      };
    }),
  };
}

function demoSchoolsResult(): FacilitatorSchoolsResult {
  return {
    isDemo: true,
    schools: demoCohort.map((c) => ({
      id: c.name,
      name: c.name,
      descriptor: `${c.stage} · ${c.educators} educators`,
      progress: c.progress,
      growthAreaTitles: demoGrowthAreas
        .slice(0, c.progress > 40 ? 3 : 1)
        .map((g) => g.title),
    })),
  };
}
