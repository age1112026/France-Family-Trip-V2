"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AUDIENCE_TAGS, CATEGORIES, CITY_REGIONS } from "@/lib/types";
import { AppShell } from "./AppShell";
import { PoiCard } from "./PoiCard";
import { TagButton } from "./TagButton";
import { useTravelData } from "./useTravelData";

function toggleValue<T>(items: T[], value: T) {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export function PoiListApp() {
  const { pois, votes, loading, offlineVotes, updateVote } = useTravelData();
  const [query, setQuery] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [audience, setAudience] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return pois.filter((poi) => {
      const text = [
        poi.name,
        poi.name_local,
        poi.short_intro,
        poi.editor_reason,
        poi.caution_reason,
        poi.fit_reason,
        poi.best_use,
        poi.use_cases?.join(" "),
        poi.categories.join(" "),
        poi.audience_tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!keyword || text.includes(keyword)) &&
        (!regions.length || regions.includes(poi.city_region)) &&
        (!categories.length || categories.some((category) => poi.categories.some((item) => item === category))) &&
        (!audience.length || audience.some((tag) => poi.audience_tags.some((item) => item === tag)))
      );
    });
  }, [pois, query, regions, categories, audience]);

  return (
    <AppShell active="list">
      <section className="mb-5 rounded-lg border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal size={17} aria-hidden />
          筛选
        </div>
        <label className="mt-4 flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2">
          <Search className="shrink-0 text-muted" size={18} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索名称、理由、标签"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </label>

        <div className="mt-4 space-y-4">
          <FilterRow title="城市/区域">
            {CITY_REGIONS.map((region) => (
              <TagButton key={region} active={regions.includes(region)} onClick={() => setRegions(toggleValue(regions, region))}>
                {region}
              </TagButton>
            ))}
          </FilterRow>
          <FilterRow title="类型">
            {CATEGORIES.map((category) => (
              <TagButton key={category} active={categories.includes(category)} onClick={() => setCategories(toggleValue(categories, category))}>
                {category}
              </TagButton>
            ))}
          </FilterRow>
          <FilterRow title="适合人群">
            {AUDIENCE_TAGS.map((tag) => (
              <TagButton key={tag} active={audience.includes(tag)} onClick={() => setAudience(toggleValue(audience, tag))}>
                {tag}
              </TagButton>
            ))}
          </FilterRow>
        </div>
      </section>

      {offlineVotes ? <div className="mb-4 rounded-md border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">当前投票使用本机暂存；配置 Supabase 后会共享到云端。</div> : null}

      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span>{loading ? "正在读取 POI..." : `共 ${filtered.length} / ${pois.length} 个 POI`}</span>
        {(regions.length || categories.length || audience.length || query) ? (
          <button
            type="button"
            onClick={() => {
              setRegions([]);
              setCategories([]);
              setAudience([]);
              setQuery("");
            }}
            className="rounded-md border border-line bg-white px-3 py-1"
          >
            清空筛选
          </button>
        ) : null}
      </div>

      <section className="space-y-4">
        {filtered.map((poi) => (
          <PoiCard key={poi.id} poi={poi} votes={votes} onVote={updateVote} />
        ))}
      </section>
    </AppShell>
  );
}

function FilterRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted">{title}</div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">{children}</div>
    </div>
  );
}
