import type { Project } from "@/content/projects";
import { ProjectLinks, periodLabel } from "./ProjectMeta";

/**
 * 代表作以外の作品。代表作より目立たせないよう、作品名・一言説明・技術・リンクだけを
 * 1〜2行に収め、説明文は折りたたむ。
 */
export function ProjectRow({ project }: { project: Project }) {
  const { name, headline, summary, stack } = project;

  return (
    <article className="py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6">
        <h3 className="text-base font-bold text-surface-50">
          {name}
          <span className="block sm:inline sm:ml-3 text-sm font-normal text-surface-300">
            {headline}
          </span>
        </h3>
        <div className="shrink-0">
          <ProjectLinks project={project} />
        </div>
      </div>
      <p className="font-mono text-xs text-surface-400">
        {periodLabel(project)} · {stack.join(" / ")}
      </p>
      <details className="mt-1">
        <summary className="w-fit cursor-pointer py-1 text-xs text-surface-400 hover:text-surface-200 transition-colors">
          概要を読む
        </summary>
        <p className="text-sm text-surface-300 leading-relaxed pt-1 max-w-2xl">{summary}</p>
      </details>
    </article>
  );
}
