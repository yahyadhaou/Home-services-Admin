import Link from "next/link";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { IndependentDetail } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ApplicationStatusBadge, ActiveBadge, Badge } from "@/components/ui/Badge";
import { ApplicationStatusActions } from "@/components/actions/ApplicationStatusActions";
import { ActiveToggle } from "@/components/actions/ActiveToggle";
import { formatCurrency, formatDate, formatDateTime, initials } from "@/lib/format";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

function ConfidentialField({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="flex items-center gap-1 text-sm italic text-muted">
        <Lock className="size-3" /> Confidential
      </p>
    </div>
  );
}

export default async function IndependentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await serverApi<{ data: { independent: IndependentDetail } }>(`/admin/independents/${id}`);
  const p = res.data.independent;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/independents" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to independents
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-foreground">{p.businessName}</h1>
            <ApplicationStatusBadge status={p.applicationStatus} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {p.street}, {p.postalCode} {p.city}
          </p>
        </div>
        <ApplicationStatusActions kind="independents" id={p.id} currentStatus={p.applicationStatus} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Business details" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Legal form" value={p.legalForm} />
            <Field label="Primary category" value={p.primaryCategory} />
            <Field label="Tax number" value={p.taxNumber} />
            <Field label="VAT ID" value={p.vatId} />
            <Field label="Hourly rate from" value={p.hourlyRateFrom ? formatCurrency(p.hourlyRateFrom) : "—"} />
            <Field label="Crew size" value={p.crewSize} />
            <Field label="Insured" value={p.isInsured === null ? "—" : p.isInsured ? "Yes" : "No"} />
            <Field label="Vehicle type" value={p.vehicleType} />
            <Field label="Vehicle max. volume" value={p.vehicleMaxVolumeM3 ? `${p.vehicleMaxVolumeM3} m³` : "—"} />
            <Field label="Long-haul capable" value={p.longHaulCapable === null ? "—" : p.longHaulCapable ? "Yes" : "No"} />
            <Field label="Submitted" value={formatDate(p.submittedAt)} />
            <Field label="Approved" value={formatDate(p.approvedAt)} />
            {p.rejectedReason ? (
              <div className="col-span-2">
                <p className="text-xs text-muted">Rejection reason</p>
                <p className="text-sm text-rose-700">{p.rejectedReason}</p>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Activity" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Total bookings" value={p.stats.totalBookings} />
            <Field label="Completed" value={p.stats.completedBookings} />
            <Field label="Gross volume" value={formatCurrency(p.stats.totalGross)} />
            <Field label="Provider net" value={formatCurrency(p.stats.totalProviderNet)} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Account" />
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials(p.owner?.firstName, p.owner?.lastName)}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "—"} {p.owner ? <ActiveBadge isActive={p.owner.isActive} /> : null}
              </p>
              <p className="text-xs text-muted">
                {p.owner?.email} · {p.owner?.phone ?? "no phone"}
              </p>
              {p.owner?.lastLoginAt ? <p className="text-xs text-muted">Last login {formatDateTime(p.owner.lastLoginAt)}</p> : null}
            </div>
          </div>
          {p.owner ? <ActiveToggle userId={p.owner.id} isActive={p.owner.isActive} /> : null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Payout details" description="Banking information is never shown in this dashboard, even to admins." />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Status</p>
            <Badge tone={p.payoutOnFile ? "green" : "slate"}>{p.payoutOnFile ? "On file" : "Not provided"}</Badge>
          </div>
          <ConfidentialField label="Account holder" />
          <ConfidentialField label="IBAN" />
          <ConfidentialField label="BIC" />
          <Field label="Payout consent given" value={formatDate(p.payoutConsentAt)} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Documents" description={`${p.documents.length} uploaded`} />
        {p.documents.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No documents uploaded.</p>
        ) : (
          <ul className="divide-y divide-border">
            {p.documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-muted" />
                  <div>
                    <p className="text-sm text-foreground">{d.type}</p>
                    <p className="text-xs text-muted">Uploaded {formatDate(d.uploadedAt)}</p>
                  </div>
                </div>
                <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-accent hover:underline">
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
