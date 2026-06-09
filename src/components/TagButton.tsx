"use client";

import { clsx } from "clsx";

export function TagButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "whitespace-nowrap rounded-full border px-3 py-2 text-sm transition",
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-muted"
      )}
    >
      {children}
    </button>
  );
}
