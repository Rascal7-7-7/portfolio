import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { hasCaseStudy, type Project, type Verification } from "@/content/projects";
import { cn } from "@/lib/cn";
import { TextLink, textLink } from "./ui/TextLink";

/** 閲覧者がどこまで確かめられるか。一覧の時点で分かるようにする。 */
const verificationLabels = {
  "live-demo": "デモで操作できる",
  "demo-video": "動画で確認できる",
  "code-only": "コードで確認できる",
} satisfies Record<Verification, string>;

export function periodLabel({ period }: Project): string {
  const start = period.start.replace("-", "/");
  return period.end ? `${start}〜${period.end.replace("-", "/")}` : `${start}〜`;
}

export function teamLabel({ team }: Project): string {
  return team.kind === "team" ? `チーム開発（${team.members}人）` : "個人開発";
}

/** 作品名と制作時期の行。日付は右寄せの等幅にする。 */
export function ProjectTitle({
  project,
  as: Heading,
  className,
}: {
  project: Project;
  as: "h3" | "h4";
  className: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Heading className={cn("font-semibold tracking-tight text-ink", className)}>
        {project.name}
      </Heading>
      <p className="shrink-0 font-mono text-[13px] text-ink-subtle">{periodLabel(project)}</p>
    </div>
  );
}

/**
 * 体制・確認方法・技術の1行。
 * 「コードで確認できる」が語の途中で折り返さないよう、項目ごとに inline-block で区切る。
 */
export function MetaLine({ project, className }: { project: Project; className?: string }) {
  const items = [teamLabel(project), verificationLabels[project.verification], ...project.stack];
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
