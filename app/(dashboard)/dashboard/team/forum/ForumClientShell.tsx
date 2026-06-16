"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewThreadForm } from "./NewThreadForm";

interface Props {
  isDemo: boolean;
  children: React.ReactNode;
}

export function ForumClientShell({ isDemo, children }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div />
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          New thread
        </Button>
      </div>
      {showForm && (
        <NewThreadForm isDemo={isDemo} onClose={() => setShowForm(false)} />
      )}
      {children}
    </>
  );
}
