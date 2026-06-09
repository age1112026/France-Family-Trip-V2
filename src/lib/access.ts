import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "france_trip_access";

function secret() {
  return process.env.ACCESS_COOKIE_SECRET || "dev-only-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function makeAccessCookie() {
  const issued = String(Date.now());
  return `${issued}.${sign(issued)}`;
}

export function validateCookieValue(value?: string) {
  if (!value) return false;
  const [issued, signature] = value.split(".");
  if (!issued || !signature) return false;

  const expected = sign(issued);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;

  const maxAgeMs = 1000 * 60 * 60 * 24 * 45;
  const isFresh = Date.now() - Number(issued) < maxAgeMs;
  return isFresh && timingSafeEqual(left, right);
}

export function hasAccessFromRequest(request: NextRequest) {
  return validateCookieValue(request.cookies.get(COOKIE_NAME)?.value);
}

export function hasAccessFromCookies() {
  return validateCookieValue(cookies().get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME };
