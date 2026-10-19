import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { getProjectsByTier, hasCaseStudy } from "@/content/projects";
import { Badge } from "./ui/Badge";
import { ButtonLink } from "./ui/Button";

export function Hero() {
  // 採用担当が最初の画面で「何を作った人か」まで辿れるよう、代表作を名前で並べる
  const featured = getProjectsByTier("featured").filter(hasCaseStudy);

  return (
    <section
      className="relative px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full">
        {/* 誰か */}
        {/* 名前は控えめにし、主役は「何をする人か」の見出しにする */}
        <p className="text-base font-medium text-surface-200 mb-1">
          {profile.name}
          <span className="ml-2 text-sm font-normal text-surface-400">
            {profile.nameReading}
          </span>
        </p>
        <p className="text-surface-400 text-sm mb-8 sm:mb-10">
          {profile.school} {profile.department} ／ {profile.activity}
        </p>

        {/* 何をする人か */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-[-0.03em] text-surface-50 mb-6 sm:mb-8"
        >
          {/* 語の途中で折り返さないよう、意味の切れ目ごとに inline-block で区切る */}
          <span className="inline-block">
            AIを<span className="text-brand-500">使う側</span>から、
          </span>
          <br />
          <span className="inline-block">
            <span className="text-brand-500">仕組みと安全性</span>を
          </span>
          <span className="inline-block">考える側へ。</span>
        </h1>

        <p className="text-base sm:text-lg text-surface-300 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
          生成AIをアプリに組み込むなかで、Prompt Injection や Jailbreak といった
          AI特有のセキュリティ問題に関心を持つようになりました。小さく作ったものは公開URLで触れる状態に、代表作はソースコードを公開しています。
        </p>

        {/* 代表作 */}
        {featured.length > 0 && (
          <div className="max-w-2xl mb-8 sm:mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-surface-400 mb-2">
              代表作
            </p>
            <ul className="divide-y divide-white/5 border-y border-white/5">
              {featured.map(({ slug, name, headline }) => (
                <li key={slug}>
                  <Link
                    href={`/projects/${slug}`}
                    className="group flex items-center gap-4 py-3 transition-colors"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-surface-50 group-hover:text-brand-400 transition-colors">
                        {name}
                      </span>
                      <span className="block text-sm text-surface-300">{headline}</span>
                    </span>
                    <ArrowRight
                      className="w-4 h-4 flex-shrink-0 text-surface-400 group-hover:text-brand-400 transition-colors"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 興味の方向 */}
        <ul className="flex flex-wrap gap-2 mb-10" aria-label="関心のある分野">
          {profile.interests.map(({ label, primary }) => (
            <li key={label}>
              <Badge variant={primary ? "highlight" : "tech"}>{label}</Badge>
            </li>
          ))}
        </ul>

        {/* 導線 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ButtonLink href="#projects" aria-label="作品を見る（作品セクションへ移動）">
            作品を見る
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            aria-label="GitHub を見る（新しいタブで開く）"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            GitHub
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
