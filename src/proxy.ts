import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  BACKEND_URL,
  REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/config";

// Next.js 16 renamed middleware.js to proxy.js — same mechanics, new name/export.
// This is the one place that keeps an admin session alive across the
// backend's short-lived (15m) access token: it runs ahead of every
// protected page/route, and silently exchanges the refresh token for a new
// pair before the access token actually expires, so the dashboard never
// bounces someone to /login just because they left a tab open.

const decodeExp = (jwt: string): number | null => {
  try {
    const payload = jwt.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
};

const isNearExpiry = (token: string) => {
  const exp = decodeExp(token);
  if (exp === null) return true;
  return exp * 1000 - Date.now() < 60_000; // refresh proactively, 60s before it's actually rejected
};

const patchCookieHeader = (original: string | null, updates: Record<string, string>) => {
  const parts = (original ?? "")
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !Object.keys(updates).some((name) => p.startsWith(`${name}=`)));
  for (const [name, value] of Object.entries(updates)) parts.push(`${name}=${value}`);
  return parts.join("; ");
};

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken && !isNearExpiry(accessToken)) {
    return NextResponse.next();
  }

  // Access token missing or about to expire — exchange the refresh token
  // for a fresh pair. On failure the session truly is dead: send to login.
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error("refresh failed");
    const json = (await res.json()) as { data: { accessToken: string; refreshToken: string } };

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      "cookie",
      patchCookieHeader(request.headers.get("cookie"), {
        [ACCESS_COOKIE]: json.data.accessToken,
        [REFRESH_COOKIE]: json.data.refreshToken,
      }),
    );

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(ACCESS_COOKIE, json.data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });
    response.cookies.set(REFRESH_COOKIE, json.data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)"],
};
