import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { PageHeading, DashCard } from "@/components/dashboard/primitives";
import { LogoutButton } from "./LogoutButton";

export default async function SettingsPage() {
  const supabase = await createClient();

  let email = "";
  let roleLabel = "Member";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      email = user.email ?? "";
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, role")
        .eq("id", user.id)
        .single();

      email = profile?.email ?? email;
      roleLabel = ROLE_LABELS[profile?.role ?? ""] ?? "Member";
    }
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Settings"
        description="Manage your account preferences."
      />

      <DashCard title="Account">
        <dl className="space-y-3 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-8">
            <dt className="w-32 shrink-0 font-medium text-slate">Email</dt>
            <dd className="text-navy">{email || "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-8">
            <dt className="w-32 shrink-0 font-medium text-slate">Role</dt>
            <dd className="text-navy">{roleLabel}</dd>
          </div>
        </dl>
      </DashCard>

      <DashCard
        title="Notifications"
        description="Control how RSI Flourishing contacts you."
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 opacity-60">
            <div>
              <p className="text-sm font-medium text-navy">Email notifications</p>
              <p className="text-xs text-slate">
                Email notifications are not configured yet.
              </p>
            </div>
            <span className="rounded-full bg-line px-3 py-1 text-xs font-medium text-slate">
              Coming soon
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 opacity-60">
            <div>
              <p className="text-sm font-medium text-navy">Weekly digest</p>
              <p className="text-xs text-slate">
                Email notifications are not configured yet.
              </p>
            </div>
            <span className="rounded-full bg-line px-3 py-1 text-xs font-medium text-slate">
              Coming soon
            </span>
          </div>
        </div>
      </DashCard>

      <DashCard title="Session">
        <div className="space-y-2">
          <p className="text-sm text-slate">
            Sign out of your account on this device.
          </p>
          <LogoutButton />
        </div>
      </DashCard>
    </div>
  );
}
