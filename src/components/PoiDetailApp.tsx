"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Heart, MapPinned, Ticket, Umbrella, Moon, Sofa } from "lucide-react";
import { AppShell } from "./AppShell";
import { ImageCarousel } from "./ImageCarousel";
import { VotePanel } from "./VotePanel";
import { useTravelData } from "./useTravelData";

export function PoiDetailApp({ slug }: { slug: string }) {
  const { pois, votes, loading, updateVote } = useTravelData();
  const poi = pois.find((item) => item.slug === slug);

  if (loading) {
    return (
      <AppShell active="list">
        <div className="rounded-lg border border-line bg-white p-5 text-muted">正在读取详情...</div>
      </AppShell>
    );
  }

  if (!poi) {
    return (
      <AppShell active="list">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-muted">
          <ArrowLeft size={16} aria-hidden />
          返回列表
        </Link>
        <div className="rounded-lg border border-line bg-white p-5">没有找到这个 POI。</div>
      </AppShell>
    );
  }

  return (
    <AppShell active="list">
      <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft size={16} aria-hidden />
        返回列表
      </Link>

      <article className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <ImageCarousel images={poi.images} title={poi.name} />
        <div className="p-5">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-marine/10 px-2 py-1 text-marine">{poi.city_region}</span>
            <span className="rounded-full bg-butter/30 px-2 py-1 text-ink">{poi.classic_level}</span>
            <span className="rounded-full bg-sage/15 px-2 py-1 text-sage">{poi.verification_status}</span>
            {poi.content_status === "upgraded" ? <span className="rounded-full bg-clay/10 px-2 py-1 text-clay">样板升级</span> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">{poi.name}</h1>
          {poi.name_local ? <p className="mt-1 text-muted">{poi.name_local}</p> : null}
          <p className="mt-4 text-base leading-7 text-muted">{poi.short_intro}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {poi.family_fit_score ? <Fact label="家庭适配" value={`${poi.family_fit_score}/5`} /> : null}
            <Fact label="建议时间" value={poi.suggested_duration} />
            <Fact label="交通难度" value={poi.transport_difficulty} />
            <Fact label="体力强度" value={poi.physical_intensity} />
            <Fact label="语言门槛" value={poi.language_barrier} />
            <Fact label="预约" value={poi.reservation_required ? "需要" : "通常不需要"} />
            <Fact label="价位" value={poi.price_level} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {poi.fit_reason ? <TextBlock title="为什么适合我们家" body={poi.fit_reason} /> : null}
            {poi.possible_mismatch ? <TextBlock title="可能不适合的点" body={poi.possible_mismatch} /> : null}
            {poi.best_use ? <TextBlock title="最佳使用方式" body={poi.best_use} /> : null}
            {poi.transport_note ? <TextBlock title="交通说明" body={poi.transport_note} /> : null}
            <TextBlock title="推荐理由" body={poi.editor_reason} />
            <TextBlock title="谨慎理由" body={poi.caution_reason} />
            <TextBlock title="预约提醒" body={poi.latest_reservation_advice} />
            <TextBlock title="评价摘要" body={poi.review_summary} />
            {poi.verify_before ? <TextBlock title="核实提醒" body={poi.verify_before} /> : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {poi.use_cases?.map((useCase) => <Signal key={useCase} icon={<Heart size={15} />} label={useCase} />)}
            {poi.rainy_day_suitable ? <Signal icon={<Umbrella size={15} />} label="适合雨天" /> : null}
            {poi.night_suitable ? <Signal icon={<Moon size={15} />} label="适合晚上" /> : null}
            {poi.easy_day_suitable ? <Signal icon={<Sofa size={15} />} label="适合轻松日" /> : null}
          </div>

          <section className="mt-7">
            <h2 className="mb-3 text-lg font-semibold">家庭兴趣标注</h2>
            <VotePanel poiId={poi.id} votes={votes} onVote={updateVote} />
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-lg font-semibold">参考链接</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <a className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-3 text-sm" href={poi.map_url} target="_blank" rel="noreferrer">
                <MapPinned size={16} aria-hidden />
                地图
              </a>
              <a className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-3 text-sm" href={poi.official_url} target="_blank" rel="noreferrer">
                <Ticket size={16} aria-hidden />
                官方网站
              </a>
              {poi.links.map((link) => (
                <a key={link.url} className="flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-3 text-sm" href={link.url} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden />
                  {link.label}
                </a>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-lg font-semibold">我的编辑备注</h2>
            <p className="rounded-md bg-paper px-3 py-3 text-sm leading-6 text-muted">{poi.editor_note}</p>
          </section>
        </div>
      </article>
    </AppShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function TextBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </section>
  );
}

function Signal({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-2 text-sm text-sage">
      {icon}
      {label}
    </span>
  );
}
