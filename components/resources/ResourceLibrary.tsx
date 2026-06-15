"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/marketing/cards";
import { Stagger, StaggerItem } from "@/components/marketing/Reveal";
import type { ResourceItem } from "@/types";
import { FLOURISHING_DOMAINS, GRADE_LEVELS } from "@/types";
import { cn } from "@/lib/utils";

const EVIDENCE = ["emerging", "promising", "established", "strong"];

export function ResourceLibrary({ resources }: { resources: ResourceItem[] }) {
  const [q, setQ] = React.useState("");
  const [domain, setDomain] = React.useState<string>("all");
  const [grade, setGrade] = React.useState<string>("all");
  const [evidence, setEvidence] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return resources.filter((r) => {
      const matchesQ =
        !q ||
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        r.summary.toLowerCase().includes(q.toLowerCase()) ||
        r.characterSkills.some((s) => s.toLowerCase().includes(q.toLowerCase()));
      const matchesDomain = domain === "all" || r.domains.includes(domain);
      const matchesGrade = grade === "all" || r.gradeLevels.includes(grade);
      const matchesEvidence = evidence === "all" || r.evidenceStrength === evidence;
      return matchesQ && matchesDomain && matchesGrade && matchesEvidence;
    });
  }, [resources, q, domain, grade, evidence]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-navy">
            <SlidersHorizontal className="h-4 w-4 text-crimson" />
            Filters
          </div>
          <FilterGroup
            label="Flourishing domain"
            value={domain}
            onChange={setDomain}
            options={[
              { value: "all", label: "All domains" },
              ...FLOURISHING_DOMAINS.map((d) => ({ value: d.value, label: d.label })),
            ]}
          />
          <FilterGroup
            label="Grade level"
            value={grade}
            onChange={setGrade}
            options={[
              { value: "all", label: "All grades" },
              ...GRADE_LEVELS.map((g) => ({ value: g, label: g })),
            ]}
          />
          <FilterGroup
            label="Evidence strength"
            value={evidence}
            onChange={setEvidence}
            options={[
              { value: "all", label: "Any evidence" },
              ...EVIDENCE.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })),
            ]}
          />
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search resources by title, topic, or character skill…"
            className="pl-10"
          />
        </div>
        <p className="mb-5 text-sm text-muted">
          {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-paper p-12 text-center">
            <p className="font-display text-lg text-navy">No resources match those filters</p>
            <p className="mt-1.5 text-sm text-muted">Try broadening your search or clearing a filter.</p>
          </div>
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {filtered.map((r) => (
              <StaggerItem key={r.slug}>
                <ResourceCard resource={r} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              value === o.value
                ? "border-crimson bg-crimson-soft text-crimson"
                : "border-line text-slate hover:border-navy/30 hover:bg-navy/5",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
