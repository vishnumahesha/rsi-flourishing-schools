import Link from "next/link";
import { PageHeading, DashCard, StatCard, DemoNotice } from "@/components/dashboard/primitives";
import { demoReflections, demoTasks } from "@/lib/content/demo";
import { NotebookPen, MessageSquare, BookOpen, ArrowRight, CheckSquare } from "lucide-react";

export default function TeacherOverview() {
  const myTasks = demoTasks.filter((t) => t.owner === "DP" && t.status !== "done");
  return (
    <>
      <PageHeading
        title="Welcome back"
        description="Your flourishing practice at a glance."
      />
      <DemoNotice />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Reflections" value={demoReflections.length} icon={NotebookPen} />
        <StatCard label="Active tasks" value={myTasks.length} icon={CheckSquare} />
        <StatCard label="This cycle" value="Belonging" hint="Current focus" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DashCard title="Quick actions" className="lg:col-span-1">
          <div className="space-y-2">
            {[
              { href: "/dashboard/teacher/coach", icon: MessageSquare, label: "Talk to the AI coach" },
              { href: "/dashboard/teacher/reflections", icon: NotebookPen, label: "Write a reflection" },
              { href: "/dashboard/teacher/resources", icon: BookOpen, label: "Find a practice" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-navy hover:bg-paper">
                <span className="flex items-center gap-2"><a.icon className="h-4 w-4 text-crimson" /> {a.label}</span>
                <ArrowRight className="h-4 w-4 text-slate" />
              </Link>
            ))}
          </div>
        </DashCard>

        <DashCard title="Recent reflection" className="lg:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate">{demoReflections[0].date}</div>
          <div className="mt-1 text-sm font-medium text-crimson">{demoReflections[0].prompt}</div>
          <p className="mt-2 text-sm leading-relaxed text-navy">{demoReflections[0].body}</p>
          <Link href="/dashboard/teacher/reflections" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-crimson hover:underline">
            All reflections <ArrowRight className="h-4 w-4" />
          </Link>
        </DashCard>
      </div>
    </>
  );
}
