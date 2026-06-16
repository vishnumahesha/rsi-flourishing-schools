import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { getFacilitatorNotes } from "@/lib/dashboard/facilitator-sub";
import { getOrgOptions } from "./actions";
import { StickyNote, Lock } from "lucide-react";
import AddNoteForm from "./AddNoteForm";

export default async function FacilitatorNotes() {
  const [data, orgs] = await Promise.all([getFacilitatorNotes(), getOrgOptions()]);

  return (
    <>
      <PageHeading
        title="Facilitator notes"
        description="Private observations to guide your support for each school."
      />
      {data.isDemo && <DemoNotice />}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-slate">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
        <p>Notes are visible only to RSI facilitators and platform admins — never to school participants.</p>
      </div>
      <AddNoteForm orgs={orgs} />
      <div className="space-y-3">
        {data.notes.length === 0 ? (
          <p className="text-sm text-slate">No notes yet.</p>
        ) : (
          data.notes.map((n) => (
            <DashCard key={n.id}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-soft">
                  <StickyNote className="h-5 w-5 text-gold" />
                </span>
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-navy">{n.school}</span>
                    <span className="text-xs text-slate">· {n.date}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-navy">{n.note}</p>
                </div>
              </div>
            </DashCard>
          ))
        )}
      </div>
    </>
  );
}
