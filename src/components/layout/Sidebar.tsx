import { Wrench } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { getNavItems } from "@/components/layout/navItems";
import type { Dictionary } from "@/i18n/dictionaries";

export function Sidebar({ dict }: { dict: Dictionary }) {
  const navItems = getNavItems(dict);

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col bg-sidebar px-3 py-5 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-white">
          <Wrench className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">HomeService</p>
          <p className="text-xs text-slate-400">Admin</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <NavLink key={href} href={href} label={label} icon={<Icon className="size-4" />} />
        ))}
      </nav>
    </aside>
  );
}
