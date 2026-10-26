import type { Project } from "@/content/projects";
import { EvidenceLog } from "./EvidenceLog";
import { FlowDiagram } from "./FlowDiagram";
import { FlowRow } from "./FlowRow";
import { MetaLine, ProjectLinks, ProjectTitle } from "./ProjectMeta";

/**
 * 代表作。広い画面では左に文章、右に構成図と根拠を置く 2 カラム（5:7）。
 * 左の文章は sticky にし、右の図と根拠を読み進めるあいだも作品名と導線が見えるようにする。
 * 狭い画面では 1 カラムに戻し、構成図は縦に詰めた版を出す。
 */
export function FeaturedProject({ project }: { project: Project }) {
  const { slug, headline, summary, highlights, evidence, diagram } = project;

  return (
    <article className="reveal grid gap-x-12 gap-y-8 border-t border-rule py-12 sm:py-16 lg:grid-cols-12">
      <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
        <ProjectTitle project={project} as="h3" className="text-2xl sm:text-[28px]" />
        <p className="phrase mt-2 text-[17px] sm:text-lg font-medium leading-relaxed text-ink">{headline}</p>
        <p className="mt-6 leading-[1.9] text-ink-muted">{summary}</p>

        <ul className="mt-5 list-disc pl-5 space-y-2 leading-relaxed text-ink-muted marker:text-ink-subtle">
          {highlights.map(({ label }) => (
            <li key={label}>{label}</li>
          ))}
        </ul>

        <MetaLine project={project} className="mt-8" />
        <div className="mt-2">
          <ProjectLinks project={project} />
        </div>
      </div>

      {(diagram || evidence) && (
        <div className="lg:col-span-7 space-y-8">
          {diagram && (
            <>
              <FlowRow id={`${slug}-row`} diagram={diagram} className="hidden sm:block" />
              <FlowDiagram id={`${slug}-compact`} diagram={diagram} compact className="sm:hidden" />
            </>
          )}
          {evidence && <EvidenceLog evidence={evidence} />}
        </div>
      )}
    </article>
  );
}
