"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Wrench, X } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { getNavItems } from "@/components/layout/navItems";
import type { Dictionary } from "@/i18n/dictionaries";

// Below `lg` (see Sidebar.tsx's matching `hidden lg:flex`), the static
// sidebar is gone entirely, so this is the only way to navigate: a
// hamburger button here opens the same nav list as an overlay drawer.
export function MobileNav({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const navItems = getNavItems(dict);

  // A route change means a link inside the drawer was just followed — close
  // it so the new page isn't hidden behind the overlay. Adjusted during
  // render (not an effect) per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-slate-100 hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-sidebar px-3 py-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-white">
                  <Wrench className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">HomeService</p>
                  <p className="text-xs text-slate-400">Admin</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1">
              {navItems.map(({ href, icon: Icon, label }) => (
                <NavLink key={href} href={href} label={label} icon={<Icon className="size-4" />} />
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
