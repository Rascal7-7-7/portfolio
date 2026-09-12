import { profile } from "@/content/profile";
import { SectionHeader } from "./ui/SectionHeader";

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
    body: "ローカルで動かして終わりにせず、サーバー・Docker・データベース・ネットワークを組み合わせて、実際にサービスとして動かすところまでを習慣にしています。",
  },
  {
    title: "これから",
    body: "ひとつの分野に限定せず、AI・セキュリティ・クラウド・ネットワークを組み合わせて扱えるエンジニアを目指しています。",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6 bg-surface-900/40" aria-labelledby="about-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="about-heading"
          label="ABOUT"
          title="自己紹介"
          description={`${profile.school} ${profile.department}。${profile.activity}。`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blocks.map(({ title, body }) => (
            <div key={title} className="bg-surface-900 rounded-2xl p-6">
              <h3 className="text-base font-bold text-surface-50 mb-2">{title}</h3>
              <p className="text-sm text-surface-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
