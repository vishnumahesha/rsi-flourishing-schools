import Link from "next/link";
import { PageHeading, DashCard, StatCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getAdminOverview } from "@/lib/dashboard/queries";
import { Users, Target, CalendarDays, Sparkles, ArrowRight } from "lucide-react";

export default async function AdminOverview() {
  const data = await getAdminOverview();
  const upcoming = data.sessions.filter((s) => s.upcoming);
  return (
    <>
      <PageHeading
        title={data.schoolName}
        description={data.subtitle}
        action={
          <Link href="/dashboard/admin/analysis" className="inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-ivory hover:bg-crimson-strong">
            <Sparkles className="h-4 w-4" /> Run AI analysis
          </Link>
        }
      />
      {data.isDemo && <DemoNotice />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Educators" value={data.educators} icon={Users} />
        <StatCard label="Focus areas" value={data.growthAreas.length} icon={Target} />
        <StatCard label="Sessions" value={data.sessions.length} hint={`${upcoming.length} upcoming`} icon={CalendarDays} />
        <StatCard label="Enrollment" value={data.enrollment} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DashCard title="Growth areas" description="Your current flourishing priorities" className="lg:col-span-2" action={<Link href="/dashboard/admin/plan" className="text-sm font-semibold text-crimson hover:underline">View plan</Link>}>
          {data.growthAreas.length === 0 ? (
            <p className="text-sm text-slate">No growth areas yet. Run an AI analysis to draft your plan.</p>
          ) : (
            <div className="space-y-5">
              {data.growthAreas.map((g) => (
                <div key={g.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-navy">{g.title}</span>
                    <Badge variant={g.planning ? "muted" : "gold"}>{g.statusLabel}</Badge>
                  </div>
                  <Progress value={g.progress} />
                </div>
              ))}
            </div>
          )}
        </DashCard>

        <DashCard title="Upcoming sessions">
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate">No upcoming sessions scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((s) => (
                <li key={s.id} className="rounded-lg border border-line p-3">
                  <div className="text-sm font-medium text-navy">{s.title}</div>
                  <div className="mt-1 text-xs text-slate">{s.dateLabel} · {s.facilitator}</div>
                </li>
              ))}
            </ul>
          )}
          <Link href="/dashboard/admin/resources" className="mt-4 flex items-center justify-between rounded-lg bg-navy px-3 py-2.5 text-sm font-medium text-ivory hover:bg-navy-ink">
            Explore recommended resources <ArrowRight className="h-4 w-4" />
          </Link>
        </DashCard>
      </div>
    </>
  );
}
