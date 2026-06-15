import Link from "next/link";
import { cn } from "@/lib/utils";
import { Info, type LucideIcon } from "lucide-react";

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-navy sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-slate">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-gold-soft bg-gold-soft/30 px-4 py-3 text-sm text-navy">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <p>
        {children ?? (
          <>
            This workspace shows <strong>demonstration data</strong>. Connect the
            backend to replace it with your school&apos;s live records.
          </>
        )}
      </p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-crimson" />}
      </div>
      <div className="mt-2 font-display text-3xl text-navy">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate">{hint}</div>}
    </div>
  );
}

export function DashCard({
  title,
  description,
  action,
  className,
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="font-display text-lg text-navy">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-slate">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-paper px-6 py-14 text-center">
      {Icon && (
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-crimson-soft">
          <Icon className="h-6 w-6 text-crimson" />
        </div>
      )}
      <h3 className="font-display text-lg text-navy">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate">{description}</p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-ivory hover:bg-crimson-strong"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
