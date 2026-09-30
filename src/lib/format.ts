export const formatCurrency = (value: number | null | undefined, currency = "EUR") => {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(value);
};

export const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(value));
};

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
};

export const formatTime = (value: string | null | undefined) => {
  if (!value) return "—";
  return value.slice(0, 5);
};

export const initials = (firstName?: string | null, lastName?: string | null) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
