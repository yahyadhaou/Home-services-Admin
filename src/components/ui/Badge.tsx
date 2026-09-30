import { cn } from "@/lib/cn";

const TONE_CLASSES: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

export type BadgeTone = keyof typeof TONE_CLASSES;

export function Badge({ tone = "slate", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}

const APPLICATION_STATUS_TONE: Record<string, BadgeTone> = {
  draft: "slate",
  pending: "amber",
  approved: "green",
  rejected: "red",
};

export function ApplicationStatusBadge({ status, label }: { status: string; label?: string }) {
  return <Badge tone={APPLICATION_STATUS_TONE[status] ?? "slate"}>{label ?? status}</Badge>;
}

const BOOKING_STATUS_TONE: Record<string, BadgeTone> = {
  pending: "amber",
  upcoming: "blue",
  in_progress: "indigo",
  completed: "green",
  cancelled: "red",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return <Badge tone={BOOKING_STATUS_TONE[status] ?? "slate"}>{status.replace("_", " ")}</Badge>;
}

const PAYMENT_STATUS_TONE: Record<string, BadgeTone> = {
  pending: "amber",
  succeeded: "green",
  failed: "red",
  refunded: "slate",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  return <Badge tone={PAYMENT_STATUS_TONE[status] ?? "slate"}>{status}</Badge>;
}

export function ActiveBadge({ isActive, labels = { active: "active", suspended: "suspended" } }: { isActive: boolean; labels?: { active: string; suspended: string } }) {
  return <Badge tone={isActive ? "green" : "red"}>{isActive ? labels.active : labels.suspended}</Badge>;
}
