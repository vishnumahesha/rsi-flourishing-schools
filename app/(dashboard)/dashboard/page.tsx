import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dashboardPathForRole } from "@/lib/auth/roles";

/** Routes a signed-in user to their role dashboard; demo → applicant. */
export default async function DashboardIndex() {
  const supabase = await createClient();
  if (!supabase) redirect("/dashboard/applicant");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(dashboardPathForRole(profile?.role));
}
