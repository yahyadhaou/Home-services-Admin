"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAdminAction } from "@/lib/useAdminAction";

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const { run, pending, error } = useAdminAction();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-muted hover:text-rose-600" title="Remove review">
        <Trash2 className="size-4" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Remove this review?">
        <p className="text-sm text-slate-600">This permanently deletes the review. This cannot be undone.</p>
        {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={pending} onClick={() => run(`reviews/${reviewId}`, { method: "DELETE" })}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
