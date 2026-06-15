import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getResource } from "@/lib/content/resources";
import { demoGrowthAreas } from "@/lib/content/demo";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const linkedResources: Record<string, string[]> = {
  belonging: ["morning-belonging-circles"],
  staff_capacity: ["gratitude-journaling-practice"],
  student_wellbeing: ["gratitude-journaling-practice"],
};

export default function GrowthPlan() {
  return (
    <>
      <PageHeading
        title="Growth plan"
        description="Each focus area pairs a measurable goal with low-lift practices from the resource library."
      />
      <DemoNotice />
      <div className="space-y-5">
        {demoGrowthAreas.map((g) => {
          const slugs = linkedResources[g.domain] ?? [];
          return (
            <DashCard key={g.title} title={g.title} action={<Badge variant={g.status === "Planning" ? "muted" : "gold"}>{g.status}</Badge>}>
              <div className="mb-4 max-w-md">
                <div className="mb-1 flex justify-between text-xs text-slate">
                  <span>Progress</span>
                  <span>{g.progress}%</span>
                </div>
                <Progress value={g.progress} />
              </div>
              {slugs.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">Linked practices</div>
                  <ul className="divide-y divide-line rounded-lg border border-line">
                    {slugs.map((slug) => {
                      const r = getResource(slug);
                      if (!r) return null;
                      return (
                        <li key={slug}>
                          <Link href={`/resources/${slug}`} className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-paper">
                            <span className="font-medium text-navy">{r.title}</span>
                            <ChevronRight className="h-4 w-4 text-slate" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </DashCard>
          );
        })}
      </div>
    </>
  );
}
