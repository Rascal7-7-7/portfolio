import type { Project } from "@/content/projects";
import { EvidenceLog } from "./EvidenceLog";
import { MetaLine, ProjectLinks, ProjectTitle } from "./ProjectMeta";

/**
 * 代表作。一覧の1行を少し大きくしたもの。カードにはせず、上の罫線で区切る。
 * スクリーンショットが揃うまでは、根拠を <pre> 1枚で添える。
 */
export function FeaturedProject({ project }: { project: Project }) {
  const { headline, summary, highlights, evidence } = project;

  return (
    <article className="py-8 border-t border-rule">
      <ProjectTitle project={project} as="h3" className="text-xl sm:text-2xl" />
      <p className="mt-1 text-[17px] font-medium leading-relaxed text-ink">{headline}</p>
      <p className="mt-3 leading-[1.8] text-ink-muted">{summary}</p>

      <ul className="mt-4 list-disc pl-5 space-y-1 leading-relaxed text-ink-muted marker:text-ink-subtle">
        {highlights.map(({ label }) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      {evidence && <EvidenceLog lines={evidence} className="mt-6" />}

      <MetaLine project={project} className="mt-5" />
      <div className="mt-1">
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
