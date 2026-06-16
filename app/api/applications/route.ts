import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/validation/application";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Accepts a program application.
 * - Validates with the shared Zod schema.
 * - If Supabase is configured AND a session exists, persists to `applications`.
 * - Otherwise returns a demo-safe success so the public flow works pre-backend.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      persisted: false,
      mode: "demo",
      message:
        "Application validated. Backend is not configured in this environment, so it was not stored.",
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      ok: true,
      persisted: false,
      mode: "unauthenticated",
      message:
        "Application validated. Sign in to submit and track your application.",
    });
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      submitted_by: user.id,
      status: "submitted",
      payload: parsed.data,
      school_name: parsed.data.orgName,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, persisted: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, persisted: true, id: data?.id });
}
