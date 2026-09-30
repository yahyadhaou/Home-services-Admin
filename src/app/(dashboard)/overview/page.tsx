import Link from "next/link";
import { Building2, CalendarCheck, HardHat, Users, Euro, UserRound } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Overview } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";

export default async function OverviewPage() {
  const res = await serverApi<{ data: Overview }>("/admin/overview");
  const { counts, revenue, recentBookings } = res.data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Overview</h1>
        <p className="text-sm text-muted">Platform-wide numbers across every company, independent and client.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clients" value={counts.clients} icon={Users} tone="indigo" />
        <StatCard
          label="Companies"
          value={counts.companies.total}
          hint={`${counts.companies.pending} pending review`}
          icon={Building2}
          tone="blue"
        />
        <StatCard
          label="Independents"
          value={counts.independents.total}
          hint={`${counts.independents.pending} pending review`}
          icon={UserRound}
          tone="blue"
        />
        <StatCard label="Workers" value={counts.workers} icon={HardHat} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total bookings" value={counts.bookings.total} icon={CalendarCheck} tone="indigo" />
        <StatCard label="Completed" value={counts.bookings.completed} icon={CalendarCheck} tone="green" />
        <StatCard label="In progress / upcoming" value={counts.bookings.in_progress + counts.bookings.upcoming} icon={CalendarCheck} tone="blue" />
        <StatCard
          label="Platform earnings"
          value={formatCurrency(revenue.platformEarnings)}
          hint={`${formatCurrency(revenue.completedBookingsGross)} gross from completed jobs`}
          icon={Euro}
          tone="rose"
        />
      </div>

      <Card>
        <CardHeader title="Recent bookings" description="Most recently created, across every company and independent." />
        {recentBookings.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">No bookings yet.</p>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Booking</Th>
                <Th>Client</Th>
                <Th>Provider</Th>
                <Th>Scheduled</Th>
                <Th>Status</Th>
                <Th className="text-right">Price</Th>
              </tr>
            </Thead>
            <Tbody>
              {recentBookings.map((b) => (
                <Tr key={b.id}>
                  <Td>
                    <Link href={`/bookings/${b.id}`} className="font-medium text-accent hover:underline">
                      {b.bookingNumber}
                    </Link>
                    <p className="text-xs text-muted">{b.serviceLabel}</p>
                  </Td>
                  <Td>{b.client?.name ?? "—"}</Td>
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
    </div>
  );
}
