import { Search, Layout, Code2 } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";

const steps = [
  {
    icon: Search,
    title: "業務を理解する",
    desc: "まず「どんな手順で、誰が、何をやっているか」を整理します。システムを提案するのではなく、業務の非効率を特定することが出発点です。",
  },
  {
    icon: Layout,
    title: "解くべき課題を設計する",
    desc: "課題が明確になったら、最小限の機能で解決できる構成を設計します。「全部入り」ではなく「必要なものだけ」の設計が、使われるシステムを生みます。",
  },
  {
    icon: Code2,
    title: "動くものとして実装する",
    desc: "設計の意図を損なわずに実装します。技術の見せ方ではなく、業務担当者が迷わず使えるUIと導線を最優先にします。",
  },
];

export function Why() {
  return (
    <section id="approach" className="py-24 px-6" aria-labelledby="why-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="why-heading"
          label="APPROACH"
          title="開発で大事にしていること"
          description="動くものを作るだけでなく、なぜそう作ったかを説明できる状態にしておきたいと考えています。"
          className="mb-16"
        />

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-500" aria-hidden="true" />
                </div>
                <span className="text-surface-600 text-sm font-mono">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-surface-50 mb-3">{title}</h3>
              <p className="text-surface-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Emphasis */}
        <div className="mt-16 py-8 px-8 bg-surface-900 rounded-2xl">
          <p className="text-surface-200 text-lg font-medium leading-relaxed text-center max-w-2xl mx-auto">
            「技術で何ができるか」ではなく、
            <span className="text-brand-400">「業務で何が困っているか」</span>
            から考えます。
          </p>
        </div>
      </div>
    </section>
  );
}
