import Link from "next/link";
import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { getTeamForum } from "@/lib/dashboard/team";
import { ForumClientShell } from "./ForumClientShell";
import { MessageSquare } from "lucide-react";

export default async function ForumPage() {
  const { isDemo, threads } = await getTeamForum();

  return (
    <>
      <PageHeading
        title="Discussion"
        description="Share what's working, ask questions, and learn alongside your team."
      />
      {isDemo && <DemoNotice />}
      <ForumClientShell isDemo={isDemo}>
        <div className="space-y-3">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/team/forum/${t.id}`}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-2xl"
            >
              <DashCard className="transition-shadow hover:shadow-card">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-crimson-soft">
                    <MessageSquare className="h-5 w-5 text-crimson" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base text-navy">{t.title}</h3>
                    {t.excerpt && (
                      <p className="mt-0.5 text-sm text-slate">{t.excerpt}</p>
                    )}
                    <div className="mt-2 text-xs text-slate">
                      {t.author} · {t.replies} {t.replies === 1 ? "reply" : "replies"} · last activity {t.lastActivity}
                    </div>
                  </div>
                </div>
              </DashCard>
            </Link>
          ))}
        </div>
      </ForumClientShell>
    </>
  );
}
