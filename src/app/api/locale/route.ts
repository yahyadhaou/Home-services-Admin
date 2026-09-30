import { NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/i18n/locale";

export async function POST(request: Request) {
  const { locale } = await request.json();
  if (!isLocale(locale)) {
    return NextResponse.json({ success: false, error: { message: "Unknown locale" } }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(LOCALE_COOKIE, locale, {
    // Readable by the client on purpose — see locale.ts's comment.
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
