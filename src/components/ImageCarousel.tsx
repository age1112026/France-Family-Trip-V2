"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { PoiImage as PoiImageType } from "@/lib/types";
import { PoiImage } from "./PoiImage";

export function ImageCarousel({ images, title }: { images: PoiImageType[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const safeImages = images.length ? images : [];

  function move(direction: "left" | "right") {
    const element = ref.current;
    if (!element) return;
    const amount = element.clientWidth * 0.82;
    element.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section className="relative">
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2">
        {safeImages.map((image) => (
          <figure key={`${image.image_url}-${image.sort_order}`} className="min-w-full snap-center overflow-hidden rounded-lg border border-line bg-white sm:min-w-[72%]">
            <PoiImage src={image.image_url} alt={image.alt || title} className="h-64 w-full sm:h-80" />
            <figcaption className="border-t border-line px-3 py-2 text-xs leading-5 text-muted">{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      {safeImages.length > 1 ? (
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => move("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft"
            aria-label="上一张图片"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => move("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft"
            aria-label="下一张图片"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      ) : null}
    </section>
  );
}
