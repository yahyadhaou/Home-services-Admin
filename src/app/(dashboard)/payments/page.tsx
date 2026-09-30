import Link from "next/link";
import { CreditCard } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, PaymentDTO } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.status) query.set("status", sp.status);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<PaymentDTO>>(`/admin/payments?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Payments</h1>
        <p className="text-sm text-muted">Every payment attempt recorded against a booking. Simulated PSP for now.</p>
      </div>

      <FilterSelect
        paramKey="status"
        placeholder="All statuses"
        options={[
          { value: "pending", label: "Pending" },
          { value: "succeeded", label: "Succeeded" },
          { value: "failed", label: "Failed" },
          { value: "refunded", label: "Refunded" },
        ]}
      />

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={CreditCard} title="No payments found" description="Try a different filter." />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Booking</Th>
                  <Th>Amount</Th>
                  <Th>Method</Th>
                  <Th>PSP</Th>
                  <Th>Status</Th>
                  <Th>Processed</Th>
                </tr>
              </Thead>
              <Tbody>
                {res.data.map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      {p.booking ? (
                        <Link href={`/bookings/${p.booking.id}`} className="font-medium text-accent hover:underline">
                          {p.booking.bookingNumber}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td className="font-medium">{formatCurrency(p.amountGross, p.currency)}</Td>
                    <Td>{p.method ?? "—"}</Td>
                    <Td>{p.psp}</Td>
                    <Td>
                      <PaymentStatusBadge status={p.status} />
                    </Td>
                    <Td>{formatDateTime(p.processedAt ?? p.createdAt)}</Td>
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
