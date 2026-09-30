import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { serverApi } from "@/lib/serverApi";
import type { AdminUser } from "@/lib/types";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [res, locale] = await Promise.all([serverApi<{ data: { user: AdminUser } }>("/auth/me"), getLocale()]);
  const dict = getDictionary(locale);

  return (
    // `h-screen overflow-hidden` locks this shell to exactly one viewport —
    // without it, a page taller than the screen makes the whole document
    // scroll (sidebar included), and the sidebar's own fixed height means it
    // scrolls out of view while `main`'s longer content doesn't, leaving a
    // blank gap where the sidebar used to be. `main` is the only scroll
    // container; the sidebar and topbar stay pinned on every page.
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar dict={dict} />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <Topbar user={res.data.user} locale={locale} signOutLabel={dict.common.signOut} dict={dict} />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
