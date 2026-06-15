import { NextResponse } from "next/server";
import { recommendResources, type RecommendInput } from "@/lib/ai/recommend-resources";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: RecommendInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const result = await recommendResources(body ?? {});
  return NextResponse.json(result);
}
