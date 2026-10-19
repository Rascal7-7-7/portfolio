import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { hasCaseStudy, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import { metaItems, periodLabel } from "@/lib/projectText";
import { TextLink, textLink } from "./ui/TextLink";

export { periodLabel, teamLabel } from "@/lib/projectText";

/** 作品名と制作時期の行。日付は右寄せの等幅にする。 */
export function ProjectTitle({
  project,
  as: Heading,
  className,
  showPeriod = true,
}: {
  project: Project;
  as: "h3" | "h4";
  className: string;
  /** 連作の行では、共通の制作時期を説明側に1回だけ書くため出さない */
  showPeriod?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Heading className={cn("font-semibold tracking-tight text-ink", className)}>
        {project.name}
      </Heading>
      {showPeriod && (
        <p className="shrink-0 font-mono text-[13px] text-ink-subtle">{periodLabel(project)}</p>
      )}
    </div>
  );
}

/**
 * 体制・確認方法・技術の1行。
 * 「コードで確認できる」が語の途中で折り返さないよう、項目ごとに inline-block で区切る。
 */
export function MetaLine({ project, className }: { project: Project; className?: string }) {
  return <MetaItems items={metaItems(project)} className={className} />;
}

export function MetaItems({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <p className={cn("text-sm leading-relaxed text-ink-subtle", className)}>
      {items.map((item, i) => (
        <span key={item} className="inline-block">
          {item}
          {i < items.length - 1 && (
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

/** Case Study・デモ・コードへの導線。無いものは出さない。 */
export function ProjectLinks({ project }: { project: Project }) {
  const { name, links } = project;
  return (
    <div className="flex flex-wrap gap-x-5">
      {hasCaseStudy(project) && (
        <Link
          href={`/projects/${project.slug}`}
          className={textLink({ tone: "accent" })}
          aria-label={`${name}の制作の記録を読む`}
        >
          制作の記録を読む
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      )}
      {links.demo && (
        <TextLink
          href={links.demo}
          target="_blank"
          rel="noopener noreferrer"
          tone="accent"
          aria-label={`${name}のデモを見る（新しいタブで開く）`}
        >
          デモを見る
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </TextLink>
      )}
      {links.github && (
        <TextLink
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}の設計・コードを見る（新しいタブで開く）`}
        >
          設計・コードを見る
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </TextLink>
      )}
    </div>
  );
}
