import Link from "next/link";
import { Star } from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import type { Paginated, ReviewDTO } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteReviewButton } from "@/components/actions/DeleteReviewButton";
import { formatDate } from "@/lib/format";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.providerType) query.set("providerType", sp.providerType);
  query.set("page", sp.page ?? "1");
  query.set("limit", "20");

  const res = await serverApi<Paginated<ReviewDTO>>(`/admin/reviews?${query.toString()}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Reviews</h1>
        <p className="text-sm text-muted">Client feedback left across every company and independent provider.</p>
      </div>

      <FilterSelect
        paramKey="providerType"
        placeholder="All provider types"
        options={[
          { value: "company", label: "Company" },
          { value: "independent", label: "Independent" },
        ]}
      />

      <Card>
        {res.data.length === 0 ? (
          <EmptyState icon={Star} title="No reviews found" description="Try a different filter." />
        ) : (
          <>
            <ul className="divide-y divide-border">
              {res.data.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{r.provider.name}</p>
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" /> {r.rating}/5
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      by {r.client?.name} ·{" "}
                      {r.booking ? (
                        <Link href={`/bookings/${r.booking.id}`} className="hover:underline">
                          {r.booking.bookingNumber}
                        </Link>
                      ) : (
                        "—"
                      )}{" "}
                      · {formatDate(r.createdAt)}
                    </p>
                    {r.comment ? <p className="mt-1.5 text-sm text-slate-600">{r.comment}</p> : null}
                  </div>
                  <DeleteReviewButton reviewId={r.id} />
                </li>
              ))}
            </ul>
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
