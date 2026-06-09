"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { PoiImage as PoiImageType } from "@/lib/types";
import { PoiImage } from "./PoiImage";

export function ImageCarousel({ images, title }: { images: PoiImageType[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const safeImages = images.length ? images : [];

  function move(direction: "left" | "right") {
    const element = ref.current;
    if (!element) return;
    const amount = element.clientWidth * 0.82;
    element.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  function onScroll() {
    const element = ref.current;
    if (!element) return;
    const index = Math.round(element.scrollLeft / Math.max(element.clientWidth, 1));
    setActive(Math.min(Math.max(index, 0), safeImages.length - 1));
  }

  return (
    <section className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
      >
        {safeImages.map((image, index) => (
          <figure key={`${image.image_url}-${image.sort_order}`} className="min-w-full snap-center overflow-hidden rounded-lg border border-line bg-white sm:min-w-[72%]">
            <PoiImage src={image.image_url} alt={image.alt || title} className="h-64 w-full sm:h-80" />
            <figcaption className="flex items-start justify-between gap-3 border-t border-line px-3 py-2 text-xs leading-5 text-muted">
              <span>{image.caption}</span>
              <span className="shrink-0 rounded-full bg-paper px-2 py-1 text-[11px] text-muted">
                {index + 1}/{safeImages.length}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {safeImages.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => move("left")}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-soft"
            aria-label="上一张图片"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <div className="rounded-full bg-white/95 px-3 py-2 text-xs font-medium text-ink shadow-soft">
            滑动图片 {active + 1}/{safeImages.length}
          </div>
          <button
            type="button"
            onClick={() => move("right")}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-soft"
            aria-label="下一张图片"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      ) : null}
    </section>
  );
}
