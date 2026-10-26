import { ArrowRight, Github } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "./ui/Button";
import { HeroScene } from "./HeroScene";
import { container } from "./ui/container";
import { cn } from "@/lib/cn";

/** 関心のある分野。色分けのチップにせず、優先順のまま1行の文で並べる。 */
function Interests() {
  return (
    <p className="text-[15px] text-ink-muted">
      <span className="text-ink-subtle">関心のある分野：</span>
      {profile.interests.map(({ label, primary }, i) => (
        <span key={label} className="inline-block">
          {/* 上位の関心だけ字の太さで示す（色は増やさない） */}
          <span className={primary ? "font-medium text-ink" : undefined}>{label}</span>
          {i < profile.interests.length - 1 && <span aria-hidden="true">、</span>}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 sm:pb-28" aria-labelledby="hero-heading">
      {/*
        上部の 3D の舞台。WebGL が使えない環境や読み込み前は、背後の方眼と光だけが見える。
        見出しは舞台の下端に少し重ねて置く。
      */}
      <div className="blueprint absolute inset-x-0 top-0 h-[52svh] sm:h-[60svh]" aria-hidden="true" />
      <div className="hero-glow absolute inset-x-0 top-0 h-[52svh] sm:h-[60svh]" aria-hidden="true" />
      <HeroScene className="absolute inset-x-0 top-0 h-[52svh] sm:h-[60svh]" />

      <div className={cn(container, "relative pt-[42svh] sm:pt-[46svh]")}>
        {/* 誰か。名前は控えめにし、主役は「何をする人か」の見出しにする。項目ごとに行を分け、途中で折り返さない */}
        <div className="hero-in mb-6 text-[15px] leading-[1.7]">
          <p>
            <span className="font-medium text-ink">{profile.name}</span>
            <span className="ml-2 text-ink-subtle">{profile.nameReading}</span>
          </p>
          <p className="text-ink-muted">{profile.aim}</p>
          <p className="text-ink-subtle">
            <span className="inline-block">{profile.school}</span>{" "}
            <span className="inline-block">{profile.department}</span>{" "}
            <span className="inline-block">{profile.graduation}</span>
          </p>
        </div>

        {/* 何をする人か。語の途中で折り返さないよう、意味の切れ目ごとに inline-block で区切る */}
        <h1
          id="hero-heading"
          className="hero-in [animation-delay:120ms] text-[32px] leading-[1.3] sm:text-[56px] sm:leading-[1.15] font-semibold tracking-[-0.03em] text-ink mb-6"
        >
          <span className="inline-block">AIを使う側から、</span>
          <span className="inline-block">仕組みと安全性を</span>
          <span className="inline-block">考える側へ。</span>
        </h1>

        {/* 導線。上に 3D の舞台があっても 390px 幅の最初の画面に収まるよう、見出しの直後に置く */}
        <div className="hero-in [animation-delay:240ms] flex flex-wrap gap-3 mb-8">
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

        <p className="hero-in [animation-delay:360ms] mb-5 text-[17px] leading-[1.9] text-ink-muted">
          生成AIをアプリに組み込むなかで、Prompt Injection や Jailbreak といったAI特有のセキュリティ問題に関心を持つようになり、AI と作った音声エージェントで実際に Prompt Injection を流して防御を検証しました。小さな作品は公開デモで、代表作はソースコードで確認できます。
        </p>

        {/* 上の 3D が何を表しているか。色の意味を一度だけ言葉で示す */}
        <div className="hero-in [animation-delay:480ms] mb-10 text-sm leading-[1.8] text-ink-subtle">
          <p>上の図は、代表作 JARVIS の設計を表したものです。</p>
          <ul>
            <li>
              <span className="mr-2 inline-block size-2 rounded-full bg-accent align-middle" aria-hidden="true" />
              通常の入力は、中心の LLM まで届く
            </li>
            <li>
              <span className="mr-2 inline-block size-2 rounded-full bg-danger align-middle" aria-hidden="true" />
              注入された命令は、手前のポリシー層で止まる
            </li>
          </ul>
        </div>

        <div className="hero-in [animation-delay:600ms] space-y-1.5 border-t border-rule pt-6">
          <Interests />
          <p className="text-[15px] text-ink-subtle">{profile.activity}</p>
          <p className="text-[15px] text-ink-subtle">
            {profile.certifications.map((part) => (
              <span key={part} className="inline-block">{part}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
