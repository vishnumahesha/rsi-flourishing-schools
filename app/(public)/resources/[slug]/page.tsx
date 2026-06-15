import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookmarkPlus, FilePlus2, Clock, Layers, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResourceCard } from "@/components/marketing/cards";
import {
  resources,
  getResource,
  evidenceLabels,
  difficultyLabels,
} from "@/lib/content/resources";
import { FLOURISHING_DOMAINS } from "@/types";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return { title: "Resource not found" };
  return { title: r.title, description: r.summary };
}

function domainLabel(value: string) {
  return FLOURISHING_DOMAINS.find((d) => d.value === value)?.label ?? value;
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const related = resources
    .filter((r) => r.slug !== resource.slug && r.domains.some((d) => resource.domains.includes(d)))
    .slice(0, 3);

  return (
    <article>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-flourish" aria-hidden />
        <Container className="relative py-12 sm:py-16">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="gold">{evidenceLabels[resource.evidenceStrength]}</Badge>
            <Badge variant="muted">{difficultyLabels[resource.implementationDifficulty]}</Badge>
            <Badge variant="sage">{resource.interventionType}</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-3xl text-navy sm:text-4xl">
            {resource.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate">
            {resource.summary}
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="prose-rsi max-w-none">
              <h2>Overview</h2>
              <p>{resource.overview}</p>

              <h2>Practical steps</h2>
              <ol className="ml-1 list-decimal space-y-2 pl-5">
                {resource.practicalSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>

              <h2>Related research</h2>
              <p>{resource.relatedResearch}</p>
              <p className="text-sm text-muted">
                Source: {resource.sourceCitation}. Replace with a verified citation before production.
              </p>
            </div>

            <aside className="space-y-5">
              <Card className="p-5">
                <h3 className="font-display text-base text-navy">At a glance</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <Meta icon={Clock} label="Time required" value={resource.timeRequired} />
                  <Meta
                    icon={GraduationCap}
                    label="Grade levels"
                    value={resource.gradeLevels.join(", ")}
                  />
                  <Meta
                    icon={Layers}
                    label="Subjects"
                    value={resource.subjectAreas.join(", ")}
                  />
                </dl>
                <div className="mt-5 space-y-2 border-t border-line pt-4">
                  <Button className="w-full" variant="outline" size="sm">
                    <BookmarkPlus className="h-4 w-4" />
                    Save / adapt
                  </Button>
                  <Button className="w-full" size="sm" asChild>
                    <Link href="/dashboard/teacher/interventions">
                      <FilePlus2 className="h-4 w-4" />
                      Create intervention plan
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display text-base text-navy">Flourishing domains</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {resource.domains.map((d) => (
                    <Badge key={d} variant="default">
                      {domainLabel(d)}
                    </Badge>
                  ))}
                </div>
                {resource.characterSkills.length > 0 && (
                  <>
                    <h3 className="mt-5 font-display text-base text-navy">Character skills</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {resource.characterSkills.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-display text-2xl text-navy">Related resources</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <ResourceCard key={r.slug} resource={r} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </article>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="font-medium text-navy">{value}</dd>
      </div>
    </div>
  );
}
