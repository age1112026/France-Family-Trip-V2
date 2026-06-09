"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Poi, Vote, VoteInput } from "@/lib/types";
import { localVotes, saveLocalVote } from "@/lib/votes";

export function useTravelData() {
  const [pois, setPois] = useState<Poi[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineVotes, setOfflineVotes] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const [poisResponse, votesResponse] = await Promise.all([fetch("/api/pois"), fetch("/api/votes")]);
      if (!active) return;

      if (poisResponse.ok) {
        const data = await poisResponse.json();
        setPois(data.pois);
      }

      if (votesResponse.ok) {
        const data = await votesResponse.json();
        const serverVotes = data.votes || [];
        const local = localVotes();
        setVotes(serverVotes.length ? serverVotes : local);
        setOfflineVotes(!serverVotes.length && local.length > 0);
      } else {
        setVotes(localVotes());
        setOfflineVotes(true);
      }

      setLoading(false);
    }

    load().catch(() => {
      setVotes(localVotes());
      setOfflineVotes(true);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const updateVote = useCallback(async (input: VoteInput) => {
    const vote = { ...input, updated_at: new Date().toISOString() };
    setVotes((current) => [...current.filter((item) => !(item.poi_id === vote.poi_id && item.member_id === vote.member_id)), vote]);

    const response = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    }).catch(() => null);

    if (!response?.ok) {
      saveLocalVote(vote);
      setOfflineVotes(true);
      return;
    }

    const result = await response.json();
    if (!result.persisted) {
      saveLocalVote(vote);
      setOfflineVotes(true);
    }
  }, []);

  return useMemo(
    () => ({
      pois,
      votes,
      loading,
      offlineVotes,
      updateVote
    }),
    [pois, votes, loading, offlineVotes, updateVote]
  );
}
