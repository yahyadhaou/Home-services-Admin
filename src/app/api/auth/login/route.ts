import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  BACKEND_URL,
  REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/config";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await backendRes.json().catch(() => null);

  if (!backendRes.ok || !json?.success) {
    return NextResponse.json(
      { success: false, error: { message: json?.error?.message ?? "Login failed" } },
      { status: backendRes.status || 401 },
    );
  }

  // This dashboard is for platform staff only — a non-admin account that
  // happens to know the login form's URL should never get a session cookie
  // at all, even though the credentials themselves were valid.
  if (json.data.user.role !== "admin") {
    return NextResponse.json(
      { success: false, error: { message: "This account does not have admin access" } },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ success: true, data: { user: json.data.user } });
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
}
