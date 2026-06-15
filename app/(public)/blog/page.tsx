import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/PageHero";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { blogPosts, blogCategories } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Research updates, program news, school stories, and evidence-based practices.",
};

export default function BlogPage() {
  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const rest = blogPosts.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights on flourishing in schools"
        description="Research updates, program news, school stories, and practical, evidence-based ideas."
      />
      <section className="py-16">
        <Container>
          <div className="mb-10 flex flex-wrap gap-2">
            {blogCategories.map((c, i) => (
              <span
                key={c}
                className={
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
                  (i === 0
                    ? "bg-navy text-white"
                    : "border border-line-strong text-slate hover:bg-navy/5")
                }
              >
                {c}
              </span>
            ))}
          </div>

          {/* Featured */}
          <Card className="mb-10 grid overflow-hidden md:grid-cols-2">
            <div className="bg-navy-deep p-8 sm:p-10">
              <Badge variant="gold" className="mb-4">
                Featured · {featured.category}
              </Badge>
              <h2 className="font-display text-2xl text-white sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{featured.summary}</p>
              <p className="mt-6 text-xs text-white/50">
                {featured.author} · {formatDate(featured.date)}
              </p>
            </div>
            <div className="flex items-center justify-center bg-flourish p-10">
              <div className="text-center">
                <div className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-crimson-soft" />
                <p className="text-sm text-muted">Full article coming soon</p>
              </div>
            </div>
          </Card>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Card key={p.slug} className="flex h-full flex-col p-6">
                <Badge variant="muted" className="mb-3 w-fit">
                  {p.category}
                </Badge>
                <h3 className="font-display text-lg leading-snug text-navy">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
                <p className="mt-5 text-xs text-muted">
                  {p.author} · {formatDate(p.date)}
                </p>
              </Card>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-muted">
            Posts are placeholder content for this demo platform.
          </p>
        </Container>
      </section>
    </>
  );
}
