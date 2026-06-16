"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      await createClient().auth.signOut();
    } catch {
      // Proceed to login regardless
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center rounded-full border border-line bg-paper px-5 py-2 text-sm font-semibold text-navy transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? "Logging out..." : "Log out"}
    </button>
  );
}
