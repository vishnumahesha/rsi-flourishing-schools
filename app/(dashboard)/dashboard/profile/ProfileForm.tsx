"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateDisplayName } from "./actions";

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    startTransition(async () => {
      const result = await updateDisplayName({ fullName: name });
      if (result.ok) {
        setStatus("saved");
        router.refresh();
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-navy"
        >
          Display name
        </label>
        <input
          id="fullName"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
          }}
          maxLength={120}
          required
          disabled={isPending}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-crimson disabled:opacity-50 sm:max-w-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || name.trim() === ""}
          className="inline-flex items-center rounded-full bg-crimson px-5 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-crimson-strong disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>

        {status === "saved" && (
          <p role="alert" className="text-sm text-green-600">
            Saved.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm text-red-600">
            {errorMsg}
          </p>
        )}
      </div>
    </form>
  );
}
