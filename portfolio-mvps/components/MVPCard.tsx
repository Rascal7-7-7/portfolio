import { ArrowRight, CheckCircle, Database } from "lucide-react";
import type { Highlight, Project } from "@/content/projects";

const highlightIcons = {
  check: CheckCircle,
  data: Database,
} satisfies Record<Highlight["type"], unknown>;

export function MVPCard({ project }: { project: Project }) {
  const { name, headline, summary, stack, highlights, duration, audience, links } =
    project;

  return (
    <article className="flex flex-col bg-surface-900 rounded-2xl p-6 hover:bg-surface-800/80 transition-colors group">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 text-xs text-surface-500">
        {duration && <span>開発期間 {duration}</span>}
        {duration && audience && <span>·</span>}
        {audience && <span>{audience}</span>}
      </div>

      {/* Value message — the headline */}
      <h3 className="text-lg font-bold text-surface-50 leading-snug mb-2">
        {headline}
      </h3>

      {/* Sub title */}
      <p className="text-xs text-surface-400 font-medium mb-3">{name}</p>

      {/* Description */}
      <p className="text-sm text-surface-300 leading-relaxed mb-5">{summary}</p>

      {/* Highlights */}
      <div className="flex flex-wrap gap-2 mb-5">
        {highlights.map(({ label, type }) => {
          const Icon = highlightIcons[type];
          return (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-600/15 text-brand-400 text-xs font-medium rounded-lg"
            >
              <Icon className="w-3 h-3" />
              {label}
            </span>
          );
        })}
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {stack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 bg-surface-800 text-surface-400 text-xs rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        {links.demo && (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
          >
            デモを見る
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-200 font-medium transition-colors"
          >
            設計・コードを見る
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
