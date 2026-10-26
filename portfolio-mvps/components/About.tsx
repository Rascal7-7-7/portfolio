import { Credentials } from "./Credentials";
import { Phrase } from "./Phrase";
import { SectionHeader } from "./ui/SectionHeader";
import { containerWide } from "./ui/container";

/*
 * 小見出し＋説明文を4つ並べる型をやめ、文章として段落に組む。
 * 本文の文言は変えていない（学んでいること→興味の方向は1つの流れとして同じ段落に置く）。
 * 学校・卒業予定・活動と「公開URL／ソースコード公開」の一文は Hero に書いてあるため、ここでは繰り返さない。
 */
const paragraphs = [
  [
    "生成AI・AIエージェント・ローカルLLMを、実際にアプリへ組み込みながら学んでいます。使ってみるだけでなく、組み込んだときに何が危ないのかを考えるようになりました。",
    "OSSの脆弱性を探して報告したこともあり、システムが内部でどう動いていて、どこに問題が起きうるのかを考えることに面白さを感じています。",
  ],
  [
    "いまチームで開発している進級制作では、Docker を使って開発しています。",
  ],
];

const closing =
  "ひとつの分野に限定せず、AI・セキュリティ・クラウド・ネットワークを組み合わせて扱えるエンジニアを目指しています。";

/** カードにも小見出しにもせず、文章として読ませる。 */
export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 border-t border-rule" aria-labelledby="about-heading">
      <div className={`${containerWide} grid gap-x-12 lg:grid-cols-12`}>
        <SectionHeader id="about-heading" title="自己紹介" className="lg:col-span-4" />

        <div className="reveal max-w-2xl space-y-6 leading-[1.9] text-ink-muted lg:col-span-8 lg:pt-3">
          {paragraphs.map((sentences) => (
            <p key={sentences[0]}>{sentences.join("")}</p>
          ))}
          <p className="text-ink">
            <Phrase text={closing} />
          </p>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <Credentials />
        </div>
      </div>
    </section>
  );
}
