"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  className,
  barClassName,
}: {
  value?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-navy/8", className)}
    >
      <div
        className={cn("h-full rounded-full bg-crimson transition-all duration-700 ease-out", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
