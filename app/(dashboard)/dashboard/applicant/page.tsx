import Link from "next/link";
import { PageHeading, DashCard, StatCard, DemoNotice } from "@/components/dashboard/primitives";
import { Badge } from "@/components/ui/badge";
import { demoApplication } from "@/lib/content/demo";
import { CheckCircle2, Circle, Clock, FileText, ArrowRight } from "lucide-react";

export default function ApplicantOverview() {
  const app = demoApplication;
  return (
    <>
      <PageHeading
        title="Your application"
        description="Track where your school stands in the program application process."
      />
      <DemoNotice>
        This shows an <strong>example application</strong>. Your real status will
        appear here once you submit and the backend is connected.
      </DemoNotice>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Status" value="Under review" icon={Clock} />
        <StatCard label="School" value={app.school} hint="Submitted application" />
        <StatCard label="Submitted" value={app.submittedOn} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DashCard title="Progress" className="lg:col-span-2">
          <ol className="space-y-4">
            {app.steps.map((step) => (
              <li key={step.label} className="flex items-start gap-3">
                {step.done ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-mist" />
                )}
                <div>
                  <div className="font-medium text-navy">{step.label}</div>
                  <div className="text-xs text-slate">{step.date}</div>
                </div>
              </li>
            ))}
          </ol>
        </DashCard>

        <DashCard title="Next steps">
          <p className="text-sm text-slate">
            While your application is reviewed, you can keep preparing your
            documents and explore the resource library.
          </p>
          <div className="mt-4 space-y-2">
            <Link href="/resources" className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-navy hover:bg-paper">
              <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-crimson" /> Browse resources</span>
              <ArrowRight className="h-4 w-4 text-slate" />
            </Link>
            <Link href="/apply" className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-navy hover:bg-paper">
              <span className="flex items-center gap-2"><Badge variant="muted">Draft</Badge> Edit application</span>
              <ArrowRight className="h-4 w-4 text-slate" />
            </Link>
          </div>
        </DashCard>
      </div>
    </>
  );
}
