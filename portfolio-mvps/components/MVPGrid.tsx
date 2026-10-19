import { getProjectsByTier } from "@/content/projects";
import { FeaturedProject } from "./FeaturedProject";
import { sharedMetaItems } from "@/lib/projectText";
import { MetaItems } from "./ProjectMeta";
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

        {/*
          ここからは流し読みできる密度の一覧にする。5本は同じ時期・同じ技術で作った連作なので、
          共通の制作時期・技術は説明側に1回だけ書き、各行からは省く。
        */}
        <h3 className="mt-10 text-base font-semibold text-ink">
          小さな事業者向けの業務モックアップ（{standard.length}本の連作）
        </h3>
        <p className="mt-1 leading-[1.8] text-ink-muted">
          {`集客・予約・見積・販売・請求の業務を、1本ずつ画面にしたモックアップです。${standard.length}本とも API やデータベースを使わずブラウザ内のダミーデータで動き、公開デモで操作できます。見積から受注・請求までがつながっていて、見積管理ツールの `}
          {/* 見積番号はハイフンで折り返さない */}
          <span className="whitespace-nowrap">EST-0014</span>
          {` からフリーランス管理ツール（Hikae）の請求書へリンクで移れます。予約管理システムの店は Hikae の取引先でもあります。`}
        </p>
        <MetaItems items={sharedMetaItems(standard)} className="mt-2 mb-3" />
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
