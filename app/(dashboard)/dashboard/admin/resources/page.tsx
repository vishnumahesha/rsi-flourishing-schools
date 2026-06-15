import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ResourceRecommender } from "@/components/ai/ResourceRecommender";

export default function AdminResourcesPage() {
  return (
    <>
      <PageHeading
        title="Recommended resources"
        description="Filter the curated library by domain and grade to find practices that fit your goals."
      />
      <DemoNotice>
        Recommendations are drawn only from the curated resource library — no
        external or fabricated sources.
      </DemoNotice>
      <ResourceRecommender defaultDomains={["belonging", "staff_capacity"]} />
    </>
  );
}
