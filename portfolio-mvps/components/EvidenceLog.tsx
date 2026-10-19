import { cn } from "@/lib/cn";

/**
 * 根拠。画像の代わりに、実測値と結論を薄い灰色地の <pre> 1枚で見せる。
 * 端末風の飾り（ヘッダー帯・色付きの点）は付けず、強弱は字の太さだけでつける
 * （→ で始まる行 = 導いた結論）。
 */
export function EvidenceLog({
  lines,
  className,
}: {
  lines: readonly string[];
  className?: string;
}) {
  return (
    <figure className={className}>
      <figcaption className="mb-2 text-sm text-ink-subtle">根拠</figcaption>
      <pre className="rounded-md bg-code px-4 py-3.5 font-mono text-[13px] leading-[1.7] text-ink-muted whitespace-pre-wrap">
        {lines.map((line, i) => (
          <span
            key={`${i}-${line}`}
            className={cn("block", line.startsWith("→") && "font-semibold text-ink")}
          >
            {line}
          </span>
        ))}
      </pre>
    </figure>
  );
}
