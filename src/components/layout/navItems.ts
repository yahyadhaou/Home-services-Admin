import {
  LayoutDashboard,
  Building2,
  UserRound,
  HardHat,
  Users,
  CalendarCheck,
  CreditCard,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

// Shared by the desktop Sidebar (Server Component) and the mobile
// MobileNav drawer (Client Component) — a plain function returning icon
// *references*, never rendered elements, so each caller can render
// `<Icon />` locally without ever passing a component across the
// Server/Client boundary (see NavLink.tsx's header comment for why that
// matters).
export const getNavItems = (dict: Dictionary): { href: string; icon: LucideIcon; label: string }[] => [
  { href: "/overview", icon: LayoutDashboard, label: dict.nav.overview },
  { href: "/companies", icon: Building2, label: dict.nav.companies },
  { href: "/independents", icon: UserRound, label: dict.nav.independents },
  { href: "/workers", icon: HardHat, label: dict.nav.workers },
  { href: "/clients", icon: Users, label: dict.nav.clients },
  { href: "/bookings", icon: CalendarCheck, label: dict.nav.bookings },
  { href: "/payments", icon: CreditCard, label: dict.nav.payments },
  { href: "/reviews", icon: Star, label: dict.nav.reviews },
];
