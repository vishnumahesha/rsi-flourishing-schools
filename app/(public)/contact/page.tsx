import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Research Schools International team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk with the RSI team"
        description="Interested in the program, the survey, or partnership? Send a note and we'll follow up."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <ContactForm />
            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-paper p-6">
                <h3 className="font-display text-lg text-navy">Program inquiries</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  For questions about the Flourishing Schools Professional Development Program and how
                  to apply.
                </p>
                <a
                  href="mailto:flourishingschools@fas.harvard.edu"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson hover:text-crimson-strong"
                >
                  <Mail className="h-4 w-4" />
                  flourishingschools@fas.harvard.edu
                </a>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-6">
                <h3 className="font-display text-lg text-navy">General contact</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  For all other questions about Research Schools International.
                </p>
                <a
                  href="mailto:flourishingschools@fas.harvard.edu"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-crimson hover:text-crimson-strong"
                >
                  <Mail className="h-4 w-4" />
                  flourishingschools@fas.harvard.edu
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
