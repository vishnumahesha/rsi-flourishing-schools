"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Upload } from "lucide-react";

type DocumentCategory =
  | "flourishing_report"
  | "mission_statement"
  | "values"
  | "wellbeing_program"
  | "sel_program"
  | "character_education"
  | "strategic_plan"
  | "school_improvement_plan"
  | "other";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  flourishing_report: "Flourishing Report",
  mission_statement: "Mission Statement",
  values: "Values",
  wellbeing_program: "Wellbeing Program",
  sel_program: "SEL Program",
  character_education: "Character Education",
  strategic_plan: "Strategic Plan",
  school_improvement_plan: "School Improvement Plan",
  other: "Other",
};

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
]);

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "success" }
  | { status: "error"; message: string };

export function UploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<DocumentCategory>("other");
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });

  function validateFile(file: File): string | null {
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return "File type not allowed. Accepted: PDF, Word, TXT, CSV, Excel, PNG, JPG.";
    }
    if (file.size > MAX_BYTES) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 20 MB.`;
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadState({ status: "error", message: "Select a file first." });
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setUploadState({ status: "error", message: validationError });
      return;
    }

    setUploadState({ status: "uploading" });

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setUploadState({ status: "error", message: "Please sign in." });
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setUploadState({ status: "error", message: `Could not load profile: ${profileError.message}` });
      return;
    }

    const profile = profileData as { organization_id: string | null } | null;
    const orgId = profile?.organization_id ?? null;

    if (!orgId) {
      setUploadState({ status: "error", message: "Join an organization first." });
      return;
    }

    const safeName = sanitizeFilename(file.name);
    const storagePath = `${orgId}/${Date.now()}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("school-documents")
      .upload(storagePath, file);

    if (storageError) {
      setUploadState({ status: "error", message: `Upload failed: ${storageError.message}` });
      return;
    }

    const { error: insertError } = await supabase.from("documents").insert({
      organization_id: orgId,
      uploaded_by: user.id,
      name: file.name,
      category,
      storage_path: storagePath,
      size_bytes: file.size,
    });

    if (insertError) {
      setUploadState({
        status: "error",
        message: `File uploaded to storage but metadata save failed: ${insertError.message}`,
      });
      return;
    }

    setUploadState({ status: "success" });
    if (fileRef.current) fileRef.current.value = "";
    setCategory("other");
    router.refresh();
  }

  const isUploading = uploadState.status === "uploading";

  return (
    <form onSubmit={handleSubmit} className="mb-5 rounded-xl border border-line bg-paper p-4">
      <p className="mb-3 text-sm font-medium text-navy">Upload a document</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="doc-file" className="mb-1 block text-xs font-medium text-slate">
            File
          </label>
          <input
            id="doc-file"
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg"
            disabled={isUploading}
            className="block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-crimson-soft file:px-2 file:py-1 file:text-xs file:font-medium file:text-crimson disabled:opacity-50"
            onChange={() => {
              if (uploadState.status === "error" || uploadState.status === "success") {
                setUploadState({ status: "idle" });
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="doc-category" className="mb-1 block text-xs font-medium text-slate">
            Category
          </label>
          <select
            id="doc-category"
            value={category}
            disabled={isUploading}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            className="block rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy disabled:opacity-50"
          >
            {(Object.entries(CATEGORY_LABELS) as [DocumentCategory, string][]).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="flex items-center gap-1.5 rounded-lg bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {uploadState.status === "error" && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {uploadState.message}
        </p>
      )}

      {uploadState.status === "success" && (
        <p role="status" className="mt-2 text-xs font-medium text-green-700">
          Uploaded successfully.
        </p>
      )}
    </form>
  );
}
