import { profile } from "@/content/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { container } from "./ui/container";

const blocks = [
  {
    title: "いま学んでいること",
    body: "生成AI・AIエージェント・ローカルLLMを、実際にアプリへ組み込みながら学んでいます。使ってみるだけでなく、組み込んだときに何が危ないのかを考えるようになりました。",
  },
  {
    title: "興味の方向",
    body: "AI特有のセキュリティ問題（Prompt Injection や Jailbreak）に関心があります。あわせて、OSSの脆弱性調査やCVE、通信解析など、システムが内部でどう動いていて、どこに問題が起きうるのかを考えることに面白さを感じています。",
  },
  {
    title: "作ったものは公開する",
    body: "ローカルで動かして終わりにせず、サーバー・Docker・データベース・ネットワークを組み合わせて動かしています。小さく作ったものは公開URLで触れる状態に、代表作はソースコードを公開しています。",
  },
  {
    title: "これから",
    body: "ひとつの分野に限定せず、AI・セキュリティ・クラウド・ネットワークを組み合わせて扱えるエンジニアを目指しています。",
  },
];

/** カードにはせず、小見出し付きの文章として縦に並べる。 */
export function About() {
  return (
    <section id="about" className="py-8 sm:py-10" aria-labelledby="about-heading">
      <div className={container}>
        <SectionHeader
          id="about-heading"
          title="自己紹介"
          description={`${profile.school} ${profile.department}。${profile.activity}。`}
        />

        <div className="space-y-6">
          {blocks.map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-1 leading-[1.8] text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
