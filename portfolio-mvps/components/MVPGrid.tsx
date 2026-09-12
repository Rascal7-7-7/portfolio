import { getProjectsByTier } from "@/content/projects";
import { MVPCard } from "./MVPCard";
import { SectionHeader } from "./ui/SectionHeader";

export function MVPGrid() {
  const featured = getProjectsByTier("featured");
  const standard = getProjectsByTier("standard");

  return (
    <section id="projects" className="py-24 px-6" aria-labelledby="projects-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="projects-heading"
          label="PROJECTS"
          title="作ったもの"
          description="関心のある領域で手を動かしたものと、個人で作った業務系Webアプリです。"
        />

        {/* Grid */}
        {/* 代表作は2カラムで大きく見せる */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {featured.map((project) => (
            <MVPCard key={project.slug} project={project} />
          ))}
        </div>

        <h3 className="text-surface-400 text-sm font-semibold mb-4">
          そのほかに作ったもの
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {standard.map((project) => (
            <MVPCard key={project.slug} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}
