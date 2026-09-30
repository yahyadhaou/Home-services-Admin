"use client";

import { Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminAction } from "@/lib/useAdminAction";

export function ActiveToggle({
  userId,
  isActive,
  labels = { suspend: "Suspend account", reactivate: "Reactivate account" },
}: {
  userId: string;
  isActive: boolean;
  labels?: { suspend: string; reactivate: string };
}) {
  const { run, pending, error } = useAdminAction();

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        variant={isActive ? "danger" : "primary"}
        onClick={() => run(`users/${userId}/active`, { method: "PATCH", body: { isActive: !isActive } })}
        loading={pending}
      >
        {isActive ? (
          <>
            <Ban className="size-3.5" /> {labels.suspend}
          </>
        ) : (
          <>
            <CheckCircle2 className="size-3.5" /> {labels.reactivate}
          </>
        )}
      </Button>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
