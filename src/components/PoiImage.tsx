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
      <div className={`flex items-center justify-center bg-marine/10 text-marine ${className || ""}`}>
        <div className="flex flex-col items-center gap-2 px-4 text-center text-sm">
          <ImageIcon size={22} aria-hidden />
          <span>{alt}</span>
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={`object-cover ${className || ""}`} onError={() => setFailed(true)} />;
}
