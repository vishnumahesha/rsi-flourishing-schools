"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const addNoteSchema = z.object({
  organizationId: z.string().min(1, "School is required."),
  body: z
    .string()
    .trim()
    .min(1, "Note cannot be empty.")
    .max(5000, "Note must be 5000 characters or fewer."),
});

// ---------------------------------------------------------------------------
// Action result type
// ---------------------------------------------------------------------------

type ActionResult = { ok: true } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// addFacilitatorNote
// ---------------------------------------------------------------------------

export async function addFacilitatorNote(input: {
  organizationId: string;
  body: string;
}): Promise<ActionResult> {
  const parsed = addNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { organizationId, body } = parsed.data;

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Backend not configured." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "You must be signed in to add a note." };
  }

  const { error } = await supabase.from("facilitator_notes").insert({
    author_id: user.id,
    organization_id: organizationId,
    body,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/facilitator/notes");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// getOrgOptions
// ---------------------------------------------------------------------------

type OrgOption = { id: string; name: string };

export async function getOrgOptions(): Promise<OrgOption[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("organizations")
    .select("id, name")
    .order("name", { ascending: true });

  if (!data) return [];

  return (data as OrgOption[]).map((row) => ({ id: row.id, name: row.name }));
}
