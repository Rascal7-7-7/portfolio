import Image from "next/image";
import type { Project } from "@/content/projects";
import { ProjectLinks, ProjectTitle } from "./ProjectMeta";

/**
 * 代表作以外の作品（業務モックアップの連作）。代表作より目立たせないよう、作品名・一言説明・
 * リンクだけを数行に収め、説明文は折りたたむ。制作時期・技術は連作の説明に1回だけ書く。
 * 画面写真がある作品だけ、行の右側に小さく添える（無い作品は文字だけで崩れない）。
 */
export function ProjectRow({ project }: { project: Project }) {
  const { name, headline, summary, thumbnail } = project;

  return (
    // モバイルは本文の幅を削らないよう画像を上に、sm 以上は行の右側に置く
    <article className="reveal py-4 border-t border-rule flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:gap-6">
      <div className="min-w-0 flex-1">
        <ProjectTitle project={project} as="h4" className="text-base" showPeriod={false} />
        <p className="mt-0.5 text-ink-muted">{headline}</p>
        <details className="mt-1">
          <summary className="w-fit cursor-pointer py-1 text-sm text-ink-muted hover:text-ink transition-colors">
            概要を読む
          </summary>
          <p className="pt-1 pb-1 leading-[1.8] text-ink-muted">{summary}</p>
        </details>
        <ProjectLinks project={project} />
      </div>
      {thumbnail && (
        <Image
          src={thumbnail}
          alt={`${name}のデモ画面`}
          width={800}
          height={500}
          sizes="(min-width: 640px) 288px, 100vw"
          className="w-full sm:w-72 sm:mt-1 h-auto shrink-0 rounded-[4px] border border-rule"
        />
      )}
    </article>
  );
}
