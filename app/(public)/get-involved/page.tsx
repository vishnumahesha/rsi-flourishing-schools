import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Database, BookOpen, Mail, CalendarDays, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Ways to participate in the RSI Flourishing Schools program and community.",
};

const paths = [
  {
    icon: FileText,
    title: "Apply for the program",
    body: "Schools and networks can apply to join the professional development program.",
    href: "/apply",
    cta: "Start application",
  },
  {
    icon: Database,
    title: "Join the Flourishing Data Collaborative",
    body: "Run the Flourishing Schools survey and receive network- and school-level insights.",
    href: "/flourishing-schools-project",
    cta: "Learn more",
  },
  {
    icon: BookOpen,
    title: "Explore public resources",
    body: "Browse curated, evidence-informed practices free to any school in the world.",
    href: "/resources",
    cta: "Browse library",
  },
  {
    icon: CalendarDays,
    title: "Attend an upcoming event",
    body: "Webinars and information sessions on flourishing in schools.",
    href: "/blog",
    cta: "See updates",
  },
  {
    icon: Users,
    title: "Partnership opportunities",
    body: "Explore ways to collaborate with RSI on flourishing research and practice.",
    href: "/contact",
    cta: "Get in touch",
  },
  {
    icon: Mail,
    title: "Contact the RSI team",
    body: "Have a unique question? Reach out and we'll follow up.",
    href: "/contact",
    cta: "Contact us",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Find your path into the work"
        description="Whether you lead a school, teach in a classroom, or simply care about student flourishing, there's a way to take part."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="group flex h-full flex-col p-6">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-soft text-crimson">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg text-navy">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.body}</p>
                  <Link
                    href={p.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson transition-colors hover:text-crimson-strong"
                  >
                    {p.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
