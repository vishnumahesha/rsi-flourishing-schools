import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { CTASection } from "@/components/marketing/sections";
import { ResponsibleAINotice } from "@/components/marketing/ResponsibleAINotice";
import { processSteps } from "@/lib/content/home";

export const metadata: Metadata = {
  title: "Professional Development Program",
  description:
    "An academic-year professional development program pairing AI-supported analysis with human-led sessions.",
};

export default function ProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="The program"
        title="Professional development across an academic year"
        description="A hybrid workshop sets direction; monthly virtual sessions sustain momentum as educators implement and reflect on flourishing initiatives in their own context."
      />

      <section className="py-20">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="How it works"
            title="Six stages, one connected journey"
          />
          <div className="mt-16">
            <ProcessTimeline steps={processSteps} />
          </div>
          <div className="mx-auto mt-14 max-w-2xl">
            <ResponsibleAINotice />
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
