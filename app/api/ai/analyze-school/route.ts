import { NextResponse } from "next/server";
import { analyzeSchool, type SchoolAnalysisInput, type SchoolAnalysis } from "@/lib/ai/analyze-school";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: SchoolAnalysisInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!Array.isArray(body?.priorities)) body = { ...body, priorities: [] };

  const analysis: SchoolAnalysis = await analyzeSchool(body);

  // Persist analysis run — fire-and-forget; never blocks or fails the response.
  void (async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      const orgId = profile?.organization_id as string | null | undefined;
      if (!orgId) return;

      await supabase.from("analysis_runs").insert({
        organization_id: orgId,
        created_by: user.id,
        source: analysis.source ?? "demo",
        summary: analysis.summary ?? null,
        input: body as unknown as Record<string, unknown>,
        output: analysis as unknown as Record<string, unknown>,
      });
    } catch {
      // Intentionally swallowed — persistence is best-effort.
    }
  })();

  return NextResponse.json(analysis);
}
