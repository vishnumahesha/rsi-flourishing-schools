/**
 * Live data loaders for the teacher dashboard.
 *
 * Queries run AS THE SIGNED-IN USER (anon key + session cookies) so RLS
 * controls what each teacher sees.
 *
 * Demo data is returned ONLY when Supabase is unconfigured (!supabase) or
 * NEXT_PUBLIC_ENABLE_DEMO_FALLBACK=true. A real signed-in user with no rows
 * yet receives real empty results, never fake data.
 *
 * No fields are fabricated: columns that don't exist in the schema are
 * omitted or shown as "—".
 */
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { demoReflections, demoTasks } from "@/lib/content/demo";

// ---------------------------------------------------------------------------
// Row interfaces — cast Supabase results to these, never use `any`
// ---------------------------------------------------------------------------

type ReflectionRow = {
  id: string;
  prompt: string | null;
  body: string;
  created_at: string;
};

type TaskCountRow = { id: string };

// ---------------------------------------------------------------------------
// Teacher overview
// ---------------------------------------------------------------------------

export type TeacherRecentReflection = {
  date: string;
  prompt: string;
  body: string;
};

export type TeacherOverview = {
  isDemo: boolean;
  reflectionCount: number;
  activeTaskCount: number;
  recentReflection: TeacherRecentReflection | null;
};

function demoTeacherOverview(): TeacherOverview {
  const activeTasks = demoTasks.filter(
    (t) => t.owner === "DP" && t.status !== "done",
  );
  const recent = demoReflections[0];
  return {
    isDemo: true,
    reflectionCount: demoReflections.length,
    activeTaskCount: activeTasks.length,
    recentReflection: recent
      ? { date: recent.date, prompt: recent.prompt, body: recent.body }
      : null,
  };
}

function emptyTeacherOverview(): TeacherOverview {
  return {
    isDemo: false,
    reflectionCount: 0,
    activeTaskCount: 0,
    recentReflection: null,
  };
}

export async function getTeacherOverview(): Promise<TeacherOverview> {
  const supabase = await createClient();
  if (!supabase || isDemoMode()) return demoTeacherOverview();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyTeacherOverview();

  const [reflectionRes, taskRes, recentRes] = await Promise.all([
    supabase
      .from("reflections")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id),
    supabase
      .from("intervention_plans")
      .select("id")
      .eq("owner_id", user.id)
      .neq("status", "done"),
    supabase
      .from("reflections")
      .select("id, prompt, body, created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const reflectionCount = reflectionRes.count ?? 0;
  const activeTaskCount = ((taskRes.data ?? []) as TaskCountRow[]).length;

  const recentRow = recentRes.data as ReflectionRow | null;
  const recentReflection: TeacherRecentReflection | null = recentRow
    ? {
        date: recentRow.created_at.slice(0, 10),
        prompt: recentRow.prompt ?? "",
        body: recentRow.body,
      }
    : null;

  return {
    isDemo: false,
    reflectionCount,
    activeTaskCount,
    recentReflection,
  };
}

// ---------------------------------------------------------------------------
// Teacher reflections list
// ---------------------------------------------------------------------------

export type ReflectionEntry = {
  id: string;
  date: string;
  prompt: string;
  body: string;
};

export type TeacherReflections = {
  isDemo: boolean;
  entries: ReflectionEntry[];
};

function demoTeacherReflections(): TeacherReflections {
  return {
    isDemo: true,
    entries: demoReflections.map((r) => ({
      id: r.id,
      date: r.date,
      prompt: r.prompt,
      body: r.body,
    })),
  };
}

function emptyTeacherReflections(): TeacherReflections {
  return { isDemo: false, entries: [] };
}

export async function getTeacherReflections(): Promise<TeacherReflections> {
  const supabase = await createClient();
  if (!supabase || isDemoMode()) return demoTeacherReflections();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyTeacherReflections();

  const { data } = await supabase
    .from("reflections")
    .select("id, prompt, body, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as ReflectionRow[];

  return {
    isDemo: false,
    entries: rows.map((r) => ({
      id: r.id,
      date: r.created_at.slice(0, 10),
      prompt: r.prompt ?? "",
      body: r.body,
    })),
  };
}
