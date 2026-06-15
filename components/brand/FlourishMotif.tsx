import { cn } from "@/lib/utils";

/** Decorative concentric "growth rings" motif. Purely ornamental. */
export function FlourishMotif({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "gold" | "crimson" | "light";
}) {
  const stroke =
    tone === "gold"
      ? "var(--gold)"
      : tone === "crimson"
        ? "var(--crimson)"
        : tone === "light"
          ? "rgba(255,255,255,0.9)"
          : "var(--navy)";
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      <g stroke={stroke} strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280].map((r, i) => (
          <circle key={r} cx="200" cy="200" r={r} strokeOpacity={0.5 - i * 0.055} />
        ))}
      </g>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * 38}
            y1={200 + Math.sin(a) * 38}
            x2={200 + Math.cos(a) * 282}
            y2={200 + Math.sin(a) * 282}
            stroke={stroke}
            strokeOpacity={0.05}
          />
        );
      })}
    </svg>
  );
}
