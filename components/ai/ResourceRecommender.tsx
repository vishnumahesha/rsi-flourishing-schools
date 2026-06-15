"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChipMultiSelect } from "@/components/forms/field-helpers";
import { FLOURISHING_DOMAINS, GRADE_LEVELS } from "@/types";
import type { RecommendResult } from "@/lib/ai/recommend-resources";
import { Wand2, Loader2, ArrowUpRight } from "lucide-react";

const domainOptions = FLOURISHING_DOMAINS.map((d) => ({ value: d.value, label: d.label }));
const gradeOptions = GRADE_LEVELS.map((g) => ({ value: g, label: g }));

export function ResourceRecommender({
  defaultDomains = [],
}: {
  defaultDomains?: string[];
}) {
  const [domains, setDomains] = useState<string[]>(defaultDomains);
  const [grades, setGrades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/recommend-resources", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domains, gradeLevels: grades, limit: 5 }),
      });
      setResult((await res.json()) as RecommendResult);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <label className="mb-2 block text-sm font-semibold text-navy">Focus domains</label>
        <ChipMultiSelect options={domainOptions} value={domains} onChange={setDomains} />
        <label className="mb-2 mt-5 block text-sm font-semibold text-navy">Grade levels</label>
        <ChipMultiSelect options={gradeOptions} value={grades} onChange={setGrades} />
        <Button className="mt-5" onClick={run} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Recommend resources
        </Button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={result.source === "ai" ? "crimson" : "muted"}>
              {result.source === "ai" ? "AI-ranked" : "Best matches"}
            </Badge>
            <span className="text-sm text-slate">
              {result.recommendations.length} resources from the curated library
            </span>
          </div>
          {result.recommendations.length === 0 ? (
            <p className="text-sm text-slate">No matches — try broadening your filters.</p>
          ) : (
            result.recommendations.map(({ resource, reason }) => (
              <Link
                key={resource.slug}
                href={`/resources/${resource.slug}`}
                className="block rounded-xl border border-line bg-surface p-4 shadow-soft transition-shadow hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-base text-navy">{resource.title}</div>
                    <p className="mt-1 text-sm text-slate">{resource.summary}</p>
                    <p className="mt-2 text-xs text-crimson">Why: {reason}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
