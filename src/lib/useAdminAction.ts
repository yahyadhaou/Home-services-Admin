"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Every mutation in this dashboard goes through the same
// /api/admin/[...path] proxy (see its header comment) — this hook is the
// one place that calls it, tracks in-flight/error state, and refreshes the
// current route's Server Component data afterwards so the UI never shows
// stale state after an approve/suspend/delete action.
export const useAdminAction = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (path: string, options: { method: "POST" | "PATCH" | "DELETE"; body?: unknown }) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${path}`, {
        method: options.method,
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message ?? "Action failed");
      }
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
      return false;
    } finally {
      setPending(false);
    }
  };

  return { run, pending, error };
};
