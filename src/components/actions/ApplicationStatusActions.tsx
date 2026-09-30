"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAdminAction } from "@/lib/useAdminAction";
import type { ApplicationStatus } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";

const DEFAULT_DICT: Pick<Dictionary, "actions" | "common"> = {
  actions: {
    approve: "Approve",
    reject: "Reject",
    rejectTitle: "Reject application",
    rejectHint: "This will be shown to the applicant. Provide a reason.",
    rejectPlaceholder: "e.g. Missing trade registration document",
    rejectConfirm: "Reject",
    suspendAccount: "Suspend account",
    reactivateAccount: "Reactivate account",
  },
  common: {
    signOut: "Sign out",
    cancel: "Cancel",
    confidential: "Confidential",
    onFile: "On file",
    notProvided: "Not provided",
    yes: "Yes",
    no: "No",
    active: "active",
    suspended: "suspended",
    view: "View",
    back: "Back",
  },
};

export function ApplicationStatusActions({
  kind,
  id,
  currentStatus,
  dict = DEFAULT_DICT,
}: {
  kind: "companies" | "independents";
  id: string;
  currentStatus: ApplicationStatus;
  dict?: Pick<Dictionary, "actions" | "common">;
}) {
  const { run, pending, error } = useAdminAction();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const t = dict.actions;

  const approve = () => run(`${kind}/${id}/status`, { method: "PATCH", body: { status: "approved" } });
  const reject = async () => {
    const ok = await run(`${kind}/${id}/status`, { method: "PATCH", body: { status: "rejected", rejectedReason: reason } });
    if (ok) {
      setRejectOpen(false);
      setReason("");
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        {currentStatus !== "approved" && (
          <Button variant="primary" onClick={approve} loading={pending}>
            <Check className="size-3.5" /> {t.approve}
          </Button>
        )}
        {currentStatus !== "rejected" && (
          <Button variant="danger" onClick={() => setRejectOpen(true)} disabled={pending}>
            <X className="size-3.5" /> {t.reject}
          </Button>
        )}
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title={t.rejectTitle}>
        <p className="mb-2 text-xs text-muted">{t.rejectHint}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder={t.rejectPlaceholder}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setRejectOpen(false)}>
            {dict.common.cancel}
          </Button>
          <Button variant="danger" onClick={reject} loading={pending} disabled={!reason.trim()}>
            {t.rejectConfirm}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
