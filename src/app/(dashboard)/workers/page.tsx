import Link from "next/link";
import { HardHat } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, WorkerSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ActiveBadge, Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<WorkerSummary>>(`/admin/workers?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Workers</h1>
        <p className="text-sm text-muted">Every company employee, across every team.</p>
      </div>

      <SearchInput placeholder="Search by name or email…" />

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={HardHat} title="No workers found" description="Try a different search." />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Company</Th>
                  <Th>Specialty</Th>
                  <Th>Availability</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                </tr>
              </Thead>
              <Tbody>
                {res.data.map((w) => (
                  <Tr key={w.id}>
                    <Td>
                      <Link href={`/workers/${w.id}`} className="font-medium text-accent hover:underline">
                        {w.firstName} {w.lastName}
                      </Link>
                      <p className="text-xs text-muted">{w.email}</p>
                    </Td>
                    <Td>
                      {w.company ? (
                        <Link href={`/companies/${w.company.id}`} className="hover:underline">
                          {w.company.legalName}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td>{w.specialtyCategory}</Td>
                    <Td>
                      <Badge tone={w.isAvailable ? "green" : "slate"}>{w.isAvailable ? "available" : "unavailable"}</Badge>
                    </Td>
                    <Td>{w.removedAt ? <ActiveBadge isActive={false} /> : <ActiveBadge isActive={!!w.isActive} />}</Td>
                    <Td>{formatDate(w.joinedDate)}</Td>
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
