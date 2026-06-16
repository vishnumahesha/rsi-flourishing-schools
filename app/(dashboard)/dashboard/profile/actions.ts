"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const UpdateDisplayNameSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer"),
});

type UpdateDisplayNameInput = z.infer<typeof UpdateDisplayNameSchema>;

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateDisplayName(
  input: UpdateDisplayNameInput,
): Promise<ActionResult> {
  const parsed = UpdateDisplayNameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Database not configured" };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Not authenticated" };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/dashboard/profile");
  return { ok: true };
}
