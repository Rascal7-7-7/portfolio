import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "./ui/Badge";
import { ButtonLink } from "./ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden" aria-labelledby="hero-heading">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto w-full">
        {/* Badge */}
        <Badge variant="pill" className="mb-8">
          <Zap className="w-3.5 h-3.5" aria-hidden="true" />
          小規模事業者・チーム向け　業務改善 &amp; MVP開発
        </Badge>

        {/* Main headline */}
        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-surface-50 mb-6">
          非効率な業務を、
          <br />
          <span className="text-brand-500">最短で「使えるシステム」</span>
          <br />
          に落とし込む。
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-surface-200 max-w-2xl mb-4 leading-relaxed">
          紙・Excel・LINEで回している業務を、実際に動くシステムへ。
          <br className="hidden sm:block" />
          課題ヒアリング〜設計〜実装まで、一人で対応します。
        </p>

        <p className="text-sm text-surface-400 mb-10">
          個人開発 / 要件定義〜実装まで対応 / 最短5日で構築
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ButtonLink href="#contact" aria-label="無料で相談する（お問い合わせセクションへ移動）">
            無料で相談する
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="#mvps" aria-label="MVP事例を見る（事例セクションへ移動）" variant="secondary">
            MVP事例を見る
          </ButtonLink>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="w-px h-10 bg-gradient-to-b from-surface-600 to-transparent" />
      </div>
    </section>
  );
}
