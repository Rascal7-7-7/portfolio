import { SectionHeader } from "./ui/SectionHeader";
import { container } from "./ui/container";

/*
 * 小見出し＋説明文を4つ並べる型をやめ、文章として段落に組む。
 * 本文の文言は変えていない（学んでいること→興味の方向は1つの流れとして同じ段落に置く）。
 * 学校・卒業予定・活動と「公開URL／ソースコード公開」の一文は Hero に書いてあるため、ここでは繰り返さない。
 */
const paragraphs = [
  [
    "生成AI・AIエージェント・ローカルLLMを、実際にアプリへ組み込みながら学んでいます。使ってみるだけでなく、組み込んだときに何が危ないのかを考えるようになりました。",
    "AI特有のセキュリティ問題（Prompt Injection や Jailbreak）に関心があります。あわせて、OSSの脆弱性調査やCVE、通信解析など、システムが内部でどう動いていて、どこに問題が起きうるのかを考えることに面白さを感じています。",
  ],
  [
    "ローカルで動かして終わりにせず、サーバー・Docker・データベース・ネットワークを組み合わせて動かしています。",
  ],
];

const closing =
  "ひとつの分野に限定せず、AI・セキュリティ・クラウド・ネットワークを組み合わせて扱えるエンジニアを目指しています。";

/** カードにも小見出しにもせず、文章として読ませる。 */
export function About() {
  return (
    <section id="about" className="py-8 sm:py-10" aria-labelledby="about-heading">
      <div className={container}>
        <SectionHeader id="about-heading" title="自己紹介" className="mb-2" />

        <div className="space-y-4 leading-[1.8] text-ink-muted">
          {paragraphs.map((sentences) => (
            <p key={sentences[0]}>{sentences.join("")}</p>
          ))}
          <p className="text-ink">{closing}</p>
        </div>
      </div>
    </section>
  );
}
