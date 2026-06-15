import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ResourceRecommender } from "@/components/ai/ResourceRecommender";

export default function TeacherResourcesPage() {
  return (
    <>
      <PageHeading
        title="Find a practice"
        description="Tell us your focus and grade level to surface low-lift classroom practices."
      />
      <DemoNotice>Suggestions come only from the curated resource library.</DemoNotice>
      <ResourceRecommender defaultDomains={["belonging"]} />
    </>
  );
}
