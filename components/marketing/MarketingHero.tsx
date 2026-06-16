import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-flourish" aria-hidden />
      <div className="grain absolute inset-0" aria-hidden />
      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-24">
        <div>
          <Badge variant="crimson" className="mb-5 animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
            RSI Flourishing Schools · Professional Development
          </Badge>
          <h1 className="text-balance font-display text-4xl leading-[1.05] text-navy sm:text-5xl md:text-[3.4rem]">
            Turn flourishing research into{" "}
            <span className="text-gradient-gold">school-wide practice.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate sm:text-lg">
            A research-backed professional development platform that helps schools use flourishing
            data, evidence-based practices, and guided reflection to strengthen student character,
            well-being, and community life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/apply">
                Apply to participate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/resources">Explore public resources</Link>
            </Button>
          </div>
          <Link
            href="/flourishing-schools-project"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-crimson transition-colors hover:text-crimson-strong"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-crimson-soft">
              <Play className="h-3 w-3 fill-crimson text-crimson" />
            </span>
            Learn about the Flourishing Schools Project
          </Link>
        </div>

        <div className="relative lg:pl-4">
          <Image
            src="/images/flourishing-hero.png"
            alt="Illustration of a bare tree growing from rippling water inside concentric crimson, navy, and gold rings, representing student flourishing"
            width={2688}
            height={1536}
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="h-auto w-full mix-blend-multiply"
          />
        </div>
      </Container>
    </section>
  );
}
