import { cn } from "@/lib/cn";

/**
 * 根拠ログ。画像の代わりに、実測値と結論を端末の出力のように見せる。
 * 行頭の記号で強弱をつける（$ = 実行したこと、→ = 導いた結論）。
 */
function lineClass(line: string): string {
  if (line.startsWith("$")) return "text-brand-400";
  if (line.startsWith("→")) return "text-surface-50 font-semibold";
  return "text-surface-300";
}

export function EvidenceLog({
  lines,
  className,
}: {
  lines: readonly string[];
  className?: string;
}) {
  return (
    <figure className={cn("rounded-xl ring-1 ring-white/5 overflow-hidden", className)}>
      <figcaption className="flex items-center gap-2 px-5 py-2.5 border-b border-white/5 font-mono text-xs text-brand-400">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400" aria-hidden="true" />
        根拠
      </figcaption>
      <pre className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
        {lines.map((line, i) => (
          <span key={`${i}-${line}`} className={cn("block", lineClass(line))}>
            {line}
          </span>
        ))}
      </pre>
    </figure>
  );
}
