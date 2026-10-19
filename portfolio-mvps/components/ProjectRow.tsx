import type { Project } from "@/content/projects";
import { ProjectLinks, metaLabel, periodLabel } from "./ProjectMeta";

/**
 * 代表作以外の作品。カードを並べるとどれも同じに見えるため、行のリストにする。
 */
export function ProjectRow({ project }: { project: Project }) {
  const { name, headline, summary, stack } = project;

  return (
    <article className="grid grid-cols-1 sm:grid-cols-8 gap-2 sm:gap-6 py-6">
      <p className="sm:col-span-2 font-mono text-xs text-surface-400 pt-1">{periodLabel(project)}</p>
      <div className="sm:col-span-6">
        <h3 className="text-lg font-bold text-surface-50">{name}</h3>
        <p className="text-sm text-surface-200 mb-2">{headline}</p>
        <p className="text-sm text-surface-400 leading-relaxed mb-3">{summary}</p>
        <p className="font-mono text-xs text-surface-400 mb-1">
          {metaLabel(project)} · {stack.join(" / ")}
        </p>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
