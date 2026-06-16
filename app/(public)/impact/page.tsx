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

interface DocumentationItem {
  label: string;
  description: string;
}

const documentationItems: DocumentationItem[] = [
  {
    label: "School-level stories",
    description:
      "How individual schools used their Flourishing Schools report to identify priorities and shape professional development over the year.",
  },
  {
    label: "Implementation examples",
    description:
      "Concrete examples of how teams translated survey findings into specific practices — what they tried, what they adjusted, and why.",
  },
  {
    label: "Network-level learning",
    description:
      "Patterns and insights that emerge across participating schools, so what one school learns can inform others in the network.",
  },
  {
    label: "Longitudinal change over time",
    description:
      "For schools that complete the Flourishing Schools survey in successive years, we will track how measured flourishing shifts alongside program participation.",
  },
];

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
            eyebrow="What we will document"
            title="Building an honest evidence base"
            description="The program is in its early stages. As schools move through the work, we intend to capture the following — rigorously and over time."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {documentationItems.map((item) => (
              <Card key={item.label} className="flex flex-col gap-3 p-7">
                <h3 className="font-display text-base text-navy">{item.label}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Documentation will be shared publicly as the program matures and participating schools have had time to do sustained work.
          </p>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
