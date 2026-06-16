"use client";

import { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addReply } from "../actions";

interface Props {
  threadId: string;
}

export function ReplyForm({ threadId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const body = bodyRef.current?.value.trim() ?? "";

    startTransition(async () => {
      const result = await addReply({ threadId, body });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      if (bodyRef.current) bodyRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-5 shadow-soft">
      <h2 className="mb-4 font-display text-lg text-navy">Add a reply</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reply-body" className="mb-1 block text-sm font-medium text-navy">
            Your reply <span aria-hidden="true">*</span>
          </label>
          <textarea
            ref={bodyRef}
            id="reply-body"
            rows={4}
            required
            maxLength={5000}
            placeholder="Share your thoughts..."
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-crimson disabled:opacity-50"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">{error}</p>
        )}
        {saved && (
          <p role="alert" className="text-sm text-green-700">Reply posted.</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-ivory hover:bg-crimson-strong disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Post reply"}
        </button>
      </form>
    </div>
  );
}
