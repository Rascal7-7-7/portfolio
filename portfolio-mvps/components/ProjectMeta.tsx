import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { hasCaseStudy, type Project, type Verification } from "@/content/projects";
import { TextLink } from "./ui/TextLink";

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

export function metaLabel({ team, verification }: Project): string {
  const teamLabel = team.kind === "team" ? `チーム開発（${team.members}人）` : "個人開発";
  return `${teamLabel} · ${verificationLabels[verification]}`;
}

/** Case Study・デモ・コードへの導線。無いものは出さない。 */
export function ProjectLinks({ project }: { project: Project }) {
  const { name, links } = project;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      {hasCaseStudy(project) && (
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 py-2 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
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
