"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NotebookPen, Plus, Check } from "lucide-react";
import { saveReflection } from "@/app/(dashboard)/dashboard/teacher/reflections/actions";

const PROMPTS = [
  "What did you notice in your students this week?",
  "Where did you see a small win worth repeating?",
  "What's one practice you'd adjust next week, and why?",
  "Who in your community would benefit from more connection?",
];

interface Entry {
  id: string;
  date: string;
  prompt: string;
  body: string;
}

interface Props {
  initialEntries: Entry[];
  isDemo: boolean;
}

export function ReflectionEditor({ initialEntries, isDemo }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Demo-mode local state
  const [demoEntries, setDemoEntries] = useState<Entry[]>(initialEntries);

  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [body, setBody] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isSaving = isPending;
  const displayEntries = isDemo ? demoEntries : initialEntries;

  function handleSave() {
    if (!body.trim()) return;
    setSaveError(null);

    if (isDemo) {
      const entry: Entry = {
        id: `local-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        prompt,
        body: body.trim(),
      };
      setDemoEntries((prev) => [entry, ...prev]);
      setBody("");
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      return;
    }

    startTransition(async () => {
      const result = await saveReflection({ prompt, body });
      if (result.ok) {
        setBody("");
        setJustSaved(true);
        router.refresh();
        setTimeout(() => setJustSaved(false), 2000);
      } else {
        setSaveError(result.error);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-crimson" />
            <h2 className="font-display text-lg text-navy">New reflection</h2>
          </div>
          <label className="mb-1.5 block text-sm font-semibold text-navy">Prompt</label>
          <select
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mb-4 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-navy focus:border-crimson focus:outline-none"
          >
            {PROMPTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write a few honest sentences…"
          />
          {saveError && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {saveError}
            </p>
          )}
          <Button
            className="mt-4 w-full"
            onClick={handleSave}
            disabled={!body.trim() || isSaving}
          >
            {justSaved ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Saving…" : justSaved ? "Saved" : "Save reflection"}
          </Button>
          <p className="mt-2 text-center text-xs text-slate">
            {isDemo
              ? "Demo mode — entries are kept in this browser session only."
              : "Reflections are saved privately to your account."}
          </p>
        </div>
      </div>

      <div className="space-y-3 lg:col-span-3">
        {displayEntries.length === 0 && !isDemo ? (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
            <p className="text-sm text-slate">
              No reflections yet. After your first session, record what you
              tried, what you noticed, and what to adapt next.
            </p>
          </div>
        ) : (
          displayEntries.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border border-line bg-surface p-5 shadow-soft"
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate">
                {e.date}
              </div>
              <div className="mb-2 text-sm font-medium text-crimson">{e.prompt}</div>
              <p className="text-sm leading-relaxed text-navy">{e.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
