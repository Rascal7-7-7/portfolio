import { ArrowRight } from "lucide-react";
import { projects } from "@/content/projects";
import { MVPCard } from "./MVPCard";

export function MVPGrid() {
  return (
    <section id="mvps" className="py-24 px-6" aria-labelledby="mvps-heading">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-brand-500 text-sm font-semibold mb-3">MVP CASES</p>
          <h2 id="mvps-heading" className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            実際に動く、業務改善の事例
          </h2>
          <p className="text-surface-400 max-w-xl">
            機能を作るのではなく、業務の課題を解くことを目的に設計しています。
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {projects.map((project) => (
            <MVPCard key={project.slug} project={project} />
          ))}
        </div>

        {/* Post-grid CTA */}
        <div className="bg-surface-900 rounded-2xl p-8 text-center">
          <p className="text-surface-300 text-lg font-medium mb-2">
            このような業務課題も解決できます
          </p>
          <p className="text-surface-500 text-sm mb-6">
            まずは気軽にご相談ください
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl transition-colors"
          >
            無料相談
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
