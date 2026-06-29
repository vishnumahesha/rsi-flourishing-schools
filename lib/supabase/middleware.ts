import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Supabase not configured yet — never block the public site.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() makes a network round-trip to Supabase on every invocation.
  // If that backend is slow or paused, never let it hang the middleware
  // (which would 504 the route). Race it against a short timeout and degrade
  // to "no user" — we always return a response, never throw or hang.
  const AUTH_TIMEOUT_MS = 2000;
  const timeout = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), AUTH_TIMEOUT_MS),
  );
  const user = await Promise.race([
    supabase.auth
      .getUser()
      .then(({ data }) => data.user)
      .catch(() => null),
    timeout,
  ]);

  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard") && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", path);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Carry over any rotated auth cookies so a redirect never drops the session.
    response.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie),
    );
    return redirectResponse;
  }

  return response;
}
