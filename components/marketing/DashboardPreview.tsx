"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  CalendarCheck,
  NotebookPen,
  ArrowUpRight,
} from "lucide-react";

/**
 * Coded hero dashboard mock — rendered in real markup (not a raster image)
 * so it stays crisp at any resolution. Reflects the school's flourishing snapshot.
 */
export function DashboardPreview() {
  const reduce = useReducedMotion();

  const strengths = [
    { label: "Belonging", value: 82 },
    { label: "Purpose", value: 74 },
    { label: "Character skills", value: 68 },
  ];
  const growth = [
    { label: "Cognitive virtues", value: 41 },
    { label: "Staff capacity", value: 38 },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      {/* glow */}
      <div
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-crimson/8 via-gold/8 to-sage/8 blur-2xl"
        aria-hidden
      />

      <div className="animate-float-slow rounded-3xl border border-line bg-surface/90 p-3 shadow-float backdrop-blur-sm">
        {/* window chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-crimson/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-sage/40" />
          <div className="ml-3 text-[0.7rem] font-medium text-muted">
            Maple Grove School · Flourishing snapshot
          </div>
        </div>

        <div className="rounded-2xl bg-ivory/70 p-4">
          {/* top stat row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: CalendarCheck, label: "PD progress", value: "4 / 9", tone: "crimson" },
              { icon: NotebookPen, label: "Reflections", value: "27", tone: "sage" },
              { icon: Sparkles, label: "Matches", value: "12", tone: "gold" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-line bg-surface p-3">
                  <Icon
                    className={`h-4 w-4 ${
                      s.tone === "crimson"
                        ? "text-crimson"
                        : s.tone === "sage"
                          ? "text-sage"
                          : "text-gold"
                    }`}
                  />
                  <div className="mt-2 font-display text-xl text-navy">{s.value}</div>
                  <div className="text-[0.68rem] text-muted">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* strengths + growth */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-surface p-3.5">
              <div className="mb-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-sage" />
                <span className="text-[0.72rem] font-semibold text-navy">Strengths</span>
              </div>
              <div className="space-y-2.5">
                {strengths.map((b, i) => (
                  <Bar key={b.label} {...b} color="var(--sage)" reduce={!!reduce} delay={i * 0.1} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface p-3.5">
              <div className="mb-3 flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-crimson" />
                <span className="text-[0.72rem] font-semibold text-navy">Areas for growth</span>
              </div>
              <div className="space-y-2.5">
                {growth.map((b, i) => (
                  <Bar key={b.label} {...b} color="var(--crimson)" reduce={!!reduce} delay={i * 0.1} />
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-crimson-soft px-2.5 py-2 text-[0.66rem] leading-snug text-crimson">
                2 curated interventions suggested for cognitive virtues
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating accent card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-line bg-surface p-3.5 shadow-card sm:block"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[0.72rem] font-semibold text-navy">AI analysis ready</div>
            <div className="text-[0.66rem] text-muted">Awaiting facilitator review</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Bar({
  label,
  value,
  color,
  reduce,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  reduce: boolean;
  delay: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[0.68rem]">
        <span className="text-slate">{label}</span>
        <span className="font-medium text-muted">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-navy/8">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={reduce ? false : { width: 0 }}
          whileInView={reduce ? undefined : { width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
