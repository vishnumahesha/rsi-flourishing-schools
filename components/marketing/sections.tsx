import Link from "next/link";
import { Brain, Users, FileSearch, ShieldCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { trustPoints } from "@/lib/content/home";

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface/70">
      <Container className="py-7">
        <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Built for schools using research from the Flourishing Schools Project — professional
          development led by Research Schools International
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustPoints.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm font-medium text-slate">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              {p}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const aiPoints = [
  {
    icon: FileSearch,
    title: "Cross-reference goals and findings",
    body: "AI compares a school's stated goals with its report findings to surface alignment, strengths, and gaps.",
  },
  {
    icon: Brain,
    title: "Suggest curated interventions",
    body: "Recommendations are drawn only from a curated, evidence-based resource database — never invented.",
  },
  {
    icon: Users,
    title: "Human review at every step",
    body: "RSI facilitators and school teams review, adapt, and contextualize every recommendation together.",
  },
  {
    icon: ShieldCheck,
    title: "Draft support, not judgment",
    body: "AI outputs are clearly labeled as drafts to inform professional discussion — not final decisions.",
  },
];

export function AIHumanSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-20 sm:py-28">
      <Container className="relative">
        <SectionHeader
          tone="light"
          align="center"
          eyebrow="AI with human review"
          title="Powerful analysis, kept firmly in human hands"
          description="The platform uses AI to organize and accelerate insight — but professional judgment, context, and care stay with educators and the RSI research team."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aiPoints.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-soft ring-1 ring-gold/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/55">
          AI does not diagnose students, make mental-health claims, or require personally
          identifiable student data. Uploaded school reports remain private and protected.
        </p>
      </Container>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-flourish" aria-hidden />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl sm:text-4xl md:text-[2.7rem]">
            Ready to turn flourishing research into school-wide practice?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate sm:text-lg">
            Supporting student flourishing takes more than good intentions. RSI helps schools use
            research, data, professional learning, and collaborative reflection to strengthen
            character skills, well-being, and community life.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/apply">
                Apply to participate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/resources">Explore resources</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/contact">Contact the RSI team</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
