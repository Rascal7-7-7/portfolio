import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  /** 見出し本文 */
  title: string;
  /** section の aria-labelledby から参照される id */
  id: string;
  /** 節の通し番号（"01" など）。見出しの上に等幅で小さく添える */
  index?: string;
  description?: string;
  className?: string;
};

/** 節の見出し。通し番号と見出し、一文の説明だけにする。 */
export function SectionHeader({ title, id, index, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      {index && (
        <p className="mb-3 font-mono text-[13px] text-accent" aria-hidden="true">
          {index}
        </p>
      )}
      <h2 id={id} className="text-2xl sm:text-[28px] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {description && <p className="mt-3 leading-[1.8] text-ink-muted">{description}</p>}
    </div>
  );
}
