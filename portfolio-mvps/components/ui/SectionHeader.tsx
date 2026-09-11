import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  /** セクションの英字ラベル（MVP CASES など） */
  label: string;
  /** 見出し本文 */
  title: string;
  /** section の aria-labelledby から参照される id */
  id: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  id,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", className)}>
      <p className="text-brand-500 text-sm font-semibold mb-3">{label}</p>
      <h2
        id={id}
        className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4"
      >
        {title}
      </h2>
      {description && <p className="text-surface-400 max-w-xl">{description}</p>}
    </div>
  );
}
