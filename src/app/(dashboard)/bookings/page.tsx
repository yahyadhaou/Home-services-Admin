import Link from "next/link";
import { CalendarCheck, Flame } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, BookingSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  if (sp.status) query.set("status", sp.status);
  if (sp.providerType) query.set("providerType", sp.providerType);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<BookingSummary>>(`/admin/bookings?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Bookings</h1>
        <p className="text-sm text-muted">Every job across every company and independent provider.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search booking #, service, client…" />
        <FilterSelect
          paramKey="status"
          placeholder="All statuses"
          options={[
            { value: "pending", label: "Pending" },
            { value: "upcoming", label: "Upcoming" },
            { value: "in_progress", label: "In progress" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
        <FilterSelect
          paramKey="providerType"
          placeholder="All provider types"
          options={[
            { value: "company", label: "Company" },
            { value: "independent", label: "Independent" },
          ]}
        />
      </div>

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No bookings found" description="Try a different search or filter." />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Booking</Th>
                  <Th>Client</Th>
                  <Th>Provider</Th>
                  <Th>Worker</Th>
                  <Th>Scheduled</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Price</Th>
                </tr>
              </Thead>
              <Tbody>
                {res.data.map((b) => (
                  <Tr key={b.id}>
                    <Td>
                      <Link href={`/bookings/${b.id}`} className="flex items-center gap-1.5 font-medium text-accent hover:underline">
                        {b.isEmergency ? <Flame className="size-3.5 text-rose-500" /> : null}
                        {b.bookingNumber}
                      </Link>
                      <p className="text-xs text-muted">{b.serviceLabel}</p>
                    </Td>
                    <Td>{b.client?.name ?? "—"}</Td>
                    <Td>{b.provider.name ?? "—"}</Td>
                    <Td>{b.assignedWorker?.name ?? "—"}</Td>
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
            <Pagination
              page={res.pagination.page}
              totalPages={res.pagination.totalPages}
              totalItems={res.pagination.totalItems}
              searchParams={sp}
            />
          </>
        )}
      </Card>
    </div>
  );
}
