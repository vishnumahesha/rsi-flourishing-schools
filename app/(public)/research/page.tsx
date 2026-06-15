import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { ResearchPillarCard } from "@/components/marketing/cards";
import { CTASection } from "@/components/marketing/sections";
import { researchPillars, researchToPractice } from "@/lib/content/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "The three-pillar framework for education for flourishing and how research moves into school practice.",
};

const surveyMeasures = [
  "Student flourishing",
  "Character skills",
  "Cognitive and epistemic virtues",
  "Community well-being",
  "School support for flourishing",
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="A fuller framework for how students develop"
        description="Traditional academic metrics capture only part of student development. This work puts forward a three-pillar framework for assessment in education for flourishing."
      />

      <section className="py-20">
        <Container>
          <SectionHeader
            eyebrow="The framework"
            title="Three pillars of education for flourishing"
            description="Each pillar can be assessed at the individual level and at the school or system level, to see where there is adequate support."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {researchPillars.map((p) => (
              <ResearchPillarCard key={p.title} {...p} />
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted">
            Framework reference: VanderWeele, T. J., &amp; Hinton, C. (2024). Metrics for education for
            flourishing: A framework. <em>International Journal of Wellbeing</em>, 14(1).
          </p>
        </Container>
      </section>

      <section className="bg-paper py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="The survey"
                title="What the Flourishing Schools survey measures"
                description="Piloted with school communities, the survey provides insight into each school's strengths and areas for growth."
              />
              <ul className="mt-8 space-y-3">
                {surveyMeasures.map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-navy"
                  >
                    <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader
                eyebrow="Research in practice"
                title="How research becomes school action"
                description="A continuous loop from measurement to improvement."
              />
              <ol className="mt-8 space-y-3">
                {researchToPractice.map((s, i) => (
                  <li key={s.step} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crimson-soft text-xs font-semibold text-crimson">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-navy">{s.step}</div>
                      <div className="text-sm text-muted">{s.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
