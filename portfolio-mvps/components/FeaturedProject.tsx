import type { Project } from "@/content/projects";
import { boundaryTerms } from "@/lib/projectText";
import { EvidenceLog } from "./EvidenceLog";
import { FlowDiagram } from "./FlowDiagram";
import { FlowRow } from "./FlowRow";
import { MetaLine, ProjectLinks, ProjectTitle } from "./ProjectMeta";
import { Phrase } from "./Phrase";
import { RichText } from "./RichText";

/**
 * 代表作。広い画面では 7:5 の 2 カラムにし、左に構成図と文章、右に根拠を図と同じ高さから置く。
 * 右の根拠は sticky にして、文章を読むあいだも横に見えるようにする。
 * 本文は RichText で複合語・英語の途中で折り返さないようにする。
 * 狭い画面では 1 カラムに戻し、構成図は縦に詰めた版を出す。
 */
export function FeaturedProject({ project }: { project: Project }) {
  const { slug, headline, summary, highlights, evidence, diagram } = project;
  const terms = boundaryTerms(project);

  return (
    <article className="reveal border-t border-rule py-12 sm:py-16">
      <ProjectTitle project={project} as="h3" className="text-2xl sm:text-[28px]" />
      <p className="mt-2 max-w-3xl text-[17px] sm:text-lg font-medium leading-relaxed text-ink">
        <Phrase text={headline} />
      </p>

      <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {diagram && (
            <div className="mb-8">
              <FlowRow id={`${slug}-row`} diagram={diagram} className="hidden sm:block" />
              <FlowDiagram id={`${slug}-compact`} diagram={diagram} compact className="sm:hidden" />
            </div>
          )}

          <p className="max-w-2xl leading-[1.9] text-ink-muted">
            <RichText text={summary} terms={terms} />
          </p>

          <ul className="mt-5 list-disc pl-5 space-y-2 leading-relaxed text-ink-muted marker:text-ink-subtle">
            {highlights.map(({ label }) => (
              <li key={label}>
                <RichText text={label} terms={[]} />
              </li>
            ))}
          </ul>

          <MetaLine project={project} className="mt-8" />
          <div className="mt-2">
            <ProjectLinks project={project} />
          </div>
        </div>

        {evidence && (
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <EvidenceLog evidence={evidence} />
          </div>
        )}
      </div>
    </article>
  );
}
