import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { demoThreads } from "@/lib/content/demo";
import { MessageSquare, Plus } from "lucide-react";

export default function ForumPage() {
  return (
    <>
      <PageHeading
        title="Discussion"
        description="Share what's working, ask questions, and learn alongside your team."
        action={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> New thread</Button>}
      />
      <DemoNotice />
      <div className="space-y-3">
        {demoThreads.map((t) => (
          <DashCard key={t.id} className="transition-shadow hover:shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-crimson-soft">
                <MessageSquare className="h-5 w-5 text-crimson" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base text-navy">{t.title}</h3>
                <p className="mt-0.5 text-sm text-slate">{t.excerpt}</p>
                <div className="mt-2 text-xs text-slate">
                  {t.author} · {t.replies} replies · last activity {t.lastActivity}
                </div>
              </div>
            </div>
          </DashCard>
        ))}
      </div>
    </>
  );
}
