import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { ClientDetail } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ActiveBadge, BookingStatusBadge } from "@/components/ui/Badge";
import { ActiveToggle } from "@/components/actions/ActiveToggle";
import { formatCurrency, formatDate, formatDateTime, formatTime, initials } from "@/lib/format";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await serverApi<{ data: { client: ClientDetail } }>(`/admin/clients/${id}`);
  const c = res.data.client;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/clients" className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to clients
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {initials(c.firstName, c.lastName)}
          </span>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-foreground">
                {c.firstName} {c.lastName}
              </h1>
              <ActiveBadge isActive={c.isActive} />
            </div>
            <p className="text-sm text-muted">{c.email}</p>
          </div>
        </div>
        <ActiveToggle userId={c.id} isActive={c.isActive} />
      </div>

      <Card>
        <CardHeader title="Account" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Phone" value={c.phone} />
          <Field label="Total bookings" value={c.totalBookings} />
          <Field label="Joined" value={formatDate(c.createdAt)} />
          <Field label="Last login" value={formatDateTime(c.lastLoginAt)} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recent bookings" description={`${c.recentBookings.length} shown`} />
        {c.recentBookings.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No bookings yet.</p>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Booking</Th>
                <Th>Provider</Th>
                <Th>Scheduled</Th>
                <Th>Status</Th>
                <Th className="text-right">Price</Th>
              </tr>
            </Thead>
            <Tbody>
              {c.recentBookings.map((b) => (
                <Tr key={b.id}>
                  <Td>
                    <Link href={`/bookings/${b.id}`} className="font-medium text-accent hover:underline">
                      {b.bookingNumber}
                    </Link>
                    <p className="text-xs text-muted">{b.serviceLabel}</p>
                  </Td>
                  <Td>{b.provider.name ?? "—"}</Td>
                  <Td>
                    {formatDate(b.scheduledDate)} · {formatTime(b.scheduledTime)}
                  </Td>
                  <Td>
                    <BookingStatusBadge status={b.status} />
                  </Td>
                  <Td className="text-right font-medium">{formatCurrency(b.priceGross)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      <Card>
        <CardHeader title="Reviews written" description={`${c.reviews.length} shown`} />
        {c.reviews.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No reviews written yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {c.reviews.map((r) => (
              <li key={r.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{r.provider.name}</p>
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" /> {r.rating}/5
                  </span>
                </div>
                {r.comment ? <p className="mt-1 text-sm text-slate-600">{r.comment}</p> : null}
                <p className="mt-1 text-xs text-muted">{formatDate(r.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
