import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFacilitatorSessions } from "@/lib/dashboard/facilitator-sub";
import { CalendarDays, Plus } from "lucide-react";

export default async function FacilitatorSessions() {
  const data = await getFacilitatorSessions();
  return (
    <>
      <PageHeading
        title="PD sessions"
        description="Schedule and track professional development sessions across your cohort."
        action={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> Schedule</Button>}
      />
      {data.isDemo && <DemoNotice />}
      <DashCard title="Upcoming" className="mb-6">
        {data.upcoming.length === 0 ? (
          <p className="text-sm text-slate">Nothing scheduled.</p>
        ) : (
          <ul className="divide-y divide-line">
            {data.upcoming.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-crimson-soft"><CalendarDays className="h-5 w-5 text-crimson" /></span>
                <div className="min-w-0"><div className="font-medium text-navy">{s.title}</div><div className="text-xs text-slate">{s.dateLabel}</div></div>
                <Badge variant="gold" className="ml-auto">Upcoming</Badge>
              </li>
            ))}
          </ul>
        )}
      </DashCard>
      <DashCard title="Past sessions">
        <ul className="divide-y divide-line">
          {data.past.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0"><div className="font-medium text-navy">{s.title}</div><div className="text-xs text-slate">{s.dateLabel}</div></div>
              <Badge variant="muted" className="ml-auto">Completed</Badge>
            </li>
          ))}
        </ul>
      </DashCard>
    </>
  );
}
