import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let role: string | null = null;
  let user: { name: string; email: string } | null = null;

  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", authUser.id)
        .single();
      role = profile?.role ?? "applicant";
      user = {
        name: profile?.full_name || authUser.email || "Member",
        email: authUser.email || "",
      };
    }
  }

  return (
    <DashboardShell role={role} user={user}>
      {children}
    </DashboardShell>
  );
}
