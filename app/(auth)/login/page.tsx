import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-navy">Welcome back</h1>
      <p className="mt-2 text-sm text-slate">
        Sign in to your school&apos;s flourishing workspace.
      </p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-slate">
        New to the program?{" "}
        <Link href="/signup" className="font-semibold text-crimson hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
