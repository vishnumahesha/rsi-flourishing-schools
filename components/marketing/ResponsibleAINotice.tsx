import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResponsibleAINotice({
  className,
  compact = false,
  children,
}: {
  className?: string;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/8 p-4",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--gold)]" />
      <p className={cn("text-slate", compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed")}>
        {children ??
          "These AI-generated insights are intended to support reflection and discussion with the RSI team. Schools should review, adapt, and contextualize all recommendations before acting on them."}
      </p>
    </div>
  );
}
