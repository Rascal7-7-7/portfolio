import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  getNextProjectWithCaseStudy,
  getProjectBySlug,
  getProjectsWithCaseStudy,
  hasCaseStudy,
  type Project,
} from "@/content/projects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EvidenceLog } from "@/components/EvidenceLog";
import { FlowDiagram } from "@/components/FlowDiagram";
import { MetaLine, periodLabel, teamLabel } from "@/components/ProjectMeta";
import { RichText } from "@/components/RichText";
import { boundaryTerms } from "@/lib/projectText";
import { TextLink, textLink } from "@/components/ui/TextLink";
import { containerWide } from "@/components/ui/container";

type Params = { slug: string };

/**
 * generateStaticParams に無い slug は 404 にする。
 * 既定（true）のままだと、Case Study の無い作品でも中身の薄いページが
 * オンデマンドで生成されてしまう。
 */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getProjectsWithCaseStudy().map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project || !hasCaseStudy(project)) return {};

  return {
    title: `${project.name} | 制作の記録`,
    description: project.headline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | 制作の記録`,
      description: project.headline,
      url: `/projects/${project.slug}`,
      type: "article",
      // openGraph を書くと親（layout）の値が丸ごと置き換わるため、画像も明示する
      images: ["/opengraph-image.png"],
    },
  };
}

/** 見出し付きの節。上の罫線で区切り、カードや色帯は使わない。 */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-12 pt-8 border-t border-rule">
      <h2 id={id} className="text-xl font-semibold tracking-tight text-ink mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Paragraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("leading-[1.8] text-ink-muted mb-4 last:mb-0", className)}>{children}</p>
  );
}

function List({ items, terms }: { items: readonly string[]; terms: readonly string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2 leading-[1.8] text-ink-muted marker:text-ink-subtle">
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} terms={terms} />
        </li>
      ))}
    </ul>
  );
}

/** 「体制」「構成」などの項目と値の組。狭い画面では縦に積む。 */
function Facts({
  rows,
  terms,
}: {
  rows: readonly (readonly [string, string | undefined])[];
  terms: readonly string[];
}) {
  return (
    <dl className="space-y-3">
      {rows
        .filter((row): row is readonly [string, string] => Boolean(row[1]))
        .map(([label, value]) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="shrink-0 sm:w-28 text-sm leading-[1.8] text-ink-subtle">{label}</dt>
            <dd className="leading-[1.8] text-ink-muted">
              <RichText text={value} terms={terms} />
            </dd>
          </div>
        ))}
    </dl>
  );
}

/** テストしか書いていない作品に「運用」を名乗らせない。 */
function qualityTitle(project: Project): string {
  return project.deployment || project.cicd ? "テストと運用" : "テスト";
}

/** ページ内にどの節があるかは作品ごとに違うため、実在する節だけ目次に出す。 */
function buildToc(project: Project) {
  const toc: { id: string; label: string }[] = [];
  if (project.problem || project.goal) toc.push({ id: "problem", label: "背景と目的" });
  toc.push({ id: "role", label: "体制と構成" });
  if (project.features?.length) toc.push({ id: "features", label: "主な機能" });
  if (project.decisions?.length) toc.push({ id: "decisions", label: "技術選定" });
  if (project.challenges?.length) toc.push({ id: "challenges", label: "詰まった点と解決" });
  if (project.security?.length) toc.push({ id: "security", label: "セキュリティ" });
  if (project.testing || project.deployment || project.cicd)
    toc.push({ id: "quality", label: qualityTitle(project) });
  if (project.learned?.length || project.futureWork?.length)
    toc.push({ id: "learned", label: "学んだこと" });
  return toc;
}

export default function ProjectDetail({ params }: { params: Params }) {
  const project = getProjectBySlug(params.slug);
  // 読ませる内容が無い作品はページを持たない
  if (!project || !hasCaseStudy(project)) notFound();

  const period = periodLabel(project);
  const team = teamLabel(project);
  const toc = buildToc(project);
  // 図の信頼境界と同じ語を本文でも強調する（境界を持つ図の作品だけ）
  const terms = boundaryTerms(project);
  const rich = (text: string) => <RichText text={text} terms={terms} />;
  const next = getNextProjectWithCaseStudy(project.slug);

  return (
    <>
      <Header />
      <main id="main" className="pt-4 pb-16 sm:pt-8">
        {/* ヘッダーと左端を揃えたまま、本文は 1 行約 40 字（max-w-2xl）に抑える */}
        <div className={cn(containerWide, "[&>*]:max-w-2xl")}>
          <TextLink href="/#projects" className="text-sm mb-6">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            作品一覧へ戻る
          </TextLink>

          {/* 見出し */}
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <p className="text-[15px] font-medium text-ink-muted">{project.name}</p>
            <p className="shrink-0 font-mono text-[13px] text-ink-subtle">{period}</p>
          </div>
          <h1 className="text-[28px] leading-[1.4] sm:text-[34px] sm:leading-[1.35] font-semibold tracking-[-0.02em] text-ink mb-5">
            {project.headline}
          </h1>
          <Paragraph className="text-[17px]">{rich(project.summary)}</Paragraph>

          <MetaLine project={project} className="mt-5" />

          <div className="flex flex-wrap gap-x-5 mt-1">
            {project.links.demo && (
              <TextLink
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                tone="accent"
                aria-label={`${project.name}のデモを見る（新しいタブで開く）`}
              >
                デモを見る
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </TextLink>
            )}
            {project.links.github && (
              <TextLink
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                tone="accent"
                aria-label={`${project.name}のコードを見る（新しいタブで開く）`}
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                コードを見る
              </TextLink>
            )}
            {project.links.docs?.map(({ label, href }) => (
              <TextLink
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                tone="accent"
                aria-label={`${label}を見る（新しいタブで開く）`}
              >
                {label}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </TextLink>
            ))}
          </div>

          {/* 一覧の代表作と同じ根拠を、ここでも最初に見せる（画像の代わり） */}
          {project.evidence ? (
            <EvidenceLog evidence={project.evidence} className="mt-6" />
          ) : null}

          {/* 目次。カードにはせず、罫線の間に並べる */}
          {toc.length > 2 && (
            <nav aria-label="このページの目次" className="mt-10">
              <p className="text-sm text-ink-subtle mb-1">目次</p>
              <ol className="flex flex-wrap gap-x-5">
                {toc.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`} className={textLink({ tone: "muted" })}>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* 背景と目的。目的は色帯でなく、字の濃さと小見出しで区別する */}
          {(project.problem || project.goal) && (
            <Section id="problem" title="背景と目的">
              {project.problem && <Paragraph>{rich(project.problem)}</Paragraph>}
              {project.goal && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-ink mb-1">目的</p>
                  <p className="text-[17px] font-medium leading-[1.8] text-ink">{rich(project.goal)}</p>
                </div>
              )}
            </Section>
          )}

          {/* 体制と構成 */}
          <Section id="role" title="体制と構成">
            {project.diagram && (
              <FlowDiagram id={project.slug} diagram={project.diagram} className="mb-8" />
            )}
            <Facts
              terms={terms}
              rows={[
                ["体制", team],
                ["担当範囲", project.team.kind === "team" ? project.team.myRole : undefined],
                ["制作時期", period],
                ["構成", project.architecture],
              ]}
            />
          </Section>

          {/* 主な機能 */}
          {project.features?.length ? (
            <Section id="features" title="主な機能">
              <List items={project.features} terms={terms} />
            </Section>
          ) : null}

          {/* 技術選定 */}
          {project.decisions?.length ? (
            <Section id="decisions" title="技術選定">
              <div className="space-y-6">
                {project.decisions.map(({ question, answer }) => (
                  <div key={question}>
                    <h3 className="font-semibold text-ink mb-1">{question}</h3>
                    <Paragraph>{rich(answer)}</Paragraph>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {/* 詰まった点と解決。カードにはせず、件ごとに細い罫線で区切る */}
          {project.challenges?.length ? (
            <Section id="challenges" title="詰まった点と解決">
              <div className="divide-y divide-rule">
                {project.challenges.map((challenge) => (
                  <dl key={challenge.problem} className="py-5 first:pt-0 last:pb-0 space-y-4">
                    {(
                      [
                        ["起きたこと", challenge.problem],
                        ["どう切り分けたか", challenge.investigation],
                        ["どう直したか", challenge.solution],
                      ] as const
                    ).map(([label, text]) => (
                      <div key={label}>
                        <dt className="text-sm font-medium text-ink mb-1">{label}</dt>
                        <dd className="leading-[1.8] text-ink-muted">{rich(text)}</dd>
                      </div>
                    ))}
                  </dl>
                ))}
              </div>
            </Section>
          ) : null}

          {/* セキュリティ */}
          {project.security?.length ? (
            <Section id="security" title="セキュリティ">
              <List items={project.security} terms={terms} />
            </Section>
          ) : null}

          {/* テスト（動作環境・CI/CD があれば「テストと運用」） */}
          {project.testing || project.deployment || project.cicd ? (
            <Section id="quality" title={qualityTitle(project)}>
              {/* テストだけなら見出しと同じ語の項目名を重ねず、文章で置く */}
              {project.deployment || project.cicd ? (
                <Facts
                  terms={terms}
                  rows={[
                    ["テスト", project.testing],
                    ["動作環境", project.deployment],
                    ["CI/CD", project.cicd],
                  ]}
                />
              ) : (
                <Paragraph>{rich(project.testing ?? "")}</Paragraph>
              )}
            </Section>
          ) : null}

          {/* 学んだこと */}
          {project.learned?.length || project.futureWork?.length ? (
            <Section id="learned" title="学んだこと">
              {project.learned?.length ? <List items={project.learned} terms={terms} /> : null}
              {project.futureWork?.length ? (
                <>
                  <h3 className="font-semibold text-ink mt-8 mb-2">今後の課題</h3>
                  <List items={project.futureWork} terms={terms} />
                </>
              ) : null}
            </Section>
          ) : null}

          <div className="mt-12 pt-4 border-t border-rule flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <Link href="/#projects" className={cn(textLink({ tone: "muted" }), "text-sm")}>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              作品一覧へ戻る
            </Link>
            {next && (
              <Link
                href={`/projects/${next.slug}`}
                className={cn(textLink({ tone: "accent" }), "text-sm")}
              >
                <span className="whitespace-nowrap">次の制作の記録：{next.name}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
