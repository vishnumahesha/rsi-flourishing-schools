import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/Reveal";
import {
  TrustStrip,
  AIHumanSection,
  CTASection,
} from "@/components/marketing/sections";
import {
  FeatureCard,
  AudienceCard,
  ImpactMetricCard,
  ResourceCard,
} from "@/components/marketing/cards";
import {
  problemCards,
  processSteps,
  audiencePaths,
  impactOutcomes,
} from "@/lib/content/home";
import { resources } from "@/lib/content/resources";

export default function HomePage() {
  const featured = resources.slice(0, 3);

  return (
    <>
      <MarketingHero />
      <TrustStrip />

      {/* Problem */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            eyebrow="The challenge"
            title="Schools care deeply about flourishing — but often run on anecdote"
            description="Many schools want to support character skills, well-being, and community life, yet rely on hunches to know whether it's working. The platform helps move from survey findings to practical, evidence-based implementation."
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
            {problemCards.map((c) => (
              <StaggerItem key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} body={c.body} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="How it works"
            title="From report to school-wide practice, across one academic year"
            description="A clear path that pairs AI-supported analysis with human-led professional development and structured reflection."
          />
          <div className="mt-12">
            <ProcessTimeline steps={processSteps} />
          </div>
        </Container>
      </section>

      {/* Audience pathways */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            eyebrow="For everyone in the school community"
            title="One platform. Multiple entry points."
            description="Each role gets a focused experience — from school leaders and teachers to school teams, RSI facilitators, and the public."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiencePaths.map((a) => (
              <StaggerItem key={a.title}>
                <AudienceCard {...a} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <AIHumanSection />

      {/* Resource preview */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Public resource library"
              title="Evidence-informed practices, free for any school"
              description="Browse curated interventions searchable by grade, flourishing domain, character skill, and more."
            />
            <Button asChild variant="outline">
              <Link href="/resources">
                Browse all resources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <StaggerItem key={r.slug}>
                <ResourceCard resource={r} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Impact */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Impact"
            title="What schools gain"
            description="Outcomes the program is designed to support across the academic year and beyond."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {impactOutcomes.map((o, i) => (
              <StaggerItem key={o.title}>
                <ImpactMetricCard title={o.title} body={o.body} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center">
            <p className="mx-auto max-w-xl text-sm text-muted">
              Case studies, testimonials, and network-level results will appear here as the program
              progresses.
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
