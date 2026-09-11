import { User, FileText, Zap } from "lucide-react";

const points = [
  {
    icon: User,
    title: "個人開発",
    desc: "要件定義・設計・実装・テストをすべて一人で担当。コミュニケーションコストが低く、仕様変更にも即対応できます。",
  },
  {
    icon: FileText,
    title: "要件定義〜実装まで対応",
    desc: "「何を作ればいいか」から一緒に考えます。発注側がシステムに詳しくなくても、業務の言葉で進められます。",
  },
  {
    icon: Zap,
    title: "短期間で構築",
    desc: "最短5日で動くシステムを提供。まず動かして検証する、MVP開発のアプローチで無駄な工数を省きます。",
  },
];

export function Trust() {
  return (
    <section className="py-24 px-6 bg-surface-900/40" aria-labelledby="trust-heading">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-brand-500 text-sm font-semibold mb-3">
            WHY CHOOSE
          </p>
          <h2 id="trust-heading" className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            選ばれる理由
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-surface-900 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-500" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-surface-50 mb-2">
                {title}
              </h3>
              <p className="text-sm text-surface-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
