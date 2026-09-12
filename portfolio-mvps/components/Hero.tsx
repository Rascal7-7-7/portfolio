import { ArrowRight, Github } from "lucide-react";
import { profile } from "@/content/profile";
import { Badge } from "./ui/Badge";
import { ButtonLink } from "./ui/Button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative px-6 pt-24 pb-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto w-full">
        {/* 誰か */}
        <p className="text-surface-400 text-sm mb-3">
          {profile.school} {profile.department}
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-surface-50 mb-2">
          {profile.name}
          <span className="ml-3 text-sm font-normal text-surface-500">
            {profile.nameReading}
          </span>
        </p>
        <p className="text-surface-300 text-sm mb-10">
          {profile.status} ／ {profile.activity}
        </p>

        {/* 何をする人か */}
        <h1
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-surface-50 mb-6"
        >
          AIを<span className="text-brand-500">使う側</span>から、
          <br />
          <span className="text-brand-500">仕組みと安全性</span>を考える側へ。
        </h1>

        <p className="text-lg text-surface-200 max-w-2xl mb-4 leading-relaxed">
          生成AIやAIエージェントをアプリに組み込むなかで、Prompt Injection や
          Jailbreak といったAI特有のセキュリティ問題に関心を持つようになりました。
        </p>
        <p className="text-surface-400 max-w-2xl mb-10 leading-relaxed">
          いまは AI × セキュリティを軸に、クラウドやネットワークと組み合わせて学んでいます。
          作ったものは、動く状態で公開するところまでを習慣にしています。
        </p>

        {/* 興味の方向 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {profile.interests.map(({ label, primary }) => (
            <Badge
              key={label}
              variant={primary ? "highlight" : "tech"}
              className={primary ? "text-sm px-3 py-1.5" : "text-sm px-3 py-1.5"}
            >
              {label}
            </Badge>
          ))}
        </div>

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
