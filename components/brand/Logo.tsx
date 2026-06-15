import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      {/* growth rings */}
      <circle cx="20" cy="22" r="14" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.4" />
      <circle cx="20" cy="22" r="9.5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" />
      <circle cx="20" cy="22" r="5" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" />
      {/* sprout / bloom */}
      <path
        d="M20 24V9"
        stroke="var(--gold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 13C20 13 16.5 12.5 15 9.8C17.8 8.6 20 11 20 13Z"
        fill="var(--gold)"
        fillOpacity="0.9"
      />
      <path
        d="M20 11.5C20 11.5 23.2 10.8 24.6 8.2C22 7 20 9.4 20 11.5Z"
        fill="var(--crimson)"
        fillOpacity="0.9"
      />
      <circle cx="20" cy="22" r="1.7" fill="var(--crimson)" />
    </svg>
  );
}

export function Logo({
  className,
  variant = "full",
  tone = "default",
  href = "/",
}: {
  className?: string;
  variant?: "full" | "mark";
  tone?: "default" | "light";
  href?: string;
}) {
  const textColor = tone === "light" ? "text-white" : "text-navy";
  const subColor = tone === "light" ? "text-white/60" : "text-muted";
  const markColor = tone === "light" ? "text-white" : "text-navy";

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="RSI Flourishing Schools — home"
    >
      <LogoMark className={cn("transition-transform duration-500 group-hover:rotate-[8deg]", markColor)} />
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-[1.05rem] font-medium tracking-tight", textColor)}>
            Flourishing Schools
          </span>
          <span className={cn("mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.18em]", subColor)}>
            Research Schools International
          </span>
        </span>
      )}
    </Link>
  );
}
