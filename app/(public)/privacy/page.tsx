import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the RSI Flourishing Schools platform handles school data and privacy.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Protecting school and student data"
        description="The platform is built so that sensitive school materials stay private and access is limited by role."
      />
      <section className="py-20">
        <Container size="narrow">
          <div className="prose-rsi">
            <h2>Data minimization</h2>
            <p>
              Schools should not upload personally identifiable student information unless they have
              explicit authorization to do so. The program is designed to work with school-level
              findings and goals — not student-level personal data.
            </p>
            <h2>How uploaded materials are used</h2>
            <p>
              Reports and school materials are used only to support school-specific program analysis
              and professional development. Uploaded school documents are stored privately and are
              never publicly accessible.
            </p>
            <h2>Role-based access</h2>
            <p>
              Access to school-specific materials is limited by role. Public users cannot see private
              school data. School administrators control who on their team has access. RSI
              facilitators can review materials only for the schools they support.
            </p>
            <h2>AI processing</h2>
            <p>
              AI-generated outputs are school-specific and secured. AI does not require personally
              identifiable student data, does not diagnose students, and does not make mental-health
              claims. See our <a href="/responsible-ai">Responsible AI</a> page for details.
            </p>
            <h2>Security practices</h2>
            <p>
              The platform uses authentication, role checks, and row-level security on private data.
              Service credentials are never exposed to the browser, and uploaded school documents are
              held in private storage with file-type and size validation.
            </p>
            <p className="text-sm text-muted">
              This page describes the platform&apos;s data-handling approach for the demo and is not a
              substitute for an organization&apos;s formal privacy policy.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
