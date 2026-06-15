"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Upload,
  Sparkles,
  Users,
  GraduationCap,
  ClipboardList,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import type { ProcessIconKey } from "@/lib/content/home";

const ICONS: Record<ProcessIconKey, LucideIcon> = {
  upload: Upload,
  sparkles: Sparkles,
  users: Users,
  graduation: GraduationCap,
  clipboard: ClipboardList,
  repeat: Repeat,
};

interface Step {
  icon: ProcessIconKey;
  step: string;
  title: string;
  body: string;
}

export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      {/* vertical rail */}
      <div
        className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-crimson/40 via-line-strong to-transparent md:left-1/2"
        aria-hidden
      />
      <ol className="space-y-8 md:space-y-0">
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon];
          const right = i % 2 === 1;
          return (
            <motion.li
              key={s.step}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-start gap-5 md:w-1/2 md:py-6 ${
                right ? "md:ml-auto md:flex-row md:pl-12" : "md:flex-row-reverse md:pr-12 md:text-right"
              }`}
            >
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface shadow-soft">
                <Icon className="h-6 w-6 text-crimson" />
              </div>
              <div className={right ? "" : "md:flex md:flex-col md:items-end"}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Step {s.step}
                </div>
                <h3 className="font-display text-lg text-navy">{s.title}</h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
