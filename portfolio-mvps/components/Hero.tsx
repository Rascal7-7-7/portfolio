import { ArrowRight, Github } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "./ui/Button";
import { HeroScene } from "./HeroScene";
import { Phrase } from "./Phrase";
import { containerWide } from "./ui/container";
import { cn } from "@/lib/cn";

/** 関心のある分野。色分けのチップにせず、優先順のまま1行の文で並べる。項目名は経歴の dt に置く。 */
function Interests() {
  return (
    <p className="text-ink-muted">
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
    <section className="relative overflow-hidden pb-12 sm:pb-16" aria-labelledby="hero-heading">
      {/*
        上部の 3D の舞台。WebGL が使えない環境や読み込み前は、背後の方眼と光だけが見える。
        見出しは舞台の下端に少し重ねて置く。
      */}
      <div className="blueprint absolute inset-x-0 top-0 h-[52svh] sm:h-[54svh]" aria-hidden="true" />
      <div className="hero-glow absolute inset-x-0 top-0 h-[52svh] sm:h-[54svh]" aria-hidden="true" />
      <HeroScene className="absolute inset-x-0 top-0 h-[52svh] sm:h-[54svh]" />

      {/* 広い画面では左に「誰か・何をする人か・導線」、右に図の凡例と経歴を置く */}
      <div className={cn(containerWide, "relative grid gap-x-16 pt-[42svh] sm:pt-[44svh] lg:grid-cols-12")}>
        <div className="lg:col-span-7">
          {/* 誰か。名前は控えめにし、主役は「何をする人か」の見出しにする。項目ごとに行を分け、途中で折り返さない */}
          <div className="hero-in mb-5 text-[15px] leading-[1.7]">
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
            className="hero-in [animation-delay:120ms] text-[34px] leading-[1.25] sm:text-[52px] lg:text-[64px] sm:leading-[1.12] font-bold tracking-[-0.01em] text-ink mb-8"
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

          <p className="hero-in [animation-delay:360ms] max-w-2xl text-[17px] leading-[1.9] text-ink-muted">
            生成AIをアプリに組み込むなかで、Prompt Injection や Jailbreak といったAI特有のセキュリティ問題に関心を持つようになり、AI と作った音声エージェントで実際に Prompt Injection を流して防御を検証しました。小さな作品は公開デモで、代表作はソースコードで確認できます。
          </p>
        </div>

        <div className="mt-10 space-y-8 lg:col-span-5 lg:mt-[6.5rem]">
          {/* 上の 3D が何を表しているか。色の意味と、図の限界を言葉で示す */}
          <div className="hero-in [animation-delay:480ms] text-sm leading-[1.8] text-ink-subtle">
            <p className="text-ink-muted">
              <Phrase text="上の図は、代表作 JARVIS の構成を立体にした図解です（割合は計測値ではありません）。" />
            </p>
            <ul className="mt-2 space-y-0.5">
              <li className="flex">
                <span className="mr-2 inline-block size-2 shrink-0 translate-y-[0.55em] rounded-full bg-accent" aria-hidden="true" />
                <Phrase text="通常の発話は、実行まで届く" />
              </li>
              <li className="flex">
                <span className="mr-2 inline-block size-2 shrink-0 translate-y-[0.55em] rounded-full bg-danger" aria-hidden="true" />
                <Phrase text="危険な発話は、前段のポリシー層（発話のキーワード照合）で止まる" />
              </li>
              <li className="flex">
                <span className="mr-2 inline-block size-2 shrink-0 translate-y-[0.55em] rounded-full bg-caution" aria-hidden="true" />
                <Phrase text="言い換えた危険な発話は前段をすり抜けうるため、後段のポリシー層（コマンドの拒否リスト）で止める" />
              </li>
              <li className="flex">
                {/* 止まる赤（塗り）と区別できるよう、届いてしまうものは中抜きの輪にする */}
                <span className="mr-2 inline-block size-2 shrink-0 translate-y-[0.55em] rounded-full border-[1.5px] border-danger" aria-hidden="true" />
                <Phrase text="難読化された発話は、どちらにもかからず実行まで届くことがある" />
              </li>
            </ul>
          </div>

          {/* 経歴。項目名と中身の 2 列にする */}
          <dl className="hero-in [animation-delay:600ms] grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-rule pt-6 text-[15px] leading-[1.7]">
            <dt className="text-ink-subtle">関心</dt>
            <dd><Interests /></dd>
            <dt className="text-ink-subtle">報告</dt>
            <dd className="text-ink-muted">
              <Phrase text={profile.disclosure} />
            </dd>
            <dt className="text-ink-subtle">活動</dt>
            <dd className="text-ink-muted">
              <Phrase text={profile.activity} />
            </dd>
            <dt className="text-ink-subtle">資格</dt>
            <dd className="text-ink-muted">
              {profile.certifications.map((part) => (
                <span key={part} className="inline-block">{part}</span>
              ))}
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
