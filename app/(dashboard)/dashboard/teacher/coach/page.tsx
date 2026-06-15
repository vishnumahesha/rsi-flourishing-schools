import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { CoachChat } from "@/components/ai/CoachChat";

export default function CoachPage() {
  return (
    <>
      <PageHeading
        title="AI reflective coach"
        description="A thinking partner for your professional growth — reflection prompts and small next steps."
      />
      <DemoNotice>
        Without an AI provider key the coach gives clearly-labeled demonstration
        responses. It never offers clinical, legal, or crisis advice and never
        invents research citations.
      </DemoNotice>
      <CoachChat />
    </>
  );
}
