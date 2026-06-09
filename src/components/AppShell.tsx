import Link from "next/link";
import { CalendarDays, Library, ListChecks } from "lucide-react";

export function AppShell({ children, active }: { children: React.ReactNode; active: "list" | "decision" }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-24 pt-5 sm:px-6">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <CalendarDays size={16} aria-hidden />
          <span>2026.09.25 - 10.04 · Nice 9/25-9/29 · Paris 9/29-10/4</span>
        </div>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">法国家庭旅行资料库</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              先共同浏览、筛选和标注兴趣，再组合正式行程。
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-2 rounded-lg border border-line bg-white p-1 shadow-soft sm:w-72">
            <Link
              href="/"
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                active === "list" ? "bg-ink text-white" : "text-muted"
              }`}
            >
              <Library size={16} aria-hidden />
              POI
            </Link>
            <Link
              href="/decision"
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                active === "decision" ? "bg-ink text-white" : "text-muted"
              }`}
            >
              <ListChecks size={16} aria-hidden />
              决策
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
