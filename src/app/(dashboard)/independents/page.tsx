import Link from "next/link";
import { UserRound } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, IndependentSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ApplicationStatusBadge, ActiveBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";

export default async function IndependentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  if (sp.status) query.set("status", sp.status);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<IndependentSummary>>(`/admin/independents?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Independents</h1>
        <p className="text-sm text-muted">Solo, self-employed providers and their onboarding status.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search by business name or city…" />
        <FilterSelect
          paramKey="status"
          placeholder="All statuses"
          options={[
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "draft", label: "Draft" },
          ]}
        />
      </div>

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={UserRound} title="No independents found" description="Try a different search or filter." />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Provider</Th>
                  <Th>Category</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Bookings</Th>
                  <Th>Submitted</Th>
                </tr>
              </Thead>
              <Tbody>
                {res.data.map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      <Link href={`/independents/${p.id}`} className="font-medium text-accent hover:underline">
                        {p.businessName}
                      </Link>
                      {p.owner && !p.owner.isActive ? (
                        <span className="mt-0.5 block w-fit">
                          <ActiveBadge isActive={false} />
                        </span>
                      ) : null}
                    </Td>
                    <Td>{p.primaryCategory ?? "—"}</Td>
                    <Td>
                      {p.postalCode} {p.city}
                    </Td>
                    <Td>
                      <ApplicationStatusBadge status={p.applicationStatus} />
                    </Td>
                    <Td>{p.bookingCount}</Td>
                    <Td>{formatDate(p.submittedAt)}</Td>
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
