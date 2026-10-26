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
    <article className="reveal py-8 border-t border-rule">
      <ProjectTitle project={project} as="h3" className="text-xl sm:text-2xl" />
      <p className="mt-1 text-[17px] font-medium leading-relaxed text-ink">{headline}</p>

      {diagram && (
        <>
          <FlowRow id={`${slug}-row`} diagram={diagram} className="mt-5 hidden sm:block" />
          <FlowDiagram
            id={`${slug}-compact`}
            diagram={diagram}
            compact
            className="mt-5 sm:hidden"
          />
        </>
      )}
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
