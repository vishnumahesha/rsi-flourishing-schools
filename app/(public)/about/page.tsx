import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { CTASection } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Research Schools International offers a follow-up professional development program for schools in the Flourishing Schools Project.",
};

const principles = [
  {
    title: "Research first",
    body: "Every recommendation traces back to evidence and a curated knowledge base — not hype or guesswork.",
  },
  {
    title: "Human-led",
    body: "Technology accelerates insight, but educators and the RSI research team make the decisions.",
  },
  {
    title: "School-specific",
    body: "Findings are mapped onto each school's own goals, mission, and context before any action.",
  },
  {
    title: "Sustained over time",
    body: "Monthly sessions across an academic year build durable practice, not one-off workshops.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A follow-up professional development program for flourishing schools"
        description="Research Schools International (RSI) helps schools that participated in the Human Flourishing Program's Flourishing Schools Project deepen evidence-based practices that support students' character skills and flourishing."
      />

      <section className="py-18 py-20">
        <Container size="narrow">
          <div className="prose-rsi">
            <p>
              The program begins with a hybrid workshop that supports participating schools to map
              findings from their Flourishing Schools reports onto their own goals for supporting
              character skills and flourishing. Together, schools and facilitators identify strengths
              and areas for growth.
            </p>
            <p>
              Following the workshop, RSI leads virtual professional development that guides educators
              to create and implement flourishing initiatives targeting their priority areas — and to
              reflect on their impact. Monthly sessions run across the academic year, with educators
              meeting in person with colleagues at their school and virtually with the RSI research
              team.
            </p>
            <p>
              This platform is being developed with Harvard&apos;s IQSS Start-Up Foundry to host the
              program and to make curated, evidence-informed resources on flourishing freely
              available to any school in the world.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="What guides us"
            title="Principles behind the platform"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {principles.map((p) => (
              <Card key={p.title} className="p-6">
                <h3 className="font-display text-lg text-navy">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
