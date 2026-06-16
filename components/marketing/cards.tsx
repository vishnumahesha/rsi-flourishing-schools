import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResourceItem } from "@/types";
import { evidenceLabels, difficultyLabels } from "@/lib/content/resources";

export function FeatureCard({
  icon: Icon,
  title,
  body,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-soft text-crimson ring-1 ring-crimson/10">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl text-navy">{title}</h3>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{body}</p>
    </Card>
  );
}

export function AudienceCard({
  icon: Icon,
  title,
  description,
  actions,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions: string[];
  cta: { label: string; href: string };
}) {
  return (
    <Card className="group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/25 hover:shadow-card">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white transition-colors duration-300 group-hover:bg-navy-soft">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <ul className="mt-4 space-y-2">
        {actions.map((a) => (
          <li key={a} className="flex items-start gap-2 text-sm text-slate">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            <span>{a}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson transition-colors hover:text-crimson-strong"
      >
        {cta.label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Card>
  );
}

export function ImpactMetricCard({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  return (
    <Card className="h-full p-6">
      <div className="mb-4 font-display text-2xl text-gold">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="font-display text-lg leading-snug text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </Card>
  );
}

export function ResearchPillarCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full bg-paper p-6">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-[color:var(--gold)] ring-1 ring-gold/20">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl text-navy">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{description}</p>
    </Card>
  );
}

export function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-crimson/25 group-hover:shadow-card">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="gold">{evidenceLabels[resource.evidenceStrength]}</Badge>
          <Badge variant="muted">{difficultyLabels[resource.implementationDifficulty]}</Badge>
        </div>
        <h3 className="font-display text-lg leading-snug text-navy group-hover:text-crimson">
          {resource.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {resource.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
          {resource.gradeLevels.slice(0, 2).map((g) => (
            <Badge key={g} variant="outline">
              {g}
            </Badge>
          ))}
          <Badge variant="sage">{resource.timeRequired}</Badge>
        </div>
      </Card>
    </Link>
  );
}
