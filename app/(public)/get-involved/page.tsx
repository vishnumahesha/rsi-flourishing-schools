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

interface Pathway {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
  cta: string;
}

const leadPath: Pathway = {
  icon: FileText,
  title: "Apply for the program",
  body: "Schools and networks can apply to join the professional development program.",
  href: "/apply",
  cta: "Start application",
};

const supportingPaths: Pathway[] = [
  {
    icon: Database,
    title: "Join the Flourishing Data Collaborative",
    body: "Run the Flourishing Schools survey and receive network- and school-level insights.",
    href: "/flourishing-schools-project",
    cta: "Learn more",
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
    icon: BookOpen,
    title: "Explore public resources",
    body: "Browse curated, evidence-informed practices free to any school in the world.",
    href: "/resources",
    cta: "Browse library",
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
  const LeadIcon = leadPath.icon;

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Find your path into the work"
        description="Whether you lead a school, teach in a classroom, or simply care about student flourishing, there's a way to take part."
      />
      <section className="py-20">
        <Container>
          {/* Lead card — full width on mobile, spans 2 columns on large screens */}
          <div className="mb-5">
            <Card className="group flex flex-col gap-6 border-crimson/20 bg-gradient-to-br from-white to-crimson-soft/30 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                <div className="mb-4 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-crimson text-white sm:mb-0">
                  <LeadIcon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-navy">{leadPath.title}</h3>
                  <p className="mt-2 max-w-lg text-base leading-relaxed text-muted">
                    {leadPath.body}
                  </p>
                </div>
              </div>
              <Link
                href={leadPath.href}
                className="mt-2 inline-flex shrink-0 items-center gap-2 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-strong sm:mt-0"
              >
                {leadPath.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Card>
          </div>

          {/* Supporting pathways grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportingPaths.map((p) => {
              const Icon = p.icon;
              const isSecondary =
                p.title === "Explore public resources" || p.title === "Contact the RSI team";
              return (
                <Card
                  key={p.title}
                  className={
                    "group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-crimson/25 hover:shadow-card" +
                    (isSecondary ? " border-line" : "")
                  }
                >
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
