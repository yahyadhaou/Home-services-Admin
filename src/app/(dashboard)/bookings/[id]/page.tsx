import Link from "next/link";
import { ArrowLeft, Flame, Star } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { BookingDetail } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatDateTime, formatTime } from "@/lib/format";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await serverApi<{ data: { booking: BookingDetail } }>(`/admin/bookings/${id}`);
  const b = res.data.booking;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/bookings" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="flex items-center gap-1.5 text-xl font-semibold text-foreground">
              {b.isEmergency ? <Flame className="size-4 text-rose-500" /> : null}
              {b.bookingNumber}
            </h1>
            <BookingStatusBadge status={b.status} />
          </div>
          <p className="mt-1 text-sm text-muted">{b.serviceLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Job details" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category" value={b.category} />
            <Field label="Provider type" value={b.providerType} />
            <Field label="Provider" value={b.provider.name} />
            <Field label="Assigned worker" value={b.assignedWorker?.name ?? "Unassigned"} />
            <Field label="Client" value={b.client?.name} />
            <Field
              label="Scheduled"
              value={`${formatDate(b.scheduledDate)} · ${formatTime(b.scheduledTime)}`}
            />
            <Field label="Recurring" value={b.isRecurring ? b.recurrenceFrequency : "No"} />
            <Field label="Address" value={`${b.address.street}, ${b.address.postalCode} ${b.address.city}`} />
            {b.cancelledAt ? (
              <>
                <Field label="Cancelled at" value={formatDateTime(b.cancelledAt)} />
                <Field label="Cancellation reason" value={b.cancelledReason} />
              </>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Pricing" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Price (gross)" value={formatCurrency(b.priceGross)} />
            <Field label="Provider earning (net)" value={formatCurrency(b.providerEarningNet)} />
            <Field label="Platform fee" value={formatCurrency(b.priceGross - b.providerEarningNet)} />
            <Field label="Created" value={formatDateTime(b.createdAt)} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Payments" description={`${b.payments.length} attempt(s)`} />
        {b.payments.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No payment recorded yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {b.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-foreground">
                    {formatCurrency(p.amountGross, p.currency)} · {p.method ?? "—"}
                  </p>
                  <p className="text-xs text-muted">
                    {p.psp} · {formatDateTime(p.processedAt ?? p.createdAt)}
                  </p>
                </div>
                <PaymentStatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader title="Review" />
        {!b.review ? (
          <p className="px-5 py-6 text-sm text-muted">No review left for this booking.</p>
        ) : (
          <CardBody>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{b.review.client?.name}</p>
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <Star className="size-3.5 fill-amber-400 text-amber-400" /> {b.review.rating}/5
              </span>
            </div>
            {b.review.comment ? <p className="mt-1 text-sm text-slate-600">{b.review.comment}</p> : null}
            {b.review.providerResponse ? (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Provider response: {b.review.providerResponse}
              </p>
            ) : null}
          </CardBody>
        )}
      </Card>
    </div>
  );
}
