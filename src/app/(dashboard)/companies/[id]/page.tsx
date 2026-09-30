import Link from "next/link";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { CompanyDetail } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ApplicationStatusBadge, ActiveBadge, Badge } from "@/components/ui/Badge";
import { ApplicationStatusActions } from "@/components/actions/ApplicationStatusActions";
import { ActiveToggle } from "@/components/actions/ActiveToggle";
import { formatCurrency, formatDate, formatDateTime, initials } from "@/lib/format";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

function ConfidentialField({ label, confidentialLabel }: { label: string; confidentialLabel: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="flex items-center gap-1 text-sm italic text-muted">
        <Lock className="size-3" /> {confidentialLabel}
      </p>
    </div>
  );
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getLocale()]);
  const dict = getDictionary(locale);
  const t = dict.companyDetail;
  const statusLabels: Record<string, string> = {
    draft: dict.companiesList.statusDraft,
    pending: dict.companiesList.statusPending,
    approved: dict.companiesList.statusApproved,
    rejected: dict.companiesList.statusRejected,
  };

  const res = await serverApi<{ data: { company: CompanyDetail } }>(`/admin/companies/${id}`);
  const c = res.data.company;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/companies" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" /> {t.back}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-foreground">{c.legalName}</h1>
            <ApplicationStatusBadge status={c.applicationStatus} label={statusLabels[c.applicationStatus]} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {c.street}, {c.postalCode} {c.city}
          </p>
        </div>
        <ApplicationStatusActions kind="companies" id={c.id} currentStatus={c.applicationStatus} dict={dict} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t.businessDetails} />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t.legalForm} value={c.legalForm} />
            <Field label={t.commercialRegister} value={c.commercialRegisterNumber} />
            <Field label={t.taxNumber} value={c.taxNumber} />
            <Field label={t.vatId} value={c.vatId} />
            <Field label={t.hourlyRateFrom} value={c.hourlyRateFrom ? formatCurrency(c.hourlyRateFrom) : "—"} />
            <Field label={t.crewSize} value={c.crewSize} />
            <Field label={t.insured} value={c.isInsured === null ? "—" : c.isInsured ? dict.common.yes : dict.common.no} />
            <Field label={t.vehicleType} value={c.vehicleType} />
            <Field label={t.vehicleMaxVolume} value={c.vehicleMaxVolumeM3 ? `${c.vehicleMaxVolumeM3} m³` : "—"} />
            <Field label={t.longHaulCapable} value={c.longHaulCapable === null ? "—" : c.longHaulCapable ? dict.common.yes : dict.common.no} />
            <Field label={t.submitted} value={formatDate(c.submittedAt)} />
            <Field label={t.approvedAt} value={formatDate(c.approvedAt)} />
            {c.rejectedReason ? (
              <div className="col-span-2">
                <p className="text-xs text-muted">{t.rejectionReason}</p>
                <p className="text-sm text-rose-700">{c.rejectedReason}</p>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t.activity} />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t.totalBookings} value={c.stats.totalBookings} />
            <Field label={t.completed} value={c.stats.completedBookings} />
            <Field label={t.grossVolume} value={formatCurrency(c.stats.totalGross)} />
            <Field label={t.providerNet} value={formatCurrency(c.stats.totalProviderNet)} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title={t.ownerRepresentative} />
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials(c.owner?.firstName, c.owner?.lastName)}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {c.representativeName}{" "}
                {c.owner ? (
                  <ActiveBadge isActive={c.owner.isActive} labels={{ active: dict.common.active, suspended: dict.common.suspended }} />
                ) : null}
              </p>
              <p className="text-xs text-muted">
                {c.representativeEmail} · {c.representativePhone ?? t.noPhone}
              </p>
              {c.owner?.lastLoginAt ? (
                <p className="text-xs text-muted">
                  {t.lastLogin} {formatDateTime(c.owner.lastLoginAt)}
                </p>
              ) : null}
            </div>
          </div>
          {c.owner ? (
            <ActiveToggle
              userId={c.owner.id}
              isActive={c.owner.isActive}
              labels={{ suspend: dict.actions.suspendAccount, reactivate: dict.actions.reactivateAccount }}
            />
          ) : null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t.payoutDetails} description={t.payoutDetailsHint} />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted">{t.payoutStatus}</p>
            <Badge tone={c.payoutOnFile ? "green" : "slate"}>{c.payoutOnFile ? dict.common.onFile : dict.common.notProvided}</Badge>
          </div>
          <ConfidentialField label={t.accountHolder} confidentialLabel={dict.common.confidential} />
          <ConfidentialField label="IBAN" confidentialLabel={dict.common.confidential} />
          <ConfidentialField label="BIC" confidentialLabel={dict.common.confidential} />
          <Field label={t.payoutConsent} value={formatDate(c.payoutConsentAt)} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t.documents} description={`${c.documents.length} ${t.uploaded}`} />
        {c.documents.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">{t.noDocuments}</p>
        ) : (
          <ul className="divide-y divide-border">
            {c.documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-muted" />
                  <div>
                    <p className="text-sm text-foreground">{d.type}</p>
                    <p className="text-xs text-muted">
                      {t.uploadedOn} {formatDate(d.uploadedAt)}
                    </p>
                  </div>
                </div>
                <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-accent hover:underline">
                  {dict.common.view}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader title={t.team} description={`${c.workers.length} ${t.workersCount}`} />
        {c.workers.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">{t.noWorkers}</p>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>{t.colName}</Th>
                <Th>{t.colSpecialty}</Th>
                <Th>{t.colStatus}</Th>
                <Th>{t.colJoined}</Th>
              </tr>
            </Thead>
            <Tbody>
              {c.workers.map((w) => (
                <Tr key={w.id}>
                  <Td>
                    <Link href={`/workers/${w.id}`} className="font-medium text-accent hover:underline">
                      {w.firstName} {w.lastName}
                    </Link>
                    <p className="text-xs text-muted">{w.email}</p>
                  </Td>
                  <Td>{w.specialtyCategory}</Td>
                  <Td>
                    {w.removedAt ? (
                      <ActiveBadge isActive={false} labels={{ active: dict.common.active, suspended: dict.common.suspended }} />
                    ) : (
                      <ActiveBadge isActive={!!w.isActive} labels={{ active: dict.common.active, suspended: dict.common.suspended }} />
                    )}
                  </Td>
                  <Td>{formatDate(w.joinedDate)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
