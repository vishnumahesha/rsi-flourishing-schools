import Link from "next/link";
import { PageHeading, DashCard, StatCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getFacilitatorOverview } from "@/lib/dashboard/queries";
import { School, Users, TrendingUp } from "lucide-react";

export default async function FacilitatorOverview() {
  const data = await getFacilitatorOverview();
  return (
    <>
      <PageHeading
        title="Your cohort"
        description="Schools you're supporting through the Flourishing Schools program."
      />
      {data.isDemo && <DemoNotice />}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Schools" value={data.schools.length} icon={School} />
        <StatCard label="Educators" value={data.totalEducators} icon={Users} />
        <StatCard label="Avg. progress" value={`${data.avgProgress}%`} icon={TrendingUp} />
      </div>

      <DashCard
        title="Schools"
        className="mt-6"
        action={<Link href="/dashboard/facilitator/schools" className="text-sm font-semibold text-crimson hover:underline">View all</Link>}
      >
        {data.schools.length === 0 ? (
          <p className="text-sm text-slate">No schools assigned yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {data.schools.map((c) => (
              <li key={c.id} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-navy">{c.name}</div>
                    <div className="text-xs text-slate">{c.stageLabel} · {c.educators} educators</div>
                  </div>
                  <Badge variant={c.flagVariant}>{c.flagLabel}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={c.progress} className="flex-1" />
                  <span className="w-10 text-right text-xs text-slate">{c.progress}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashCard>
    </>
  );
}
