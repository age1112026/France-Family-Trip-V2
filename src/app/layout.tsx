import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "法国家庭旅行资料库",
  description: "2026 法国家庭旅行 POI 共创与筛选工具"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
