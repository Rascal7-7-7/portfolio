import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  /** 見出し本文 */
  title: string;
  /** section の aria-labelledby から参照される id */
  id: string;
  description?: string;
  className?: string;
};

/** 節の見出し。飾りのラベルは付けず、見出しと一文の説明だけにする。 */
export function SectionHeader({ title, id, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h2 id={id} className="text-xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {description && <p className="mt-2 text-ink-muted">{description}</p>}
    </div>
  );
}
