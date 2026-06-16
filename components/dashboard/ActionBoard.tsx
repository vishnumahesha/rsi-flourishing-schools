"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { taskColumns, type TaskStatus } from "@/lib/content/demo";
import type { TeamTask } from "@/lib/dashboard/team";
import { FLOURISHING_DOMAINS } from "@/types";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateTaskStatus } from "@/app/(dashboard)/dashboard/team/actions";

interface ActionBoardProps {
  initialTasks: TeamTask[];
  isDemo: boolean;
}

function domainLabel(value: string) {
  return FLOURISHING_DOMAINS.find((d) => d.value === value)?.label ?? value;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export function ActionBoard({ initialTasks, isDemo }: ActionBoardProps) {
  const [tasks, setTasks] = useState<TeamTask[]>(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function moveTasks(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function handleDrop(targetStatus: TaskStatus) {
    if (dragId) moveTasks(dragId, targetStatus);
    setDragId(null);
    setOverCol(null);
  }

  function handleStatusChange(task: TeamTask, newStatus: TaskStatus) {
    if (newStatus === task.status) return;

    if (isDemo) {
      moveTasks(task.id, newStatus);
      return;
    }

    const previousStatus = task.status;
    moveTasks(task.id, newStatus);
    setBoardError(null);
    setSavingId(task.id);
    setSavedId(null);

    startTransition(async () => {
      const result = await updateTaskStatus({ id: task.id, status: newStatus });
      setSavingId(null);

      if (!result.ok) {
        moveTasks(task.id, previousStatus);
        setBoardError(result.error);
      } else {
        setSavedId(task.id);
        setTimeout(() => setSavedId((prev) => (prev === task.id ? null : prev)), 2000);
      }
    });
  }

  const _ = isPending;

  return (
    <div className="space-y-3">
      {boardError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {boardError}
        </div>
      )}

      {isDemo && (
        <p className="text-xs text-slate">
          Showing example data. Status changes are kept for this browser session only.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taskColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.key);
              }}
              onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
              onDrop={() => handleDrop(col.key)}
              className={cn(
                "rounded-2xl border bg-surface/60 p-3 transition-colors",
                overCol === col.key ? "border-crimson bg-crimson-soft/40" : "border-line",
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-navy">{col.label}</span>
                <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-medium text-slate">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {colTasks.map((t) => {
                  const isSaving = savingId === t.id;
                  const isSaved = savedId === t.id;
                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverCol(null);
                      }}
                      className="group cursor-grab rounded-xl border border-line bg-surface p-3 shadow-soft active:cursor-grabbing"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-mist group-hover:text-slate" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-navy">{t.title}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="text-[0.65rem]">
                              {domainLabel(t.domain)}
                            </Badge>
                            {t.owner && (
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[0.6rem] font-bold text-ivory">
                                {t.owner}
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <select
                              aria-label={`Status for ${t.title}`}
                              value={t.status}
                              disabled={isSaving}
                              onChange={(e) =>
                                handleStatusChange(t, e.target.value as TaskStatus)
                              }
                              className="w-full rounded-lg border border-line bg-paper px-2 py-1 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-crimson disabled:opacity-50"
                            >
                              {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_LABELS[s]}
                                </option>
                              ))}
                            </select>
                          </div>
                          {(isSaving || isSaved) && (
                            <p className="mt-1 text-[0.65rem] text-slate">
                              {isSaving ? "Saving…" : "Saved to your team workspace"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-slate">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
