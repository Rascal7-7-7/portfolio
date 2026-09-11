import { ArrowRight, CheckCircle, Database } from "lucide-react";

export type Effect = {
  label: string;
  type: "check" | "data";
};

export type MVPCardProps = {
  title: string;
  valueMessage: string;
  description: string;
  tags: string[];
  effects: Effect[];
  period: string;
  target: string;
  githubUrl?: string;
  demoUrl?: string;
};

const effectIcons = {
  check: CheckCircle,
  data: Database,
};

export function MVPCard({
  title,
  valueMessage,
  description,
  tags,
  effects,
  period,
  target,
  githubUrl,
  demoUrl,
}: MVPCardProps) {
  return (
    <article className="flex flex-col bg-surface-900 rounded-2xl p-6 hover:bg-surface-800/80 transition-colors group">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-4 text-xs text-surface-500">
        <span>開発期間 {period}</span>
        <span>·</span>
        <span>{target}</span>
      </div>

      {/* Value message — the headline */}
      <h3 className="text-lg font-bold text-surface-50 leading-snug mb-2">
        {valueMessage}
      </h3>

      {/* Sub title */}
      <p className="text-xs text-surface-400 font-medium mb-3">{title}</p>

      {/* Description */}
      <p className="text-sm text-surface-300 leading-relaxed mb-5">
        {description}
      </p>

      {/* Effects */}
      <div className="flex flex-wrap gap-2 mb-5">
        {effects.map(({ label, type }) => {
          const Icon = effectIcons[type];
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

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-surface-800 text-surface-400 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
          >
            デモを見る
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
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
