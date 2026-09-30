export type Locale = "en" | "de";

export const LOCALES: Locale[] = ["en", "de"];
export const DEFAULT_LOCALE: Locale = "en";

// Not httpOnly, deliberately — it's a UI preference, not a credential, and
// the language switcher (a Client Component) reads it directly via
// document.cookie to know which option is currently selected.
export const LOCALE_COOKIE = "hs_admin_locale";

export const isLocale = (value: string | undefined): value is Locale => LOCALES.includes(value as Locale);
