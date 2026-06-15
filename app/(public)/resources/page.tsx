import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { ResourceLibrary } from "@/components/resources/ResourceLibrary";
import { resources } from "@/lib/content/resources";

export const metadata: Metadata = {
  title: "Public Resources",
  description:
    "A curated, evidence-informed library of practices for supporting flourishing in schools — free for any educator.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Public resource library"
        title="Evidence-informed practices for flourishing"
        description="Curated resources any school can use, searchable by grade, flourishing domain, character skill, and evidence strength."
      />
      <section className="py-16">
        <Container size="wide">
          <ResourceLibrary resources={resources} />
        </Container>
      </section>
    </>
  );
}
