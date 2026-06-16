"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const SaveReflectionInput = z.object({
  prompt: z.string().min(1, "Prompt is required").max(200, "Prompt must be 200 characters or fewer"),
  body: z
    .string()
    .transform((v) => v.trim())
    .pipe(
      z.string().min(1, "Reflection body is required").max(5000, "Body must be 5000 characters or fewer"),
    ),
});

type SaveReflectionResult = { ok: true } | { ok: false; error: string };

export async function saveReflection(input: {
  prompt: string;
  body: string;
}): Promise<SaveReflectionResult> {
  const parsed = SaveReflectionInput.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { ok: false, error: first?.message ?? "Invalid input." };
  }

  const { prompt, body } = parsed.data;

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Backend not configured." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("reflections").insert({
    author_id: user.id,
    organization_id: profile?.organization_id ?? null,
    prompt,
    body,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/teacher/reflections");
  return { ok: true };
}
