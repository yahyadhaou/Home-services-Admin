import Link from "next/link";
import { Building2 } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, CompanySummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { ApplicationStatusBadge, ActiveBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [sp, locale] = await Promise.all([searchParams, getLocale()]);
  const dict = getDictionary(locale);
  const t = dict.companiesList;

  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  if (sp.status) query.set("status", sp.status);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<CompanySummary>>(`/admin/companies?${query.toString()}`);

  const statusLabels: Record<string, string> = {
    pending: t.statusPending,
    approved: t.statusApproved,
    rejected: t.statusRejected,
    draft: t.statusDraft,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <p className="text-sm text-muted">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder={t.searchPlaceholder} />
        <FilterSelect
          paramKey="status"
          placeholder={t.allStatuses}
          options={[
            { value: "pending", label: t.statusPending },
            { value: "approved", label: t.statusApproved },
            { value: "rejected", label: t.statusRejected },
            { value: "draft", label: t.statusDraft },
          ]}
        />
      </div>

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={Building2} title={t.empty} description={t.emptyHint} />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>{t.colCompany}</Th>
                  <Th>{t.colOwner}</Th>
                  <Th>{t.colLocation}</Th>
                  <Th>{t.colStatus}</Th>
                  <Th>{t.colWorkers}</Th>
                  <Th>{t.colBookings}</Th>
                  <Th>{t.colSubmitted}</Th>
                </tr>
              </Thead>
              <Tbody>
                {res.data.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <Link href={`/companies/${c.id}`} className="font-medium text-accent hover:underline">
                        {c.legalName}
                      </Link>
                    </Td>
                    <Td>
                      <p>{c.owner ? `${c.owner.firstName} ${c.owner.lastName}` : "—"}</p>
                      {c.owner && !c.owner.isActive ? (
                        <span className="mt-0.5 inline-block">
                          <ActiveBadge isActive={false} labels={{ active: dict.common.active, suspended: dict.common.suspended }} />
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      {c.postalCode} {c.city}
                    </Td>
                    <Td>
                      <ApplicationStatusBadge status={c.applicationStatus} label={statusLabels[c.applicationStatus]} />
                    </Td>
                    <Td>{c.workerCount}</Td>
                    <Td>{c.bookingCount}</Td>
                    <Td>{formatDate(c.submittedAt)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              page={res.pagination.page}
              totalPages={res.pagination.totalPages}
              totalItems={res.pagination.totalItems}
              searchParams={sp}
              labels={dict.pagination}
            />
          </>
        )}
      </Card>
    </div>
  );
}
