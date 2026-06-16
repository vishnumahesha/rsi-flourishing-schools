"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

/**
 * OAuth errors can come back two ways:
 *  - on /auth/callback as ?error / ?error_description (handled server-side too), or
 *  - on any route (often "/") in the URL hash (#error=...&error_description=...)
 *    when the provider/Supabase uses the implicit flow.
 * A server handler can't read the hash, so this top-level client reader checks
 * both location.search and location.hash on mount, surfaces the message, and
 * strips the auth params from the URL so a refresh doesn't re-show it.
 */
function readAuthError(): string | null {
  if (typeof window === "undefined") return null;
  const hashParams = window.location.hash.startsWith("#")
    ? new URLSearchParams(window.location.hash.slice(1))
    : new URLSearchParams();
  const queryParams = new URLSearchParams(window.location.search);

  const error = hashParams.get("error") || queryParams.get("error");
  if (!error) return null;

  // URLSearchParams already decodes percent-escapes and "+"; don't double-decode.
  const description =
    hashParams.get("error_description") || queryParams.get("error_description");
  return description || error;
}

function stripAuthParams() {
  const url = new URL(window.location.href);
  ["error", "error_description", "error_code", "state"].forEach((k) =>
    url.searchParams.delete(k),
  );
  if (url.hash.startsWith("#")) {
    const hashParams = new URLSearchParams(url.hash.slice(1));
    if (hashParams.has("error") || hashParams.has("error_description")) {
      url.hash = "";
    }
  }
  window.history.replaceState({}, "", url.pathname + url.search + url.hash);
}

export function AuthErrorBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = readAuthError();
    if (msg) {
      setMessage(msg);
      stripAuthParams();
    }
  }, []);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[200] flex justify-center px-4 pt-4">
      <div
        role="alert"
        className="flex max-w-xl items-start gap-3 rounded-xl border border-crimson/20 bg-crimson-soft px-4 py-3 text-sm text-crimson shadow-card"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="flex-1 leading-relaxed">
          <span className="font-semibold">Sign-in failed.</span> {message}
        </p>
        <button
          type="button"
          onClick={() => setMessage(null)}
          aria-label="Dismiss"
          className="shrink-0 rounded p-0.5 text-crimson/70 transition-colors hover:text-crimson"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
