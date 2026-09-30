import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/i18n/locale";

// Server-side only (Server Components, Route Handlers) — reads the
// visitor's saved language preference. Client Components read the same
// cookie themselves via useLocale() (see LocaleSwitcher.tsx) since this
// uses next/headers.
export const getLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
};
