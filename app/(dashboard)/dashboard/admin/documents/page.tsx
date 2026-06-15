import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { demoDocuments } from "@/lib/content/demo";
import { FileText, Upload, Lock } from "lucide-react";

export default function DocumentsPage() {
  return (
    <>
      <PageHeading
        title="Documents"
        description="Materials your school has shared to inform analysis and planning."
        action={<Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Upload</Button>}
      />
      <DemoNotice>
        File upload writes to a <strong>private</strong> storage bucket in
        production. This list shows example documents only.
      </DemoNotice>

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-slate">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
        <p>Documents are private to your school team and your RSI facilitator. Avoid uploading files containing student personal information.</p>
      </div>

      <DashCard>
        <ul className="divide-y divide-line">
          {demoDocuments.map((d) => (
            <li key={d.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-crimson-soft"><FileText className="h-5 w-5 text-crimson" /></span>
              <div className="min-w-0">
                <div className="truncate font-medium text-navy">{d.name}</div>
                <div className="text-xs text-slate">{d.category} · {d.uploaded}</div>
              </div>
              <span className="ml-auto text-xs text-slate">{d.size}</span>
            </li>
          ))}
        </ul>
      </DashCard>
    </>
  );
}
