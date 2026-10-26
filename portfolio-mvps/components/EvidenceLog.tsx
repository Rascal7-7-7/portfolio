import { ArrowUpRight } from "lucide-react";
import type { Evidence } from "@/content/projects";
import { cn } from "@/lib/cn";

/**
 * 根拠。実測値を「項目と値」の表で見せ、出典へのリンクを必ず添える。
 * 端末の出力に見せかけた飾りは使わない（自分の解釈が実ログに見えてしまうため）。
 * 値は等幅・桁揃えにし、項目は和文のまま読めるようにする。
 */
export function EvidenceLog({
  evidence,
  className,
}: {
  evidence: Evidence;
  className?: string;
}) {
  const { rows, source } = evidence;
  return (
    <figure className={cn("rounded-lg border border-rule bg-code", className)}>
      <dl className="divide-y divide-rule">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-6 px-4 py-3 sm:px-5">
            <dt className="text-sm text-ink-muted">{label}</dt>
            <dd className="shrink-0 font-mono text-sm tabular-nums text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="border-t border-rule px-4 py-2.5 text-[13px] text-ink-subtle sm:px-5">
        出典：
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 underline decoration-ink-subtle/50 underline-offset-4 hover:text-ink"
        >
          {source.label}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">（新しいタブで開く）</span>
        </a>
      </figcaption>
    </figure>
  );
}
