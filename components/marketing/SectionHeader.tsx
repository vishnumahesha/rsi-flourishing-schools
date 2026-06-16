import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
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
          "text-balance text-3xl font-medium tracking-tight sm:text-[2.6rem] sm:leading-[1.06]",
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
