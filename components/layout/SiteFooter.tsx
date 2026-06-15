import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { footerNav } from "@/lib/content/navigation";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy-deep text-white/80">
      <Container className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              A research-backed professional development platform helping schools turn flourishing
              data into evidence-based practice — built with Research Schools International.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button asChild variant="onDark" size="sm">
                <Link href="/apply">
                  Apply to participate
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <Link href="/contact">
                  <Mail className="h-4 w-4" />
                  Contact RSI
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-sm text-white">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Research Schools International. Demo platform.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white/80">
              Privacy
            </Link>
            <Link href="/responsible-ai" className="transition-colors hover:text-white/80">
              Responsible AI
            </Link>
            <span className="text-white/30">
              Affiliations shown for context; not an official Harvard product.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
