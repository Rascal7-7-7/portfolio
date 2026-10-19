import { Check } from "lucide-react";
import type { Project } from "@/content/projects";
import { Badge } from "./ui/Badge";
import { ProjectLinks, metaLabel, periodLabel } from "./ProjectMeta";

/**
 * 代表作。全幅で、左に説明、右に根拠を置く。
 * スクリーンショットが揃うまでは、右側を等幅の「根拠ログ」で代える。
 */
export function FeaturedProject({ project }: { project: Project }) {
  const { name, headline, summary, stack, highlights, evidence } = project;

  return (
    <article className="grid grid-cols-1 md:grid-cols-5 gap-8 rounded-2xl bg-surface-900 ring-1 ring-white/5 p-6 sm:p-8">
      <div className="md:col-span-3 flex flex-col">
        <p className="font-mono text-xs text-surface-400 mb-4">
          {periodLabel(project)} · {metaLabel(project)}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-50 mb-3">
          {name}
        </h3>
        <p className="text-base text-surface-200 font-medium mb-4">{headline}</p>
        <p className="text-sm text-surface-300 leading-relaxed mb-5">{summary}</p>
        <ul className="space-y-1.5 mb-6">
          {highlights.map(({ label }) => (
            <li key={label} className="flex items-center gap-2 text-sm text-surface-200">
              <Check className="w-4 h-4 text-brand-400 flex-shrink-0" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {stack.map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="mt-auto">
          <ProjectLinks project={project} />
        </div>
      </div>

      {evidence && (
        <figure className="md:col-span-2 self-start rounded-xl bg-surface-950 ring-1 ring-white/5 p-5">
          <figcaption className="font-mono text-xs text-brand-400 mb-3">根拠</figcaption>
          <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-surface-300 whitespace-pre-wrap">
            {evidence.join("\n")}
          </pre>
        </figure>
      )}
    </article>
  );
}
