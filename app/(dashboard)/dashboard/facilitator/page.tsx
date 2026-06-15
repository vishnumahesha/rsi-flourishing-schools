import Link from "next/link";
import { PageHeading, DashCard, StatCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { demoCohort } from "@/lib/content/demo";
import { School, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function FacilitatorOverview() {
  const totalEducators = demoCohort.reduce((s, c) => s + c.educators, 0);
  const avg = Math.round(demoCohort.reduce((s, c) => s + c.progress, 0) / demoCohort.length);
  return (
    <>
      <PageHeading
        title="Your cohort"
        description="Schools you're supporting through the Flourishing Schools program."
      />
      <DemoNotice />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Schools" value={demoCohort.length} icon={School} />
        <StatCard label="Educators" value={totalEducators} icon={Users} />
        <StatCard label="Avg. progress" value={`${avg}%`} icon={TrendingUp} />
      </div>

      <DashCard
        title="Schools"
        className="mt-6"
        action={<Link href="/dashboard/facilitator/schools" className="text-sm font-semibold text-crimson hover:underline">View all</Link>}
      >
        <ul className="divide-y divide-line">
          {demoCohort.map((c) => (
            <li key={c.name} className="py-4 first:pt-0 last:pb-0">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-navy">{c.name}</div>
                  <div className="text-xs text-slate">{c.stage} · {c.educators} educators</div>
                </div>
                <Badge variant={c.flag === "Needs check-in" ? "warning" : c.flag === "New" ? "muted" : "success"}>
                  {c.flag}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={c.progress} className="flex-1" />
                <span className="w-10 text-right text-xs text-slate">{c.progress}%</span>
              </div>
            </li>
          ))}
        </ul>
      </DashCard>
    </>
  );
}
