"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const TaskStatusEnum = z.enum(["backlog", "in_progress", "review", "done"]);

const UpdateTaskStatusInput = z.object({
  id: z.string().min(1, "id is required"),
  status: TaskStatusEnum,
});

type UpdateTaskStatusResult = { ok: true } | { ok: false; error: string };

export async function updateTaskStatus(input: {
  id: string;
  status: "backlog" | "in_progress" | "review" | "done";
}): Promise<UpdateTaskStatusResult> {
  const parsed = UpdateTaskStatusInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { id, status } = parsed.data;

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Backend not configured." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const { error } = await supabase
    .from("intervention_plans")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/team");
  return { ok: true };
}
