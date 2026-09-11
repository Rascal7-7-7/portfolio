const steps = [
  {
    number: "01",
    title: "課題ヒアリング",
    desc: "現在の業務フローと困っていることを聞かせてください。システム化できるかどうかは、この段階で一緒に判断します。",
    duration: "30〜60分",
  },
  {
    number: "02",
    title: "業務整理",
    desc: "ヒアリング内容をもとに、業務の流れと非効率ポイントを整理。「どこから手をつけるべきか」を明確にします。",
    duration: "1〜2日",
  },
  {
    number: "03",
    title: "MVP設計",
    desc: "解決すべき課題に対して、最小限の機能構成を設計します。全部入りではなく、まず動くものを。",
    duration: "1〜2日",
  },
  {
    number: "04",
    title: "実装",
    desc: "設計をもとに実装します。進捗は随時共有し、方向性のズレが出たら早めに調整します。",
    duration: "3〜7日",
  },
  {
    number: "05",
    title: "改善",
    desc: "実際に使ってみたフィードバックをもとに調整。「使われるシステム」になるまで一緒に育てます。",
    duration: "継続対応",
  },
];

export function Process() {
  return (
    <section className="py-24 px-6" aria-labelledby="process-heading">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-brand-500 text-sm font-semibold mb-3">
            PROCESS
          </p>
          <h2 id="process-heading" className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            依頼から納品までの流れ
          </h2>
          <p className="text-surface-400 max-w-xl">
            相談から最短5日で動くシステムを届けます。
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-surface-800 hidden md:block" />

          <div className="flex flex-col gap-8">
            {steps.map(({ number, title, desc, duration }) => (
              <div key={number} className="flex gap-6 md:gap-8 items-start">
                {/* Number bubble */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center z-10 relative">
                    <span className="text-brand-500 text-xs font-bold font-mono">
                      {number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-surface-50">
                      {title}
                    </h3>
                    <span className="text-xs text-surface-500 bg-surface-800 px-2 py-0.5 rounded-md">
                      {duration}
                    </span>
                  </div>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
