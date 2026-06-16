/**
 * Live data loaders for team pages.
 *
 * Queries run AS THE SIGNED-IN USER (anon key + session cookies) so RLS decides
 * what each member can see. Falls back to demo data when Supabase is unconfigured,
 * the session is absent, or the query returns no rows.
 *
 * No values are fabricated. Missing joins → "Member" or "". Missing columns → "—".
 */
import { createClient } from "@/lib/supabase/server";
import { demoThreads, demoTasks, type TaskStatus } from "@/lib/content/demo";

// ---------------------------------------------------------------------------
// Forum
// ---------------------------------------------------------------------------

export type ForumThread = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  replies: number;
  lastActivity: string;
};

export type TeamForum = {
  isDemo: boolean;
  threads: ForumThread[];
};

type ThreadRow = {
  id: string;
  title: string;
  excerpt: string | null;
  author_id: string | null;
  last_activity: string;
};

type ProfileRow = { id: string; full_name: string | null };
type PostCountRow = { thread_id: string };

function demoForum(): TeamForum {
  return { isDemo: true, threads: demoThreads };
}

export async function getTeamForum(): Promise<TeamForum> {
  const supabase = await createClient();
  if (!supabase) return demoForum();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoForum();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const organizationId = (profile as { organization_id: string | null } | null)
    ?.organization_id;
  if (!organizationId) return demoForum();

  const { data: threadData } = await supabase
    .from("forum_threads")
    .select("id, title, excerpt, author_id, last_activity")
    .eq("organization_id", organizationId)
    .order("last_activity", { ascending: false });

  const threads = (threadData ?? []) as ThreadRow[];
  if (threads.length === 0) return demoForum();

  // Resolve author names and post counts in parallel.
  const authorIds = [...new Set(threads.map((t) => t.author_id).filter(Boolean))] as string[];

  const [profileRes, postRes] = await Promise.all([
    authorIds.length > 0
      ? supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", authorIds)
      : Promise.resolve({ data: [] }),
    supabase
      .from("forum_posts")
      .select("thread_id")
      .in(
        "thread_id",
        threads.map((t) => t.id),
      ),
  ]);

  const profileMap = new Map<string, string>();
  for (const p of (profileRes.data ?? []) as ProfileRow[]) {
    if (p.full_name) profileMap.set(p.id, p.full_name);
  }

  const replyCounts = new Map<string, number>();
  for (const row of (postRes.data ?? []) as PostCountRow[]) {
    replyCounts.set(row.thread_id, (replyCounts.get(row.thread_id) ?? 0) + 1);
  }

  return {
    isDemo: false,
    threads: threads.map((t) => ({
      id: t.id,
      title: t.title,
      excerpt: t.excerpt ?? "",
      author: t.author_id ? (profileMap.get(t.author_id) ?? "Member") : "Member",
      replies: replyCounts.get(t.id) ?? 0,
      lastActivity: t.last_activity.slice(0, 10),
    })),
  };
}

// ---------------------------------------------------------------------------
// Tasks (Action Board)
// ---------------------------------------------------------------------------

export type TeamTask = {
  id: string;
  title: string;
  owner: string;
  domain: string;
  status: TaskStatus;
};

export type TeamTasks = {
  isDemo: boolean;
  tasks: TeamTask[];
};

type PlanRow = {
  id: string;
  title: string;
  status: string;
  owner_id: string | null;
  growth_area_id: string | null;
};

type GrowthAreaRow = { id: string; domain: string };
type OwnerProfileRow = { id: string; full_name: string | null };

function initialsFrom(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

function demoTeamTasks(): TeamTasks {
  return { isDemo: true, tasks: demoTasks };
}

const VALID_STATUSES = new Set<TaskStatus>(["backlog", "in_progress", "review", "done"]);

function toTaskStatus(raw: string): TaskStatus {
  return VALID_STATUSES.has(raw as TaskStatus) ? (raw as TaskStatus) : "backlog";
}

export async function getTeamTasks(): Promise<TeamTasks> {
  const supabase = await createClient();
  if (!supabase) return demoTeamTasks();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return demoTeamTasks();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const organizationId = (profile as { organization_id: string | null } | null)
    ?.organization_id;
  if (!organizationId) return demoTeamTasks();

  const { data: planData } = await supabase
    .from("intervention_plans")
    .select("id, title, status, owner_id, growth_area_id")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  const plans = (planData ?? []) as PlanRow[];
  if (plans.length === 0) return demoTeamTasks();

  const growthAreaIds = [...new Set(plans.map((p) => p.growth_area_id).filter(Boolean))] as string[];
  const ownerIds = [...new Set(plans.map((p) => p.owner_id).filter(Boolean))] as string[];

  const [growthRes, ownerRes] = await Promise.all([
    growthAreaIds.length > 0
      ? supabase
          .from("growth_areas")
          .select("id, domain")
          .in("id", growthAreaIds)
      : Promise.resolve({ data: [] }),
    ownerIds.length > 0
      ? supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", ownerIds)
      : Promise.resolve({ data: [] }),
  ]);

  const domainMap = new Map<string, string>();
  for (const g of (growthRes.data ?? []) as GrowthAreaRow[]) {
    domainMap.set(g.id, g.domain);
  }

  const ownerMap = new Map<string, string>();
  for (const p of (ownerRes.data ?? []) as OwnerProfileRow[]) {
    if (p.full_name) ownerMap.set(p.id, initialsFrom(p.full_name));
  }

  return {
    isDemo: false,
    tasks: plans.map((p) => ({
      id: p.id,
      title: p.title,
      owner: p.owner_id ? (ownerMap.get(p.owner_id) ?? "") : "",
      domain: p.growth_area_id ? (domainMap.get(p.growth_area_id) ?? "") : "",
      status: toTaskStatus(p.status),
    })),
  };
}
