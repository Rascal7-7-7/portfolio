import { projects } from "@/content/projects";
import { MVPCard } from "./MVPCard";
import { SectionHeader } from "./ui/SectionHeader";

export function MVPGrid() {
  return (
    <section id="projects" className="py-24 px-6" aria-labelledby="projects-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="projects-heading"
          label="PROJECTS"
          title="作ったもの"
          description="個人で開発した業務系Webアプリです。いずれも公開URLで実際に触れます。"
        />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <MVPCard key={project.slug} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}
