import { LogoutButton } from "@/components/layout/LogoutButton";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { initials } from "@/lib/format";
import type { AdminUser } from "@/lib/types";
import type { Locale } from "@/i18n/locale";
import type { Dictionary } from "@/i18n/dictionaries";

export function Topbar({
  user,
  locale,
  signOutLabel,
  dict,
}: {
  user: AdminUser;
  locale: Locale;
  signOutLabel: string;
  dict: Dictionary;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <MobileNav dict={dict} />
      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
        <LocaleSwitcher locale={locale} />
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {initials(user.firstName, user.lastName)}
          </span>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
        <LogoutButton label={signOutLabel} />
      </div>
    </header>
  );
}
