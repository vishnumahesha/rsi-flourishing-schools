import { NextResponse } from "next/server";
import { analyzeSchool, type SchoolAnalysisInput } from "@/lib/ai/analyze-school";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: SchoolAnalysisInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!Array.isArray(body?.priorities)) body = { ...body, priorities: [] };

  const analysis = await analyzeSchool(body);
  return NextResponse.json(analysis);
}
