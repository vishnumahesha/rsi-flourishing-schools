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
