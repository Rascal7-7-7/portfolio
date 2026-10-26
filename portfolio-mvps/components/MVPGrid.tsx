import { getProjectsByTier } from "@/content/projects";
import { FeaturedProject } from "./FeaturedProject";
import { sharedMetaItems } from "@/lib/projectText";
import { MetaItems } from "./ProjectMeta";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./ui/SectionHeader";
import { containerWide } from "./ui/container";

export function MVPGrid() {
  const featured = getProjectsByTier("featured");
  const standard = getProjectsByTier("standard");

  return (
    <section id="projects" className="py-16 sm:py-24" aria-labelledby="projects-heading">
      <div className={containerWide}>
        <SectionHeader
          id="projects-heading"
          title="作ったもの"
          description="関心のある領域で手を動かしたものと、個人で作った業務系Webアプリです。"
          className="mb-4"
        />

        {/* 代表作。広い画面では文章と図を 2 カラムで見せる。罫線で区切り、カードにはしない */}
        <div>
          {featured.map((project) => (
            <FeaturedProject key={project.slug} project={project} />
          ))}
        </div>

        {/*
          ここからは代表作より控えめに、画面写真の帯 1 段で見せる。5本は同じ時期・同じ技術で作った連作なので、
          共通の制作時期・技術は説明側に1回だけ書き、各カードからは省く。
        */}
        <div className="border-t border-rule pt-12 sm:pt-16">
          <h3 className="text-xl font-semibold tracking-tight text-ink">
            小さな事業者向けの業務モックアップ（{standard.length}本の連作）
          </h3>
          <p className="mt-3 max-w-2xl leading-[1.9] text-ink-muted">
            {`集客・予約・見積・販売・請求の業務を、1本ずつ画面にしたモックアップです。${standard.length}本とも API やデータベースを使わずブラウザ内のダミーデータで動き、公開デモで操作できます。見積から受注・請求までがつながっていて、見積管理ツールで受注した見積から、フリーランス管理ツールの請求書へリンクで移れます（デモでは1件のみ連携）。予約管理システムは、フリーランス管理ツールの中では取引先から受けた開発案件として登場します。`}
          </p>
          <MetaItems items={sharedMetaItems(standard)} className="mt-3 mb-10" />
          {/* 狭い画面では縦に積むと長くなるため、横にスクロールする帯にする */}
          <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {standard.map((project) => (
              <li key={project.slug} className="flex w-[72vw] shrink-0 snap-start sm:w-auto">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
