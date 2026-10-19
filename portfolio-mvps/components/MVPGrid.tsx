import { getProjectsByTier } from "@/content/projects";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectRow } from "./ProjectRow";
import { SectionHeader } from "./ui/SectionHeader";

export function MVPGrid() {
  const featured = getProjectsByTier("featured");
  const standard = getProjectsByTier("standard");

  return (
    <section id="projects" className="py-20 sm:py-32 px-6" aria-labelledby="projects-heading">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="projects-heading"
          label="PROJECTS"
          title="作ったもの"
          description="関心のある領域で手を動かしたものと、個人で作った業務系Webアプリです。"
        />

        {/* 代表作は全幅で1件ずつ見せる */}
        <div className="space-y-6 mb-16 sm:mb-20">
          {featured.map((project) => (
            <FeaturedProject key={project.slug} project={project} />
          ))}
        </div>

        <h3 className="font-mono text-xs uppercase tracking-widest text-surface-400 mb-2">
          そのほかに作ったもの
        </h3>
        <ul className="divide-y divide-white/5">
          {standard.map((project) => (
            <li key={project.slug}>
              <ProjectRow project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
