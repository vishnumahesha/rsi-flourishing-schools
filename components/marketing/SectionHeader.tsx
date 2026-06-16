import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  size = "default",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "light";
  size?: "default" | "display";
  className?: string;
}) {
  const light = tone === "light";
  const display = size === "display";
  return (
    <div
      className={cn(
        display ? "max-w-3xl" : "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em]",
            align === "center" && "justify-center",
            light ? "text-gold-soft" : "text-crimson",
          )}
        >
          <span className="gold-rule" aria-hidden />
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "text-balance font-medium tracking-tight leading-[1.06]",
          display
            ? "text-[clamp(3rem,6vw,4.5rem)]"
            : "text-[clamp(1.875rem,3.2vw,2.5rem)]",
          light ? "text-ivory" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-pretty text-base leading-relaxed sm:text-lg",
            light ? "text-mist" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
