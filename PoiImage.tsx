"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";

export function PoiImage({
  src,
  alt,
  className
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-marine/10 text-white ${className || ""}`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#31546b_0%,#78866b_42%,#b86f52_100%)]" />
        <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-white/12" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="relative flex max-w-xs flex-col items-center gap-2 px-5 text-center">
          <ImageIcon size={24} aria-hidden />
          <span className="text-base font-semibold leading-6">{alt}</span>
          <span className="text-xs leading-5 text-white/80">图片源暂不可用，先用稳定视觉卡片占位</span>
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={`object-cover ${className || ""}`} onError={() => setFailed(true)} />;
}
