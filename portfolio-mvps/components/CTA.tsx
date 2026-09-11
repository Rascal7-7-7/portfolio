import { ArrowRight, MessageSquare, Layers } from "lucide-react";
import { ButtonLink } from "./ui/Button";

const services = [
  {
    icon: MessageSquare,
    label: "業務課題ヒアリング",
    desc: "どこに非効率があるか整理します",
  },
  {
    icon: Layers,
    label: "簡易提案",
    desc: "システム化の優先順位と構成を提示",
  },
  {
    icon: ArrowRight,
    label: "MVP開発",
    desc: "最短で動くものを作って検証",
  },
];

export function CTA() {
  return (
    <section id="contact" className="py-20 px-6 bg-brand-600/5" aria-labelledby="contact-heading">
      <div className="max-w-5xl mx-auto">
        {/* Service chips */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {services.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-3 px-5 py-4 bg-surface-900 rounded-2xl min-w-[200px] flex-1 max-w-[260px]"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-brand-500" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-surface-50 text-sm">{label}</p>
                <p className="text-surface-400 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA block */}
        <div className="bg-surface-900 rounded-3xl p-8 sm:p-12 text-center">
          <p className="text-surface-400 text-sm font-medium mb-3">
            まずは気軽に
          </p>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            業務の課題、聞かせてください。
          </h2>
          <p className="text-surface-300 mb-8 max-w-xl mx-auto">
            「システム化できるかわからない」で大丈夫です。
            <br />
            ヒアリングから一緒に整理します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink href="mailto:rascal.devops@gmail.com" aria-label="無料で相談する（メールを送る）" size="lg">
              無料で相談する
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#mvps" aria-label="MVP事例を見る（事例セクションへ移動）" variant="secondary" size="lg">
              MVP事例を見る
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
