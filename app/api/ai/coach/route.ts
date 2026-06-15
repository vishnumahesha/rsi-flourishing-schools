import { NextResponse } from "next/server";
import { coach, type CoachInput } from "@/lib/ai/coach";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: CoachInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body?.message?.trim()) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }
  const result = await coach(body);
  return NextResponse.json(result);
}
