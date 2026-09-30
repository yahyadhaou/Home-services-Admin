import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { WorkerDetail } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ActiveBadge, Badge, BookingStatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatDateTime, formatTime, initials } from "@/lib/format";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

export default async function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await serverApi<{ data: { worker: WorkerDetail } }>(`/admin/workers/${id}`);
  const w = res.data.worker;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/workers" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to workers
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {initials(w.firstName, w.lastName)}
        </span>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-foreground">
              {w.firstName} {w.lastName}
            </h1>
            {w.removedAt ? <ActiveBadge isActive={false} /> : <ActiveBadge isActive={!!w.isActive} />}
          </div>
          <p className="text-sm text-muted">{w.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Employment" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Company"
            value={w.company ? <Link href={`/companies/${w.company.id}`} className="text-accent hover:underline">{w.company.legalName}</Link> : "—"}
          />
          <Field label="Specialty" value={w.specialtyCategory} />
          <Field label="Availability" value={<Badge tone={w.isAvailable ? "green" : "slate"}>{w.isAvailable ? "available" : "unavailable"}</Badge>} />
          <Field label="Joined" value={formatDate(w.joinedDate)} />
          <Field label="Phone" value={w.phone} />
          <Field label="Last login" value={formatDateTime(w.lastLoginAt)} />
          {w.removedAt ? <Field label="Removed from team" value={formatDate(w.removedAt)} /> : null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recent jobs" description={`${w.recentJobs.length} shown`} />
        {w.recentJobs.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No jobs assigned yet.</p>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Booking</Th>
                <Th>Client</Th>
                <Th>Scheduled</Th>
                <Th>Status</Th>
                <Th className="text-right">Price</Th>
              </tr>
            </Thead>
            <Tbody>
              {w.recentJobs.map((j) => (
                <Tr key={j.id}>
                  <Td>
                    <Link href={`/bookings/${j.id}`} className="font-medium text-accent hover:underline">
                      {j.bookingNumber}
                    </Link>
                    <p className="text-xs text-muted">{j.serviceLabel}</p>
                  </Td>
                  <Td>{j.client?.name ?? "—"}</Td>
                  <Td>
                    {formatDate(j.scheduledDate)} · {formatTime(j.scheduledTime)}
                  </Td>
                  <Td>
                    <BookingStatusBadge status={j.status} />
                  </Td>
                  <Td className="text-right font-medium">{formatCurrency(j.priceGross)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
