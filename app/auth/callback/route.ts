import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function loginErrorUrl(origin: string, error: string, description?: string | null) {
  const params = new URLSearchParams({ error });
  if (description) params.set("error_description", description);
  return `${origin}/login?${params.toString()}`;
}

/** Exchanges an auth code for a session, then routes to the dashboard. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const providerError = searchParams.get("error");
  const providerErrorDescription = searchParams.get("error_description");

  // The provider/Supabase redirected back with an error instead of a code.
  if (providerError) {
    return NextResponse.redirect(
      loginErrorUrl(origin, providerError, providerErrorDescription),
    );
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
      // Surface the real reason (e.g. "Unable to exchange external code").
      return NextResponse.redirect(
        loginErrorUrl(origin, "exchange_failed", error.message),
      );
    }
  }

  return NextResponse.redirect(
    loginErrorUrl(origin, "auth", "Missing authorization code or backend not configured."),
  );
}
