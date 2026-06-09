import { NextRequest, NextResponse } from "next/server";
import { hasAccessFromRequest } from "@/lib/access";
import { getVotes, upsertVote } from "@/lib/repository";
import type { VoteInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (!hasAccessFromRequest(request)) {
    return NextResponse.json({ message: "需要家庭访问码" }, { status: 401 });
  }

  const votes = await getVotes();
  return NextResponse.json({ votes });
}

export async function POST(request: NextRequest) {
  if (!hasAccessFromRequest(request)) {
    return NextResponse.json({ message: "需要家庭访问码" }, { status: 401 });
  }

  const vote = (await request.json()) as VoteInput;
  if (!vote.poi_id || !vote.member_id || !vote.interest_level) {
    return NextResponse.json({ message: "投票数据不完整" }, { status: 400 });
  }

  const result = await upsertVote(vote);
  return NextResponse.json(result);
}
