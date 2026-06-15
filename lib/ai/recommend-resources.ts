import { resources } from "@/lib/content/resources";
import type { ResourceItem } from "@/types";
import { aiConfigured, runLlm, parseJsonLoose } from "./provider";

export interface RecommendInput {
  domains?: string[];
  gradeLevels?: string[];
  query?: string;
  limit?: number;
}

export interface ResourceRecommendation {
  resource: ResourceItem;
  reason: string;
  matchScore: number;
}

export interface RecommendResult {
  source: "ai" | "demo";
  recommendations: ResourceRecommendation[];
}

/** Pure scoring over the curated library — no fabrication, fully deterministic. */
function scoreResources(input: RecommendInput): ResourceRecommendation[] {
  const q = (input.query ?? "").toLowerCase();
  const domains = new Set((input.domains ?? []).map((d) => d.toLowerCase()));
  const grades = new Set((input.gradeLevels ?? []).map((g) => g.toLowerCase()));

  const scored = resources.map((r) => {
    let score = 0;
    const reasons: string[] = [];

    const domainHits = r.domains.filter((d) => domains.has(d.toLowerCase()));
    if (domainHits.length) {
      score += domainHits.length * 3;
      reasons.push(`matches ${domainHits.length} target domain(s)`);
    }
    const gradeHits = r.gradeLevels.filter((g) => grades.has(g.toLowerCase()));
    if (gradeHits.length) {
      score += gradeHits.length * 2;
      reasons.push("fits the selected grade level(s)");
    }
    if (q) {
      const hay = `${r.title} ${r.summary} ${r.overview}`.toLowerCase();
      if (hay.includes(q)) {
        score += 2;
        reasons.push("matches your search terms");
      }
    }
    // Light tie-breaker favoring stronger evidence.
    const evidenceRank: Record<string, number> = {
      strong: 1.5,
      established: 1,
      promising: 0.5,
      emerging: 0.25,
    };
    score += evidenceRank[r.evidenceStrength] ?? 0;

    return {
      resource: r,
      reason: reasons.length
        ? reasons.join("; ")
        : "general fit for flourishing goals",
      matchScore: score,
    };
  });

  return scored
    .filter((s) => s.matchScore > 0 || (!domains.size && !grades.size && !q))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, input.limit ?? 5);
}

export async function recommendResources(
  input: RecommendInput,
): Promise<RecommendResult> {
  const base = scoreResources(input);

  // Without a key, return deterministic scored matches.
  if (!aiConfigured()) return { source: "demo", recommendations: base };

  // With a key, ask the model only to re-rank/explain the curated matches.
  const system =
    "You re-rank and explain a fixed list of curated education resources for a school. " +
    "Never invent resources or citations. Use only the provided slugs. " +
    'Respond ONLY with JSON: {"items":[{"slug":string,"reason":string}]} ordered best-first.';
  const candidates = base.length ? base : scoreResources({ ...input, limit: 8 });
  const prompt = `Goal: ${JSON.stringify(input)}\nCandidates:\n${JSON.stringify(
    candidates.map((c) => ({
      slug: c.resource.slug,
      title: c.resource.title,
      domains: c.resource.domains,
      gradeLevels: c.resource.gradeLevels,
    })),
  )}\nReturn JSON only.`;

  const result = await runLlm({ system, prompt, maxTokens: 800 });
  if (!result.available) return { source: "demo", recommendations: base };

  const parsed = parseJsonLoose<{ items: { slug: string; reason: string }[] }>(
    result.text,
  );
  if (!parsed?.items?.length) return { source: "demo", recommendations: base };

  const bySlug = new Map(resources.map((r) => [r.slug, r]));
  const recommendations: ResourceRecommendation[] = parsed.items
    .map((it, i) => {
      const resource = bySlug.get(it.slug);
      if (!resource) return null;
      return { resource, reason: it.reason, matchScore: parsed.items.length - i };
    })
    .filter((x): x is ResourceRecommendation => x !== null)
    .slice(0, input.limit ?? 5);

  return {
    source: recommendations.length ? "ai" : "demo",
    recommendations: recommendations.length ? recommendations : base,
  };
}
