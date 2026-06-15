import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 bg-flourish" aria-hidden />
      <div className="grain absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="mb-3 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-crimson">
              <span className="gold-rule" aria-hidden />
              {eyebrow}
            </div>
          )}
          <h1 className="text-balance font-display text-4xl leading-[1.06] text-navy sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
