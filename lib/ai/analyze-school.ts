import { resources } from "@/lib/content/resources";
import { FLOURISHING_DOMAINS } from "@/types";
import { aiConfigured, runLlm, parseJsonLoose } from "./provider";

export interface SchoolAnalysisInput {
  schoolName?: string;
  schoolType?: string;
  enrollment?: string;
  priorities: string[]; // flourishing domain values or outcome labels
  context?: string; // free-text narrative from staff
}

export interface GrowthArea {
  domain: string;
  label: string;
  title: string;
  rationale: string;
  signals: string[];
  suggestedResourceSlugs: string[];
}

export interface SchoolAnalysis {
  source: "ai" | "demo";
  summary: string;
  growthAreas: GrowthArea[];
  disclaimer: string;
}

const DISCLAIMER =
  "This analysis is decision-support for a human facilitator, not an assessment or diagnosis. Review with your RSI facilitator before acting.";

function labelFor(domainValue: string): string {
  return (
    FLOURISHING_DOMAINS.find((d) => d.value === domainValue)?.label ??
    domainValue
  );
}

/** Deterministic, citation-safe fallback built only from curated resources. */
function demoAnalysis(input: SchoolAnalysisInput): SchoolAnalysis {
  const chosen = input.priorities.length
    ? input.priorities
    : ["belonging", "student_wellbeing", "staff_capacity"];

  const growthAreas: GrowthArea[] = chosen.slice(0, 4).map((p) => {
    // Map outcome labels loosely back to a domain value when possible.
    const domainValue =
      FLOURISHING_DOMAINS.find(
        (d) => d.value === p || d.label.toLowerCase() === p.toLowerCase(),
      )?.value ?? p;

    const matches = resources
      .filter((r) =>
        r.domains.some(
          (d) =>
            d === domainValue ||
            labelFor(d).toLowerCase() === String(p).toLowerCase(),
        ),
      )
      .slice(0, 3)
      .map((r) => r.slug);

    return {
      domain: domainValue,
      label: labelFor(domainValue),
      title: `Strengthen ${labelFor(domainValue).toLowerCase()}`,
      rationale: `Your team flagged ${labelFor(
        domainValue,
      ).toLowerCase()} as a priority. A focused, low-lift starting practice helps build momentum before broader change.`,
      signals: [
        "Named as a staff priority in intake",
        "Addressable with existing classroom routines",
        "Measurable through reflections over an 8-week cycle",
      ],
      suggestedResourceSlugs: matches,
    };
  });

  return {
    source: "demo",
    summary: `Based on the priorities provided${
      input.schoolName ? ` for ${input.schoolName}` : ""
    }, here are suggested focus areas drawn from the curated resource library. This is a demonstration response generated without an AI provider key.`,
    growthAreas,
    disclaimer: DISCLAIMER,
  };
}

export async function analyzeSchool(
  input: SchoolAnalysisInput,
): Promise<SchoolAnalysis> {
  if (!aiConfigured()) return demoAnalysis(input);

  const resourceCatalog = resources.map((r) => ({
    slug: r.slug,
    title: r.title,
    domains: r.domains,
  }));

  const system =
    "You are a flourishing-education facilitator's assistant. You help interpret a school's self-reported priorities and suggest focus areas. " +
    "CRITICAL RULES: (1) Never invent research citations or cite studies. (2) Only suggest resources by slug from the provided catalog. (3) Frame everything as decision-support for a human, never as diagnosis. " +
    "Respond ONLY with JSON matching: {\"summary\": string, \"growthAreas\": [{\"domain\": string, \"label\": string, \"title\": string, \"rationale\": string, \"signals\": string[], \"suggestedResourceSlugs\": string[]}]}";

  const prompt = `School priorities and context:\n${JSON.stringify(
    input,
    null,
    2,
  )}\n\nResource catalog (suggest only from these slugs):\n${JSON.stringify(
    resourceCatalog,
  )}\n\nReturn 3-4 growth areas as JSON only.`;

  const result = await runLlm({ system, prompt, maxTokens: 1500 });
  if (!result.available) return demoAnalysis(input);

  const parsed = parseJsonLoose<{
    summary: string;
    growthAreas: GrowthArea[];
  }>(result.text);
  if (!parsed?.growthAreas?.length) return demoAnalysis(input);

  // Guard: drop any hallucinated slugs not in the catalog.
  const valid = new Set(resources.map((r) => r.slug));
  const growthAreas = parsed.growthAreas.map((g) => ({
    ...g,
    suggestedResourceSlugs: (g.suggestedResourceSlugs ?? []).filter((s) =>
      valid.has(s),
    ),
  }));

  return {
    source: "ai",
    summary: parsed.summary,
    growthAreas,
    disclaimer: DISCLAIMER,
  };
}
