import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-crimson text-white shadow-soft hover:bg-crimson-strong hover:shadow-card",
        navy: "bg-navy text-white shadow-soft hover:bg-navy-soft",
        gold: "bg-gold text-navy-ink shadow-soft hover:brightness-[1.06]",
        outline:
          "border border-line-strong bg-surface/60 text-navy hover:bg-surface hover:border-navy/30",
        ghost: "text-navy hover:bg-navy/5",
        link: "text-crimson underline-offset-4 hover:underline px-0 h-auto",
        subtle: "bg-crimson-soft text-crimson hover:bg-crimson/15",
        onDark:
          "bg-white/95 text-navy-ink hover:bg-white shadow-soft",
      },
      size: {
        sm: "h-9 px-4 text-[0.82rem]",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-[0.95rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
