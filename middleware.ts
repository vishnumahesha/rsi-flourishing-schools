import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only run on auth-gated routes. Public pages (/, all (public) routes) are
  // deliberately excluded so a slow or paused Supabase backend can never take
  // the public site down with a middleware timeout. This does not change which
  // routes are reachable — public pages were never auth-gated.
  matcher: ["/dashboard/:path*"],
};
