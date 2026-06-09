import { NextRequest, NextResponse } from "next/server";
import { hasAccessFromRequest } from "@/lib/access";
import { getPois } from "@/lib/repository";

export async function GET(request: NextRequest) {
  if (!hasAccessFromRequest(request)) {
    return NextResponse.json({ message: "需要家庭访问码" }, { status: 401 });
  }

  const pois = await getPois();
  return NextResponse.json({ pois });
}
