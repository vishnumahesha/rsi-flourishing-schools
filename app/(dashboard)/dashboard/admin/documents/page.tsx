import { PageHeading, DashCard, DemoNotice } from "@/components/dashboard/primitives";
import { getAdminDocuments } from "@/lib/dashboard/admin-sub";
import { FileText, Lock } from "lucide-react";
import { UploadForm } from "./UploadForm";

export default async function DocumentsPage() {
  const data = await getAdminDocuments();
  return (
    <>
      <PageHeading
        title="Documents"
        description="Materials your school has shared to inform analysis and planning."
      />

      {data.isDemo && (
        <DemoNotice>
          File upload writes to a <strong>private</strong> storage bucket in
          production. This list shows example documents only.
        </DemoNotice>
      )}

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-slate">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
        <p>Documents are private to your school team and your RSI facilitator. Avoid uploading files containing student personal information.</p>
      </div>

      <UploadForm />

      <DashCard>
        <ul className="divide-y divide-line">
          {data.documents.length === 0 ? (
            <li className="py-8 text-center text-sm text-slate">
              No uploaded documents yet. Upload your Flourishing Schools report and school goal materials to prepare for AI-supported analysis and RSI workshop planning.
            </li>
          ) : (
            data.documents.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-crimson-soft">
                  <FileText className="h-5 w-5 text-crimson" />
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium text-navy">{d.name}</div>
                  <div className="text-xs text-slate">{d.category} · {d.uploaded}</div>
                </div>
                <span className="ml-auto text-xs text-slate">{d.size}</span>
              </li>
            ))
          )}
        </ul>
      </DashCard>
    </>
  );
}
