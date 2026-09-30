import Link from "next/link";
import { Users } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, ClientSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ActiveBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, initials } from "@/lib/format";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<ClientSummary>>(`/admin/clients?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Clients</h1>
        <p className="text-sm text-muted">Customers who book services on the marketplace.</p>
      </div>

      <SearchInput placeholder="Search by name or email…" />

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={Users} title="No clients found" description="Try a different search." />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Client</Th>
                  <Th>Phone</Th>
                  <Th>Bookings</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                  <Th>Last login</Th>
                </tr>
              </Thead>
              <Tbody>
                {res.data.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <Link href={`/clients/${c.id}`} className="flex items-center gap-2.5 font-medium text-accent hover:underline">
                        <span className="flex size-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                          {initials(c.firstName, c.lastName)}
                        </span>
                        {c.firstName} {c.lastName}
                      </Link>
                      <p className="text-xs text-muted">{c.email}</p>
                    </Td>
                    <Td>{c.phone ?? "—"}</Td>
                    <Td>{c.bookingCount}</Td>
                    <Td>
                      <ActiveBadge isActive={c.isActive} />
                    </Td>
                    <Td>{formatDate(c.createdAt)}</Td>
                    <Td>{formatDate(c.lastLoginAt)}</Td>
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
