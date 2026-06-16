"use client";

import { useTransition, useRef, useState } from "react";
import { inviteMember, type InviteResult } from "./actions";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const INVITE_ROLES = [
  "school_admin",
  "teacher",
  "school_team_member",
] as const;

export function InviteForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<InviteResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const role = (fd.get("role") as string).trim();

    startTransition(async () => {
      const res = await inviteMember({ email, role });
      setResult(res);
      if (res.ok) {
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="invite-email" className="text-xs font-medium text-slate">
            Email address
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="colleague@school.edu"
            disabled={isPending}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm text-navy placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-navy disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1 sm:w-52">
          <label htmlFor="invite-role" className="text-xs font-medium text-slate">
            Role
          </label>
          <select
            id="invite-role"
            name="role"
            required
            disabled={isPending}
            defaultValue="teacher"
            className="rounded-md border border-line bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy disabled:opacity-50"
          >
            {INVITE_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r] ?? r}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="shrink-0"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isPending ? "Sending..." : "Invite"}
        </Button>
      </form>

      {result && (
        <p
          role="alert"
          className={`text-xs ${result.ok ? "text-green-700" : "text-red-600"}`}
        >
          {result.ok
            ? "Invitation created. Email delivery is not configured yet; share this invite with the person manually for now."
            : result.error}
        </p>
      )}
    </div>
  );
}
