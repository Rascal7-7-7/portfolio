import { getProjectsByTier } from "@/content/projects";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectRow } from "./ProjectRow";
import { SectionHeader } from "./ui/SectionHeader";
import { container } from "./ui/container";

export function MVPGrid() {
  const featured = getProjectsByTier("featured");
  const standard = getProjectsByTier("standard");

  return (
    <section id="projects" className="py-8 sm:py-10" aria-labelledby="projects-heading">
      <div className={container}>
        <SectionHeader
          id="projects-heading"
          title="作ったもの"
          description="関心のある領域で手を動かしたものと、個人で作った業務系Webアプリです。"
          className="mb-2"
        />

        {/* 代表作は一覧の行を少し大きくして見せる。罫線で区切り、カードにはしない */}
        <div>
          {featured.map((project) => (
            <FeaturedProject key={project.slug} project={project} />
          ))}
        </div>

        {/* ここからは流し読みできる密度の一覧にする */}
        <h3 className="mt-10 mb-1 text-base font-semibold text-ink">そのほかに作ったもの</h3>
        <ul className="border-b border-rule">
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
