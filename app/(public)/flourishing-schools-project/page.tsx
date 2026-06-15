import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { CTASection } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Flourishing Schools Project",
  description:
    "The Human Flourishing Program's Flourishing Schools Project invites school networks to measure character skills and flourishing.",
};

export default function FSPPage() {
  return (
    <>
      <PageHero
        eyebrow="The foundation"
        title="The Flourishing Schools Project"
        description="The Human Flourishing Program invites school networks to take the Flourishing Schools survey — measuring character skills, flourishing, and the evidence-based practices that promote them."
      />

      <section className="py-20">
        <Container size="narrow">
          <div className="prose-rsi">
            <p>
              Schools aspire to support students&apos; character skills and well-being, yet often have
              only anecdotal evidence about whether their efforts are working. Assessing student
              progress beyond traditional academic measures helps schools understand where students
              are flourishing and where more support is needed.
            </p>
            <h2>What participating networks receive</h2>
            <p>
              Each participating school network and individual school within it receives a report of
              findings. The results highlight which groups are flourishing or may need more support,
              which character skills are strong or have room to grow, and the degree to which each
              school implements evidence-based programming for flourishing.
            </p>
            <h2>From report to professional development</h2>
            <p>
              RSI&apos;s optional follow-up professional development program builds directly on these
              reports. This platform hosts that program — and complements it with publicly available
              resources any school can use.
            </p>
          </div>

          <Card className="mt-10 bg-paper p-6">
            <h3 className="font-display text-lg text-navy">Selected references</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                VanderWeele, T. J., &amp; Hinton, C. (2024). Metrics for education for flourishing: A
                framework. <em>International Journal of Wellbeing</em>, 14(1), 1–35.
              </li>
              <li>
                Kristjánsson, K., &amp; VanderWeele, T. J. (2025). The proper scope of education for
                flourishing. <em>Journal of Philosophy of Education</em>, 59, 634–650.
              </li>
            </ul>
          </Card>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
