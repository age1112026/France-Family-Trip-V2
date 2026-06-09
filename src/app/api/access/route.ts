import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, hasAccessFromRequest, makeAccessCookie } from "@/lib/access";

export async function GET(request: NextRequest) {
  return NextResponse.json({ ok: hasAccessFromRequest(request) });
}

export async function POST(request: NextRequest) {
  const { code } = await request.json().catch(() => ({ code: "" }));
  const expected = process.env.FAMILY_ACCESS_CODE || "france2026";

  if (code !== expected) {
    return NextResponse.json({ ok: false, message: "访问码不正确" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, makeAccessCookie(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 45
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
