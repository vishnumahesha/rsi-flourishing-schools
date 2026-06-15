import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { ResponsibleAINotice } from "@/components/marketing/ResponsibleAINotice";

export const metadata: Metadata = {
  title: "Responsible AI",
  description: "How AI is used responsibly across the RSI Flourishing Schools platform.",
};

const does = [
  "Cross-references school goals with report findings",
  "Surfaces possible strengths and areas for growth",
  "Suggests interventions only from a curated, evidence-based database",
  "Drafts reflection prompts and progress summaries",
  "Labels every output as draft support for human review",
];

const doesNot = [
  "Invent research or fabricate citations",
  "Recommend interventions that aren't in the curated database",
  "Diagnose students or make mental-health claims",
  "Require personally identifiable student data",
  "Make final decisions on behalf of schools",
];

export default function ResponsibleAIPage() {
  return (
    <>
      <PageHero
        eyebrow="Responsible AI"
        title="AI that supports judgment, never replaces it"
        description="The platform uses AI to organize and accelerate insight while keeping educators and the RSI research team firmly in control."
      />
      <section className="py-20">
        <Container size="narrow">
          <ResponsibleAINotice className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-lg text-navy">What the AI does</h3>
              <ul className="mt-4 space-y-2.5">
                {does.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-slate">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-lg text-navy">What the AI never does</h3>
              <ul className="mt-4 space-y-2.5">
                {doesNot.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-slate">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="prose-rsi mt-12">
            <h2>Human review at every step</h2>
            <p>
              AI outputs are starting points for professional discussion. RSI facilitators and school
              teams review, adapt, and contextualize all recommendations before acting on them. This
              keeps the program grounded in professional judgment and each school&apos;s context.
            </p>
            <h2>Data protection</h2>
            <p>
              Uploaded school reports remain private and protected. The platform is designed to work
              with school-level information rather than student-level personal data.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
