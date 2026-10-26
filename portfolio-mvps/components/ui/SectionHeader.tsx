import { cn } from "@/lib/cn";
import { Phrase } from "../Phrase";

type SectionHeaderProps = {
  /** 見出し本文 */
  title: string;
  /** section の aria-labelledby から参照される id */
  id: string;
  description?: string;
  className?: string;
};

/** 節の見出し。見出しと一文の説明だけにする。 */
export function SectionHeader({ title, id, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      <h2 id={id} className="text-[28px] leading-tight sm:text-[40px] font-bold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[17px] leading-[1.8] text-ink-muted">
          <Phrase text={description} />
        </p>
      )}
    </div>
  );
}
