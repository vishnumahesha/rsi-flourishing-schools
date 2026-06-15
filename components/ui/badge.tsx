import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy/8 text-navy",
        crimson: "border-transparent bg-crimson-soft text-crimson",
        gold: "border-gold/30 bg-gold/12 text-[color:var(--gold)]",
        sage: "border-transparent bg-sage/18 text-[#43603f]",
        outline: "border-line-strong text-slate",
        success: "border-transparent bg-emerald-500/12 text-emerald-700",
        warning: "border-transparent bg-amber-500/15 text-amber-700",
        muted: "border-transparent bg-navy/5 text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
