"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChipMultiSelect } from "@/components/forms/field-helpers";
import { FLOURISHING_DOMAINS } from "@/types";
import { getResource } from "@/lib/content/resources";
import type { SchoolAnalysis } from "@/lib/ai/analyze-school";
import { Sparkles, Loader2, ChevronRight, ShieldCheck } from "lucide-react";

const domainOptions = FLOURISHING_DOMAINS.map((d) => ({
  value: d.value,
  label: d.label,
}));

export function AnalysisPanel() {
  const [priorities, setPriorities] = useState<string[]>([
    "belonging",
    "staff_capacity",
  ]);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchoolAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/analyze-school", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priorities, context }),
      });
      if (!res.ok) throw new Error("Analysis request failed.");
      setResult((await res.json()) as SchoolAnalysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <label className="mb-2 block text-sm font-semibold text-navy">
          Priority flourishing domains
        </label>
        <ChipMultiSelect
          options={domainOptions}
          value={priorities}
          onChange={setPriorities}
        />
        <label className="mb-2 mt-5 block text-sm font-semibold text-navy">
          Context from your team{" "}
          <span className="font-normal text-slate">(optional)</span>
        </label>
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="Briefly describe what you're seeing in your school community and what you'd like to improve."
        />
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={run} disabled={loading || priorities.length === 0}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
          {error && <span className="text-sm text-crimson">{error}</span>}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={result.source === "ai" ? "crimson" : "muted"}>
              {result.source === "ai" ? "AI-generated" : "Demonstration"}
            </Badge>
            <p className="text-sm text-slate">{result.summary}</p>
          </div>

          {result.growthAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-2xl border border-line bg-surface p-5 shadow-soft"
            >
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-display text-lg text-navy">{area.title}</h3>
                <Badge variant="outline">{area.label}</Badge>
              </div>
              <p className="text-sm text-slate">{area.rationale}</p>
              {area.signals?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {area.signals.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-slate">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              {area.suggestedResourceSlugs?.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">
                    Suggested practices
                  </div>
                  <ul className="divide-y divide-line rounded-lg border border-line">
                    {area.suggestedResourceSlugs.map((slug) => {
                      const r = getResource(slug);
                      if (!r) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/resources/${slug}`}
                            className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-paper"
                          >
                            <span className="font-medium text-navy">{r.title}</span>
                            <ChevronRight className="h-4 w-4 text-slate" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-slate">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            <p>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
