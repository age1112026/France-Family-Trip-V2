"use client";

import { MessageSquare } from "lucide-react";
import { FAMILY_MEMBERS, INTEREST_OPTIONS, type FamilyMemberId, type InterestLevel, type Vote, type VoteInput } from "@/lib/types";
import { makeVoteMap, voteKey } from "@/lib/votes";

export function VotePanel({
  poiId,
  votes,
  onVote
}: {
  poiId: string;
  votes: Vote[];
  onVote: (vote: VoteInput) => void;
}) {
  const map = makeVoteMap(votes);

  function update(memberId: FamilyMemberId, interestLevel: InterestLevel, note: string) {
    onVote({
      poi_id: poiId,
      member_id: memberId,
      interest_level: interestLevel,
      note
    });
  }

  return (
    <div className="space-y-3">
      {FAMILY_MEMBERS.map((member) => {
        const vote = map.get(voteKey(poiId, member.id));
        return (
          <div key={member.id} className="rounded-lg border border-line bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">{member.name}</div>
              <select
                value={vote?.interest_level || "neutral"}
                onChange={(event) => update(member.id, event.target.value as InterestLevel, vote?.note || "")}
                className="min-w-32 rounded-md border border-line bg-paper px-2 py-2 text-sm outline-none"
              >
                {INTEREST_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="mt-3 flex items-start gap-2 rounded-md border border-line bg-paper px-3 py-2">
              <MessageSquare className="mt-1 shrink-0 text-muted" size={16} aria-hidden />
              <textarea
                value={vote?.note || ""}
                onChange={(event) => update(member.id, (vote?.interest_level || "neutral") as InterestLevel, event.target.value)}
                rows={2}
                placeholder="一句备注"
                className="min-h-10 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </label>
          </div>
        );
      })}
    </div>
  );
}
