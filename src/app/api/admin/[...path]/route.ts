import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, BACKEND_URL } from "@/lib/config";

// A thin authenticated proxy in front of homeservice-backend's
// /api/v1/admin/* — client components call this (same-origin, cookie
// carried automatically by the browser) instead of ever holding the
// backend access token themselves. proxy.ts has already refreshed the
// token by the time this runs (see its header comment).
const forward = async (request: NextRequest, path: string[]) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return NextResponse.json({ success: false, error: { message: "Not authenticated" } }, { status: 401 });

  const search = request.nextUrl.search;
  const url = `${BACKEND_URL}/admin/${path.join("/")}${search}`;

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  const body = hasBody ? await request.text() : undefined;

  const backendRes = await fetch(url, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body,
  });

  if (backendRes.status === 204) return new NextResponse(null, { status: 204 });

  const json = await backendRes.json().catch(() => null);
  return NextResponse.json(json, { status: backendRes.status });
};

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: Context) {
  return forward(request, (await ctx.params).path);
}
export async function POST(request: NextRequest, ctx: Context) {
  return forward(request, (await ctx.params).path);
}
export async function PATCH(request: NextRequest, ctx: Context) {
  return forward(request, (await ctx.params).path);
}
export async function DELETE(request: NextRequest, ctx: Context) {
  return forward(request, (await ctx.params).path);
}
