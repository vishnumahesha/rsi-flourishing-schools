import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Container } from "@/components/ui/container";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply to the Program",
  description:
    "Apply to bring the RSI Flourishing Schools Professional Development Program to your school or network.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Start your application"
        title="Bring flourishing to your school"
        description="Tell us about your school community and goals. Your progress saves automatically in this browser, so you can return any time before submitting."
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          <ApplicationForm />
        </Container>
      </section>
    </>
  );
}
