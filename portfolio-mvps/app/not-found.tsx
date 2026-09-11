import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-surface-950">
      <div className="max-w-lg w-full text-center">
        <p className="text-brand-500 text-sm font-semibold tracking-widest mb-4">
          404 NOT FOUND
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
          ページが見つかりませんでした
        </h1>
        <p className="text-surface-400 leading-relaxed mb-10">
          URLが変更されたか、削除された可能性があります。
          <br className="hidden sm:block" />
          トップページから目的の内容を探してください。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className={cn(button({ variant: "primary" }))}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            トップページへ戻る
          </Link>
          <Link
            href="/#mvps"
            className={cn(button({ variant: "secondary" }))}
          >
            制作したものを見る
          </Link>
        </div>
      </div>
    </main>
  );
}
