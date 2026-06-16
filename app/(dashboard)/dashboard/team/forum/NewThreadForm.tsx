"use client";

import { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createThread } from "./actions";

interface Props {
  isDemo: boolean;
  onClose: () => void;
}

export function NewThreadForm({ isDemo, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);

  if (isDemo) {
    return (
      <div className="mb-6 rounded-xl border border-line bg-surface p-5">
        <p className="text-sm text-slate">
          This is a demo workspace. <a href="/auth/sign-in" className="font-semibold text-crimson underline underline-offset-2">Sign in</a> with a real account to start a discussion.
        </p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const title = titleRef.current?.value.trim() ?? "";
    const excerpt = excerptRef.current?.value.trim() ?? "";

    startTransition(async () => {
      const result = await createThread({ title, excerpt });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      if (titleRef.current) titleRef.current.value = "";
      if (excerptRef.current) excerptRef.current.value = "";
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="mb-6 rounded-xl border border-line bg-surface p-5 shadow-soft">
      <h2 className="mb-4 font-display text-lg text-navy">New thread</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="thread-title" className="mb-1 block text-sm font-medium text-navy">
            Title <span aria-hidden="true">*</span>
          </label>
          <input
            ref={titleRef}
            id="thread-title"
            type="text"
            required
            maxLength={160}
            placeholder="What's this thread about?"
            disabled={isPending}
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-crimson disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="thread-excerpt" className="mb-1 block text-sm font-medium text-navy">
            Summary <span className="text-slate">(optional)</span>
          </label>
          <textarea
            ref={excerptRef}
            id="thread-excerpt"
            rows={3}
            maxLength={500}
            placeholder="Give a brief overview..."
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-crimson disabled:opacity-50"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">{error}</p>
        )}
        {saved && (
          <p role="alert" className="text-sm text-green-700">Thread created.</p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-ivory hover:bg-crimson-strong disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Post thread"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate hover:bg-paper disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
