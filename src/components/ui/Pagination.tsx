import Link from "next/link";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  totalPages,
  totalItems,
  searchParams,
  labels = { pageOf: "Page {page} of {totalPages}", total: "total", previous: "Previous", next: "Next" },
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  searchParams: Record<string, string | undefined>;
  labels?: { pageOf: string; total: string; previous: string; next: string };
}) {
  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    params.set("page", String(targetPage));
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm text-muted">
      <span>
        {labels.pageOf.replace("{page}", String(page)).replace("{totalPages}", String(totalPages))} · {totalItems} {labels.total}
      </span>
      <div className="flex items-center gap-2">
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            "rounded-md px-2.5 py-1 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
            page <= 1 && "pointer-events-none opacity-40",
          )}
        >
          {labels.previous}
        </Link>
        <Link
          href={hrefFor(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            "rounded-md px-2.5 py-1 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
            page >= totalPages && "pointer-events-none opacity-40",
          )}
        >
          {labels.next}
        </Link>
      </div>
    </div>
  );
}
