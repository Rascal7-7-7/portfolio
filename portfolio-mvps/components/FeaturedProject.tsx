import type { Project } from "@/content/projects";
import { EvidenceLog } from "./EvidenceLog";
import { FlowDiagram } from "./FlowDiagram";
import { FlowRow } from "./FlowRow";
import { MetaLine, ProjectLinks, ProjectTitle } from "./ProjectMeta";

/**
 * 代表作。一覧の1行を少し大きくしたもの。カードにはせず、上の罫線で区切る。
 * スクリーンショットの代わりに、Case Study と同じ事実から描いた構成図を見た目の中心に置き、
 * 根拠を <pre> 1枚で添える。構成図は sm 以上で横1列、狭い画面では縦に詰めた版を出す。
 */
export function FeaturedProject({ project }: { project: Project }) {
  const { slug, headline, summary, highlights, evidence, diagram } = project;

  return (
    <article className="reveal py-12 sm:py-16 border-t border-rule">
      <ProjectTitle project={project} as="h3" className="text-2xl sm:text-[28px]" />
      <p className="phrase mt-2 text-[17px] sm:text-lg font-medium leading-relaxed text-ink">{headline}</p>

      {diagram && (
        <>
          <FlowRow id={`${slug}-row`} diagram={diagram} className="mt-8 hidden sm:block" />
          <FlowDiagram
            id={`${slug}-compact`}
            diagram={diagram}
            compact
            className="mt-8 sm:hidden"
          />
        </>
      )}
      <p className="mt-6 leading-[1.9] text-ink-muted">{summary}</p>

      <ul className="mt-5 list-disc pl-5 space-y-2 leading-relaxed text-ink-muted marker:text-ink-subtle">
        {highlights.map(({ label }) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      {evidence && <EvidenceLog evidence={evidence} className="mt-8" />}

      <MetaLine project={project} className="mt-8" />
      <div className="mt-2">
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
