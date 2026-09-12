import { ArrowRight, CheckCircle, Database } from "lucide-react";
import Link from "next/link";
import { hasCaseStudy, type Highlight, type Project } from "@/content/projects";
import { Badge } from "./ui/Badge";
import { TextLink } from "./ui/TextLink";

const highlightIcons = {
  check: CheckCircle,
  data: Database,
} satisfies Record<Highlight["type"], unknown>;

export function MVPCard({ project }: { project: Project }) {
  const { name, headline, summary, stack, highlights, period, team, links } = project;

  const periodLabel = period.end
    ? `${period.start.replace("-", "/")}〜${period.end.replace("-", "/")}`
    : `${period.start.replace("-", "/")}〜`;
  const teamLabel =
    team.kind === "team" ? `チーム開発（${team.members}人）` : "個人開発";

  return (
    <article className="flex flex-col bg-surface-900 rounded-2xl p-6 hover:bg-surface-800/80 transition-colors group">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 text-xs text-surface-500">
        <span>{periodLabel}</span>
        <span aria-hidden="true">·</span>
        <span>{teamLabel}</span>
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
            <Badge key={label} variant="highlight">
              <Icon className="w-3 h-3" aria-hidden="true" />
              {label}
            </Badge>
          );
        })}
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {stack.map((tech) => (
          <Badge key={tech} variant="tech">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1">
        {hasCaseStudy(project) && (
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 py-2 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
            aria-label={`${name}の制作の記録を読む`}
          >
            制作の記録を読む
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </Link>
        )}
        {links.demo && (
          <TextLink
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            tone="accent"
            aria-label={`${name}のデモを見る（新しいタブで開く）`}
          >
            デモを見る
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </TextLink>
        )}
        {links.github && (
          <TextLink
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}の設計・コードを見る（新しいタブで開く）`}
          >
            設計・コードを見る
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </TextLink>
        )}
      </div>
    </article>
  );
}
