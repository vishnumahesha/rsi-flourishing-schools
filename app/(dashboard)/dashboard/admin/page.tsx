import Link from "next/link";
import { PageHeading, DashCard, StatCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { demoSchool, demoGrowthAreas, demoSessions } from "@/lib/content/demo";
import { Users, Target, CalendarDays, Sparkles, ArrowRight } from "lucide-react";

export default function AdminOverview() {
  const upcoming = demoSessions.filter((s) => s.status === "Upcoming");
  return (
    <>
      <PageHeading
        title={demoSchool.name}
        description={`${demoSchool.type} · ${demoSchool.cohort}`}
        action={
          <Link href="/dashboard/admin/analysis" className="inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-ivory hover:bg-crimson-strong">
            <Sparkles className="h-4 w-4" /> Run AI analysis
          </Link>
        }
      />
      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Educators" value={demoSchool.educators} icon={Users} />
        <StatCard label="Focus areas" value={demoGrowthAreas.length} icon={Target} />
        <StatCard label="Sessions" value={demoSessions.length} hint={`${upcoming.length} upcoming`} icon={CalendarDays} />
        <StatCard label="Enrollment" value={demoSchool.enrollment} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DashCard title="Growth areas" description="Your current flourishing priorities" className="lg:col-span-2" action={<Link href="/dashboard/admin/plan" className="text-sm font-semibold text-crimson hover:underline">View plan</Link>}>
          <div className="space-y-5">
            {demoGrowthAreas.map((g) => (
              <div key={g.title}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-navy">{g.title}</span>
                  <Badge variant={g.status === "Planning" ? "muted" : "gold"}>{g.status}</Badge>
                </div>
                <Progress value={g.progress} />
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title="Upcoming sessions">
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate">No upcoming sessions scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((s) => (
                <li key={s.title} className="rounded-lg border border-line p-3">
                  <div className="text-sm font-medium text-navy">{s.title}</div>
                  <div className="mt-1 text-xs text-slate">{s.date} · {s.facilitator}</div>
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
