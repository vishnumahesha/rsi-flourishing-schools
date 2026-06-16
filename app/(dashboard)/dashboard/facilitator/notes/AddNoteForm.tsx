"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addFacilitatorNote } from "./actions";

type OrgOption = { id: string; name: string };

type Props = {
  orgs: OrgOption[];
};

type FormStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export default function AddNoteForm({ orgs }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const isEmpty = orgs.length === 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const organizationId = selectRef.current?.value ?? "";
    const body = textareaRef.current?.value ?? "";

    setStatus({ kind: "saving" });

    startTransition(async () => {
      const result = await addFacilitatorNote({ organizationId, body });

      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }

      setStatus({ kind: "saved" });
      if (textareaRef.current) textareaRef.current.value = "";
      router.refresh();

      // Reset to idle after brief confirmation
      setTimeout(() => setStatus({ kind: "idle" }), 2500);
    });
  }

  if (isEmpty) {
    return (
      <div className="mb-5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-slate">
        No organizations are visible yet — notes cannot be added until at least one school is
        accessible to your account.
      </div>
    );
  }

  const isSaving = isPending || status.kind === "saving";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-line bg-paper px-4 py-4 space-y-4"
    >
      <h2 className="text-sm font-semibold text-navy">Add a note</h2>

      <div className="space-y-1">
        <label htmlFor="org-select" className="block text-xs font-medium text-slate">
          School
        </label>
        <select
          id="org-select"
          ref={selectRef}
          disabled={isSaving}
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        >
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="note-body" className="block text-xs font-medium text-slate">
          Note
        </label>
        <textarea
          id="note-body"
          ref={textareaRef}
          rows={4}
          disabled={isSaving}
          required
          maxLength={5000}
          placeholder="Observations, action items, follow-ups…"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 resize-y"
        />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="text-xs text-red-600">
          {status.message}
        </p>
      )}

      {status.kind === "saved" && (
        <p role="alert" className="text-xs text-green-700">
          Note saved.
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-gold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSaving ? "Saving…" : "Save note"}
      </button>
    </form>
  );
}
