import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { estimateUrl } from "@/lib/utils";

/** シリーズの別 MVP へのリンク。新しいタブで開くことを矢印と読み上げで伝える */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hit inline-flex items-center gap-0.5 rounded font-medium text-ink underline decoration-rule underline-offset-2 hover:decoration-ink"
    >
      {children}
      <ArrowUpRight size={14} aria-hidden />
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}

/** 「見積 EST-0014 の承認後に作成」と見積マネージャー側の該当ページ */
export function EstimateSource({ estimateNo }: { estimateNo: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2">
      <span className="text-warm-500">
        見積 <span className="num">{estimateNo}</span> の承認後に作成（デモでは作成済み）
      </span>
      <ExternalLink href={estimateUrl(estimateNo)}>見積マネージャーで見る（デモ）</ExternalLink>
    </span>
  );
}
