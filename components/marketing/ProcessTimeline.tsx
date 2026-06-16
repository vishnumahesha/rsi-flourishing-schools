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
      <ol className="space-y-6 md:space-y-0">
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon];
          const right = i % 2 === 1;
          return (
            <motion.li
              key={s.step}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative flex items-start gap-4 md:w-1/2 md:py-3.5 ${
                right ? "md:ml-auto md:flex-row md:pl-10" : "md:flex-row-reverse md:pr-10 md:text-right"
              }`}
            >
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface shadow-soft transition-colors duration-300 group-hover:border-crimson/30">
                <Icon className="h-5 w-5 text-crimson" />
              </div>
              <div className={right ? "pt-0.5" : "pt-0.5 md:flex md:flex-col md:items-end"}>
                <div className="mb-0.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-gold">
                  Step {s.step}
                </div>
                <h3 className="font-display text-lg text-navy">{s.title}</h3>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
