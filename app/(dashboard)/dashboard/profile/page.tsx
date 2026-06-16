import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { PageHeading, DashCard } from "@/components/dashboard/primitives";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="py-10 text-center text-slate">
        Database not configured. Profile unavailable in demo mode.
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="py-10 text-center text-slate">
        Please{" "}
        <a href="/login" className="text-crimson underline">
          sign in
        </a>{" "}
        to view your profile.
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, organization_id, title")
    .eq("id", user.id)
    .single();

  let orgName: string | null = null;
  if (profile?.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .single();
    orgName = org?.name ?? null;
  }

  const displayName = profile?.full_name ?? user.email ?? "User";
  const email = profile?.email ?? user.email ?? "";
  const roleLabel = ROLE_LABELS[profile?.role ?? ""] ?? "Member";

  return (
    <div className="space-y-6">
      <PageHeading
        title="Profile"
        description="Your account information and display name."
      />

      <DashCard title="Account">
        <dl className="space-y-3 text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-8">
            <dt className="w-32 shrink-0 font-medium text-slate">Email</dt>
            <dd className="text-navy">{email}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-8">
            <dt className="w-32 shrink-0 font-medium text-slate">Role</dt>
            <dd className="text-navy">{roleLabel}</dd>
          </div>
          {profile?.title && (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-8">
              <dt className="w-32 shrink-0 font-medium text-slate">Title</dt>
              <dd className="text-navy">{profile.title}</dd>
            </div>
          )}
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-8">
            <dt className="w-32 shrink-0 font-medium text-slate">Organization</dt>
            <dd className="text-navy">{orgName ?? "—"}</dd>
          </div>
        </dl>
      </DashCard>

      <DashCard
        title="Display name"
        description="How your name appears across the platform."
      >
        <ProfileForm initialName={displayName} />
      </DashCard>
    </div>
  );
}
