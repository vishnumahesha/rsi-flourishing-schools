import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-flourish">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
        <Link href="/" className="mb-10 inline-flex">
          <Logo />
        </Link>
        <div className="flex flex-1 flex-col justify-center pb-16">
          {children}
        </div>
        <p className="text-center text-xs text-slate">
          Research Schools International · Flourishing Schools
        </p>
      </div>
    </div>
  );
}
