import { NextResponse } from "next/server";
import { coach, type CoachInput } from "@/lib/ai/coach";
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
