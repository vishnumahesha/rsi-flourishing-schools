"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const INVITE_ROLES = ["school_admin", "teacher", "school_team_member"] as const;

const InviteSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  role: z.enum(INVITE_ROLES, {
    errorMap: () => ({ message: "Select a valid role." }),
  }),
});

export type InviteResult = { ok: true } | { ok: false; error: string };

export async function inviteMember(input: {
  email: string;
  role: string;
}): Promise<InviteResult> {
  const parsed = InviteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0].message };
  }

  const { email, role } = parsed.data;

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Backend not configured." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "You must be signed in to invite members." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  const orgId = (profile as { organization_id: string | null } | null)
    ?.organization_id;

  if (!orgId) {
    return { ok: false, error: "Join an organization first." };
  }

  const { error: insertError } = await supabase.from("invitations").insert({
    organization_id: orgId,
    invited_email: email,
    invited_role: role,
    invited_by: user.id,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  revalidatePath("/dashboard/admin/team");
  return { ok: true };
}
