import type { Project } from "@/content/projects";
import { MetaLine, ProjectLinks, ProjectTitle } from "./ProjectMeta";

/**
 * 代表作以外の作品。代表作より目立たせないよう、作品名・一言説明・技術・リンクだけを
 * 数行に収め、説明文は折りたたむ。
 */
export function ProjectRow({ project }: { project: Project }) {
  const { headline, summary } = project;

  return (
    <article className="py-4 border-t border-rule">
      <ProjectTitle project={project} as="h4" className="text-base" />
      <p className="mt-0.5 text-ink-muted">{headline}</p>
      <MetaLine project={project} className="mt-2" />
      <details className="mt-1">
        <summary className="w-fit cursor-pointer py-1 text-sm text-ink-muted hover:text-ink transition-colors">
          概要を読む
        </summary>
        <p className="pt-1 pb-1 leading-[1.8] text-ink-muted">{summary}</p>
      </details>
      <ProjectLinks project={project} />
    </article>
  );
}
