import { NavLink } from "@/components/layout/NavLink";
import { getNavItems } from "@/components/layout/navItems";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/i18n/dictionaries";

export function Sidebar({ dict }: { dict: Dictionary }) {
  const navItems = getNavItems(dict);

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col bg-sidebar px-3 py-5 lg:flex">
      <div className="mb-6 shrink-0 px-2">
        <Logo size={34} subtitle="Admin" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => (
          <NavLink key={href} href={href} label={label} icon={<Icon className="size-4" />} />
        ))}
      </nav>
    </aside>
  );
}
