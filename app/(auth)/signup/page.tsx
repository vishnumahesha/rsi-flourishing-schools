import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-navy">Create your account</h1>
      <p className="mt-2 text-sm text-slate">
        Set up access to track your application and, once accepted, your school&apos;s
        flourishing journey.
      </p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-slate">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-crimson hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
