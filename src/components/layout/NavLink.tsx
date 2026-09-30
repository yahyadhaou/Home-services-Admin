"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

// `icon` arrives pre-rendered (a JSX element built in the Server Component
// parent), never the component reference itself — a Lucide icon component
// is a function with methods, and only plain serializable values can cross
// the Server -> Client Component boundary as props.
export function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-white/10 text-white" : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
