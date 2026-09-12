import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import {
  getProjectBySlug,
  getProjectsWithCaseStudy,
  type Project,
} from "@/content/projects";
import { Badge } from "@/components/ui/Badge";
import { TextLink } from "@/components/ui/TextLink";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjectsWithCaseStudy().map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: `${project.name} | 制作の記録`,
    description: project.headline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | 制作の記録`,
      description: project.headline,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

/** 見出し付きの節。中身が無ければ何も描画しない。 */
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
    <section aria-labelledby={id} className="mb-14">
      <h2
        id={id}
        className="text-xl font-bold text-surface-50 mb-4 pb-2 border-b border-surface-800"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-surface-300 leading-relaxed mb-4 last:mb-0">{children}</p>
  );
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="text-surface-300 leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-brand-500"
        >
          {item}
        </li>
      ))}
    </ul>
  );
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
    toc.push({ id: "quality", label: "テストと運用" });
  if (project.learned?.length || project.futureWork?.length)
    toc.push({ id: "learned", label: "学んだこと" });
  return toc;
}

export default function ProjectDetail({ params }: { params: Params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const periodLabel = project.period.end
    ? `${project.period.start.replace("-", "/")}〜${project.period.end.replace("-", "/")}`
    : `${project.period.start.replace("-", "/")}〜`;
  const toc = buildToc(project);

  return (
    <main id="main" className="min-h-screen bg-surface-950 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <TextLink href="/#projects" tone="subtle" className="mb-8">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          作品一覧へ戻る
        </TextLink>

        {/* 見出し */}
        <p className="text-brand-500 text-sm font-semibold mb-3">
          {project.name}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-50 leading-snug mb-5">
          {project.headline}
        </h1>
        <p className="text-surface-300 leading-relaxed mb-6">{project.summary}</p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-surface-500 mb-6">
          <span>{periodLabel}</span>
          <span aria-hidden="true">·</span>
          <span>
            {project.team.kind === "team"
              ? `チーム開発（${project.team.members}人）`
              : "個人開発"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
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
              aria-label={`${project.name}のコードを見る（新しいタブで開く）`}
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              コードを見る
            </TextLink>
          )}
        </div>

        {/* 目次 */}
        {toc.length > 2 && (
          <nav
            aria-label="このページの目次"
            className="bg-surface-900 rounded-2xl p-5 mb-14"
          >
            <p className="text-surface-400 text-xs font-semibold mb-3">目次</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {toc.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-sm text-brand-500 hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* 背景と目的 */}
        {(project.problem || project.goal) && (
          <Section id="problem" title="背景と目的">
            {project.problem && <Paragraph>{project.problem}</Paragraph>}
            {project.goal && (
              <p className="text-surface-200 leading-relaxed border-l-2 border-brand-600 pl-4">
                {project.goal}
              </p>
            )}
          </Section>
        )}

        {/* 体制と構成 */}
        <Section id="role" title="体制と構成">
          <dl className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-surface-500 text-sm sm:w-32 shrink-0">体制</dt>
              <dd className="text-surface-300">
                {project.team.kind === "team"
                  ? `チーム開発（${project.team.members}人）`
                  : "個人開発"}
              </dd>
            </div>
            {project.team.kind === "team" && (
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-surface-500 text-sm sm:w-32 shrink-0">担当範囲</dt>
                <dd className="text-surface-300">{project.team.myRole}</dd>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-surface-500 text-sm sm:w-32 shrink-0">制作時期</dt>
              <dd className="text-surface-300">{periodLabel}</dd>
            </div>
            {project.architecture && (
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-surface-500 text-sm sm:w-32 shrink-0">構成</dt>
                <dd className="text-surface-300">{project.architecture}</dd>
              </div>
            )}
          </dl>
        </Section>

        {/* 主な機能 */}
        {project.features?.length ? (
          <Section id="features" title="主な機能">
            <List items={project.features} />
          </Section>
        ) : null}

        {/* 技術選定 */}
        {project.decisions?.length ? (
          <Section id="decisions" title="技術選定">
            <div className="space-y-6">
              {project.decisions.map(({ question, answer }) => (
                <div key={question}>
                  <h3 className="text-base font-bold text-surface-100 mb-2">
                    {question}
                  </h3>
                  <p className="text-surface-300 leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* 詰まった点と解決 */}
        {project.challenges?.length ? (
          <Section id="challenges" title="詰まった点と解決">
            <div className="space-y-8">
              {project.challenges.map((challenge) => (
                <div key={challenge.problem} className="bg-surface-900 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-surface-100 mb-4">
                    起きたこと
                  </h3>
                  <p className="text-surface-300 leading-relaxed mb-5">
                    {challenge.problem}
                  </p>

                  <h3 className="text-base font-bold text-surface-100 mb-2">
                    どう切り分けたか
                  </h3>
                  <p className="text-surface-300 leading-relaxed mb-5">
                    {challenge.investigation}
                  </p>

                  <h3 className="text-base font-bold text-surface-100 mb-2">
                    どう直したか
                  </h3>
                  <p className="text-surface-300 leading-relaxed">
                    {challenge.solution}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* セキュリティ */}
        {project.security?.length ? (
          <Section id="security" title="セキュリティ">
            <List items={project.security} />
          </Section>
        ) : null}

        {/* テストと運用 */}
        {project.testing || project.deployment || project.cicd ? (
          <Section id="quality" title="テストと運用">
            <dl className="space-y-3">
              {project.testing && (
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="text-surface-500 text-sm sm:w-32 shrink-0">テスト</dt>
                  <dd className="text-surface-300">{project.testing}</dd>
                </div>
              )}
              {project.deployment && (
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="text-surface-500 text-sm sm:w-32 shrink-0">動作環境</dt>
                  <dd className="text-surface-300">{project.deployment}</dd>
                </div>
              )}
              {project.cicd && (
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="text-surface-500 text-sm sm:w-32 shrink-0">CI/CD</dt>
                  <dd className="text-surface-300">{project.cicd}</dd>
                </div>
              )}
            </dl>
          </Section>
        ) : null}

        {/* 学んだこと */}
        {project.learned?.length || project.futureWork?.length ? (
          <Section id="learned" title="学んだこと">
            {project.learned?.length ? <List items={project.learned} /> : null}
            {project.futureWork?.length ? (
              <>
                <h3 className="text-base font-bold text-surface-100 mt-8 mb-3">
                  今なら変えること
                </h3>
                <List items={project.futureWork} />
              </>
            ) : null}
          </Section>
        ) : null}

        <div className="pt-4 border-t border-surface-800">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 py-2 text-sm text-surface-400 hover:text-surface-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            作品一覧へ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
