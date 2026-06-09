"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/access")
      .then((response) => response.json())
      .then((data) => setAllowed(Boolean(data.ok)))
      .finally(() => setChecking(false));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      setError("访问码不正确，请再试一次。");
      return;
    }

    setAllowed(true);
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center px-6 text-muted">正在打开资料库...</div>;
  }

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-line bg-white p-6 shadow-soft">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-sage/15 text-sage">
            <LockKeyhole size={22} aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">法国家庭旅行资料库</h1>
          <p className="mt-2 text-sm leading-6 text-muted">输入家庭访问码后，可以查看 POI 并修改三个人的兴趣标注。</p>
          <label className="mt-6 block text-sm font-medium" htmlFor="family-code">
            家庭访问码
          </label>
          <input
            id="family-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-3 outline-none ring-marine/20 focus:ring-4"
            autoComplete="off"
          />
          {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}
          <button className="mt-5 w-full rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white" type="submit">
            进入资料库
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
