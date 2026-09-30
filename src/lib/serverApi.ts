import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, BACKEND_URL } from "@/lib/config";

// Used from Server Components / Server Actions / Route Handlers only — by
// the time any of these run, proxy.ts has already made sure the access
// token cookie is fresh (see its header comment). The 401 branch here is
// only a safety net for the rare race (token expires mid-request).
export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  cache?: RequestCache;
};

export const serverApi = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  if (res.status === 401) redirect("/login");

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiRequestError(res.status, json?.error?.message ?? "Request failed", json?.error?.details);
  }

  return json as T;
};
