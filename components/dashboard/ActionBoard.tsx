"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  demoTasks,
  taskColumns,
  type TaskStatus,
} from "@/lib/content/demo";
import { FLOURISHING_DOMAINS } from "@/types";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

function domainLabel(value: string) {
  return FLOURISHING_DOMAINS.find((d) => d.value === value)?.label ?? value;
}

export function ActionBoard() {
  const [tasks, setTasks] = useState(demoTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  function move(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  return (
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
            onDrop={() => {
              if (dragId) move(dragId, col.key);
              setDragId(null);
              setOverCol(null);
            }}
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
              {colTasks.map((t) => (
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
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-navy">{t.title}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-[0.65rem]">
                          {domainLabel(t.domain)}
                        </Badge>
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[0.6rem] font-bold text-ivory">
                          {t.owner}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
  );
}
