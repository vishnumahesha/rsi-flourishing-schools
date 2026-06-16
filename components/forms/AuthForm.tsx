"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/forms/field-helpers";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!supabaseConfigured) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5 text-sm text-slate shadow-soft">
        <div className="mb-2 flex items-center gap-2 font-semibold text-navy">
          <AlertCircle className="h-4 w-4 text-gold" />
          Authentication not configured
        </div>
        <p>
          This preview is running without Supabase credentials, so sign-in is
          disabled. Once the backend environment variables are set, this form
          connects automatically — no code changes required.
        </p>
      </div>
    );
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    // On success the browser redirects to Google; we only land here on error.
    if (error) {
      setGoogleLoading(false);
      setStatus("error");
      setError(error.message);
    }
  }

  async function handleSubmit() {
    setStatus("loading");
    setError(null);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              next,
            )}`,
          },
        });
        if (error) throw error;
        setStatus("sent");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5 shadow-soft">
        <div className="mb-2 flex items-center gap-2 font-semibold text-navy">
          <CheckCircle2 className="h-5 w-5 text-sage" />
          Check your email
        </div>
        <p className="text-sm text-slate">
          We sent a confirmation link to <strong>{email}</strong>. Open it to
          finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogle}
        disabled={googleLoading || status === "loading"}
        className="w-full"
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-slate">
        <span className="h-px flex-1 bg-line" />
        or {mode === "signup" ? "sign up" : "sign in"} with email
        <span className="h-px flex-1 bg-line" />
      </div>

      {mode === "signup" && (
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jordan Rivera"
            autoComplete="name"
          />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.org"
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>

      {error && <FieldError message={error} />}

      <Button
        onClick={handleSubmit}
        disabled={status === "loading" || !email || !password}
        className="w-full"
        size="lg"
      >
        {status === "loading" && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {mode === "signup" ? "Create account" : "Sign in"}
      </Button>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.21-2.36H12v4.46h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-4.06 1.16 7.14 7.14 0 0 1-6.7-4.94H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.31a7.2 7.2 0 0 1 0-4.61v-3.1H1.29a12 12 0 0 0 0 10.81l4.01-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.29 6.6l4.01 3.1A7.14 7.14 0 0 1 12 4.75z"
      />
    </svg>
  );
}
