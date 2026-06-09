import { FAMILY_MEMBERS, INTEREST_OPTIONS, type FamilyMemberId, type Poi, type Vote } from "./types";

export function voteKey(poiId: string, memberId: FamilyMemberId) {
  return `${poiId}:${memberId}`;
}

export function makeVoteMap(votes: Vote[]) {
  return new Map(votes.map((vote) => [voteKey(vote.poi_id, vote.member_id), vote]));
}

export function interestLabel(value?: string) {
  return INTEREST_OPTIONS.find((option) => option.value === value)?.label || "未标注";
}

export function voteWeight(value?: string) {
  return INTEREST_OPTIONS.find((option) => option.value === value)?.weight || 0;
}

export function poiStats(poi: Poi, votes: Vote[]) {
  const map = makeVoteMap(votes);
  const levels = FAMILY_MEMBERS.map((member) => map.get(voteKey(poi.id, member.id))?.interest_level);
  const mustGoCount = levels.filter((level) => level === "must_go").length;
  const positiveCount = levels.filter((level) => level === "must_go" || level === "okay" || level === "revisit").length;
  const notInterestedCount = levels.filter((level) => level === "not_interested").length;
  const score = levels.reduce((sum, level) => sum + voteWeight(level), 0);

  return {
    mustGoCount,
    positiveCount,
    notInterestedCount,
    score,
    allWant: mustGoCount === FAMILY_MEMBERS.length,
    atLeastTwoWant: mustGoCount >= 2 || positiveCount >= 2,
    hasNo: notInterestedCount > 0,
    candidate: positiveCount >= 2 && notInterestedCount === 0
  };
}

export function localVotes() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("france-trip-votes") || "[]") as Vote[];
  } catch {
    return [];
  }
}

export function saveLocalVote(vote: Vote) {
  if (typeof window === "undefined") return;
  const votes = localVotes().filter((item) => !(item.poi_id === vote.poi_id && item.member_id === vote.member_id));
  votes.push(vote);
  window.localStorage.setItem("france-trip-votes", JSON.stringify(votes));
}
