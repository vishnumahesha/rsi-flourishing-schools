import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { demoCohort, demoGrowthAreas } from "@/lib/content/demo";

export default function FacilitatorSchools() {
  return (
    <>
      <PageHeading
        title="Schools"
        description="A closer view of each school's stage, focus areas, and momentum."
      />
      <DemoNotice />
      <div className="space-y-4">
        {demoCohort.map((c) => (
          <DashCard
            key={c.name}
            title={c.name}
            description={`${c.stage} · ${c.educators} educators`}
            action={<Badge variant={c.flag === "Needs check-in" ? "warning" : c.flag === "New" ? "muted" : "success"}>{c.flag}</Badge>}
          >
            <div className="mb-4 max-w-md">
              <div className="mb-1 flex justify-between text-xs text-slate">
                <span>Overall progress</span><span>{c.progress}%</span>
              </div>
              <Progress value={c.progress} />
            </div>
            <div className="flex flex-wrap gap-2">
              {demoGrowthAreas.slice(0, c.progress > 40 ? 3 : 1).map((g) => (
                <Badge key={g.title} variant="outline">{g.title}</Badge>
              ))}
            </div>
          </DashCard>
        ))}
      </div>
    </>
  );
}
