"use client";

import Link from "next/link";
import { CalendarClock, Moon, ThumbsUp, TriangleAlert, Umbrella, Users } from "lucide-react";
import { AppShell } from "./AppShell";
import { useTravelData } from "./useTravelData";
import { poiStats } from "@/lib/votes";
import type { Poi } from "@/lib/types";

export function DecisionApp() {
  const { pois, votes, loading } = useTravelData();

  const groups = [
    {
      title: "三个人都很想去",
      icon: <Users size={18} />,
      items: pois.filter((poi) => poiStats(poi, votes).allWant)
    },
    {
      title: "至少两个人正向",
      icon: <ThumbsUp size={18} />,
      items: pois.filter((poi) => poiStats(poi, votes).atLeastTwoWant)
    },
    {
      title: "有人明确不想去",
      icon: <TriangleAlert size={18} />,
      items: pois.filter((poi) => poiStats(poi, votes).hasNo)
    },
    {
      title: "需要提前预约",
      icon: <CalendarClock size={18} />,
      items: pois.filter((poi) => poi.reservation_required)
    },
    {
      title: "适合雨天",
      icon: <Umbrella size={18} />,
      items: pois.filter((poi) => poi.rainy_day_suitable)
    },
    {
      title: "适合晚上",
      icon: <Moon size={18} />,
      items: pois.filter((poi) => poi.night_suitable)
    },
    {
      title: "最终入选候选池",
      icon: <ThumbsUp size={18} />,
      items: pois.filter((poi) => poiStats(poi, votes).candidate)
    }
  ];

  return (
    <AppShell active="decision">
      {loading ? <div className="rounded-lg border border-line bg-white p-5 text-muted">正在汇总投票...</div> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group.title} className="rounded-lg border border-line bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                {group.icon}
                {group.title}
              </h2>
              <span className="rounded-full bg-paper px-2 py-1 text-xs text-muted">{group.items.length}</span>
            </div>
            <div className="space-y-2">
              {group.items.length ? (
                group.items.map((poi) => <DecisionItem key={poi.id} poi={poi} />)
              ) : (
                <p className="rounded-md bg-paper px-3 py-3 text-sm text-muted">暂无 POI。</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}

function DecisionItem({ poi }: { poi: Poi }) {
  return (
    <Link href={`/poi/${poi.slug}`} className="block rounded-md border border-line bg-paper px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{poi.name}</div>
          <div className="mt-1 text-xs text-muted">{poi.city_region} · {poi.suggested_duration}</div>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs text-muted">{poi.classic_level}</span>
      </div>
    </Link>
  );
}
