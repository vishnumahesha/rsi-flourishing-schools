"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createThreadSchema = z.object({
  title: z.string().min(1, "Title is required").max(160, "Title must be 160 characters or fewer"),
  excerpt: z.string().max(500, "Excerpt must be 500 characters or fewer").default(""),
});

const addReplySchema = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
  body: z.string().min(1, "Reply cannot be empty").max(5000, "Reply must be 5000 characters or fewer"),
});

type ActionResult = { ok: true; id: string } | { ok: false; error: string };
type ReplyResult = { ok: true } | { ok: false; error: string };

export async function createThread(input: {
  title: string;
  excerpt: string;
}): Promise<ActionResult> {
  const parsed = createThreadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }
  const { title, excerpt } = parsed.data;

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service unavailable." };

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, error: "You must be signed in." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) return { ok: false, error: "Could not load your profile." };

  const organizationId = (profile as { organization_id: string | null } | null)?.organization_id;
  if (!organizationId) return { ok: false, error: "Join an organization first." };

  const { data, error: insertError } = await supabase
    .from("forum_threads")
    .insert({
      organization_id: organizationId,
      author_id: user.id,
      title,
      excerpt,
      last_activity: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !data) {
    return { ok: false, error: insertError?.message ?? "Could not create thread." };
  }

  revalidatePath("/dashboard/team/forum");
  return { ok: true, id: (data as { id: string }).id };
}

export async function addReply(input: {
  threadId: string;
  body: string;
}): Promise<ReplyResult> {
  const parsed = addReplySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }
  const { threadId, body } = parsed.data;

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Service unavailable." };

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, error: "You must be signed in." };

  const { error: insertError } = await supabase
    .from("forum_posts")
    .insert({ thread_id: threadId, author_id: user.id, body });

  if (insertError) return { ok: false, error: insertError.message };

  const { error: updateError } = await supabase
    .from("forum_threads")
    .update({ last_activity: new Date().toISOString() })
    .eq("id", threadId);

  if (updateError) return { ok: false, error: updateError.message };

  revalidatePath(`/dashboard/team/forum/${threadId}`);
  return { ok: true };
}
