import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { ImpactMetricCard } from "@/components/marketing/cards";
import { CTASection } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { impactOutcomes } from "@/lib/content/home";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "How the RSI Flourishing Schools program helps schools understand and strengthen student flourishing.",
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="From insight to lasting improvement"
        description="The program is designed to help schools build a clearer picture of flourishing and turn it into sustained, evidence-based practice."
      />

      <section className="py-20">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Outcomes"
            title="What schools gain across the year"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {impactOutcomes.map((o, i) => (
              <ImpactMetricCard key={o.title} title={o.title} body={o.body} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Stories to come"
            title="Case studies and results"
            description="As participating schools progress through the program, this space will feature their stories."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {["Case studies", "Educator testimonials", "Network-level results"].map((t) => (
              <Card key={t} className="border-dashed p-8 text-center">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-navy/5" />
                <h3 className="font-display text-base text-navy">{t}</h3>
                <p className="mt-1.5 text-sm text-muted">Coming soon</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
