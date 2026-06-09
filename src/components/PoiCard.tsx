"use client";

import Link from "next/link";
import { ArrowRight, Clock, Heart, MapPin, ShieldAlert, Users } from "lucide-react";
import type { Poi, Vote, VoteInput } from "@/lib/types";
import { FAMILY_MEMBERS } from "@/lib/types";
import { interestLabel, makeVoteMap, poiStats, voteKey } from "@/lib/votes";
import { PoiImage } from "./PoiImage";
import { VotePanel } from "./VotePanel";

export function PoiCard({
  poi,
  votes,
  onVote
}: {
  poi: Poi;
  votes: Vote[];
  onVote: (vote: VoteInput) => void;
}) {
  const stats = poiStats(poi, votes);
  const voteMap = makeVoteMap(votes);

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        <PoiImage src={poi.images[0]?.image_url} alt={poi.images[0]?.alt || poi.name} className="h-44 w-full sm:h-full" />
        <div className="p-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-marine/10 px-2 py-1 text-marine">{poi.city_region}</span>
            <span className="rounded-full bg-butter/30 px-2 py-1 text-ink">{poi.classic_level}</span>
            {poi.reservation_required ? <span className="rounded-full bg-clay/10 px-2 py-1 text-clay">需预约</span> : null}
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-normal">{poi.name}</h2>
              {poi.name_local ? <p className="mt-1 text-sm text-muted">{poi.name_local}</p> : null}
            </div>
            <Link
              href={`/poi/${poi.slug}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted"
              aria-label={`查看 ${poi.name}`}
            >
              <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{poi.short_intro}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-4">
            <span className="flex items-center gap-1"><Clock size={14} />{poi.suggested_duration}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />交通{poi.transport_difficulty}</span>
            <span className="flex items-center gap-1"><Users size={14} />体力{poi.physical_intensity}</span>
            <span className="flex items-center gap-1"><ShieldAlert size={14} />{poi.verification_status}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {poi.content_status === "upgraded" ? (
              <span className="rounded-full border border-sage/40 bg-sage/10 px-2 py-1 text-xs text-sage">样板升级</span>
            ) : null}
            {poi.family_fit_score ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-clay/30 bg-clay/10 px-2 py-1 text-xs text-clay">
                <Heart size={12} aria-hidden />
                家庭适配 {poi.family_fit_score}/5
              </span>
            ) : null}
            {poi.use_cases?.slice(0, 3).map((useCase) => (
              <span key={useCase} className="rounded-full border border-line bg-paper px-2 py-1 text-xs text-muted">
                {useCase}
              </span>
            ))}
          </div>
          {poi.fit_reason ? <p className="mt-3 rounded-md bg-sage/10 px-3 py-2 text-sm leading-6 text-sage">{poi.fit_reason}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {poi.categories.map((category) => (
              <span key={category} className="rounded-full border border-line px-2 py-1 text-xs text-muted">
                {category}
              </span>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {FAMILY_MEMBERS.map((member) => (
              <div key={member.id} className="rounded-md bg-paper px-3 py-2 text-sm">
                <span className="font-medium">{member.name}</span>
                <span className="ml-2 text-muted">{interestLabel(voteMap.get(voteKey(poi.id, member.id))?.interest_level)}</span>
              </div>
            ))}
          </div>
          {stats.candidate ? (
            <div className="mt-3 rounded-md bg-sage/15 px-3 py-2 text-sm text-sage">自动候选：至少两人正向，且无人明确不想去。</div>
          ) : null}
        </div>
      </div>
      <details className="border-t border-line bg-paper/70">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted">快速标注兴趣</summary>
        <div className="px-4 pb-4">
          <VotePanel poiId={poi.id} votes={votes} onVote={onVote} />
        </div>
      </details>
    </article>
  );
}
