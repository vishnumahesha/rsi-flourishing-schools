import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getFacilitatorSchools } from "@/lib/dashboard/facilitator-sub";

export default async function FacilitatorSchools() {
  const data = await getFacilitatorSchools();
  return (
    <>
      <PageHeading
        title="Schools"
        description="A closer view of each school's stage, focus areas, and momentum."
      />
      {data.isDemo && <DemoNotice />}
      <div className="space-y-4">
        {data.schools.map((c) => (
          <DashCard
            key={c.id}
            title={c.name}
            description={c.descriptor}
          >
            <div className="mb-4 max-w-md">
              <div className="mb-1 flex justify-between text-xs text-slate">
                <span>Overall progress</span><span>{c.progress}%</span>
              </div>
              <Progress value={c.progress} />
            </div>
            <div className="flex flex-wrap gap-2">
              {c.growthAreaTitles.map((title) => (
                <Badge key={title} variant="outline">{title}</Badge>
              ))}
            </div>
          </DashCard>
        ))}
      </div>
    </>
  );
}
