import { ArrowRight, Github } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "./ui/Button";
import { container } from "./ui/container";

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
    <section className="pt-10 sm:pt-16 pb-6 sm:pb-8" aria-labelledby="hero-heading">
      <div className={container}>
        {/* 誰か。名前は控えめにし、主役は「何をする人か」の見出しにする */}
        <p className="text-[15px] text-ink-muted mb-6">
          <span className="font-medium text-ink">{profile.name}</span>
          <span className="ml-2 text-ink-subtle">{profile.nameReading}</span>
          <br />
          <span className="inline-block">{profile.school}</span>{" "}
          <span className="inline-block">{profile.department}</span>{" "}
          <span className="inline-block">{profile.graduation}</span>
          <br />
          <span className="inline-block">{profile.aim}</span>
        </p>

        {/* 何をする人か。語の途中で折り返さないよう、意味の切れ目ごとに inline-block で区切る */}
        <h1
          id="hero-heading"
          className="text-[28px] leading-[1.35] sm:text-4xl sm:leading-[1.3] font-semibold tracking-[-0.02em] text-ink mb-5"
        >
          <span className="inline-block">AIを使う側から、</span>
          <span className="inline-block">仕組みと安全性を</span>
          <span className="inline-block">考える側へ。</span>
        </h1>

        <p className="text-[17px] leading-[1.8] text-ink-muted mb-6">
          生成AIをアプリに組み込むなかで、<span className="whitespace-nowrap">Prompt Injection</span> や Jailbreak といった
          AI特有のセキュリティ問題に
          {/*
            390px 幅で「関心を／持つように」と折り返さないよう文節をまとめる。
            auto-phrase は nowrap の直後で改行しないため、wbr で切れ目を明示する。
          */}
          <span className="whitespace-nowrap">関心を持つように</span>
          <wbr />
          なり、AI と作った音声エージェントで実際に{" "}
          <span className="whitespace-nowrap">Prompt Injection を</span>流して防御を検証しました。小さな作品は公開デモで、代表作はソースコードで確認できます。
        </p>

        {/* 導線。390px 幅でも最初の画面に収まるよう、説明文の直後に置く */}
        <div className="flex flex-wrap gap-3 mb-8">
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

        <div className="space-y-1">
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
