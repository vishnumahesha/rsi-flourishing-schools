import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { AnalysisPanel } from "@/components/ai/AnalysisPanel";

export default function AnalysisPage() {
  return (
    <>
      <PageHeading
        title="AI school analysis"
        description="Turn your team's priorities into suggested focus areas, each linked to practices from the curated library."
      />
      <DemoNotice>
        Without an AI provider key this returns a clearly-labeled demonstration
        built only from curated resources. It never invents research citations.
      </DemoNotice>
      <AnalysisPanel />
    </>
  );
}
