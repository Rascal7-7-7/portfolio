import { ArrowRight, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 px-6 bg-surface-950">
      <div className="max-w-5xl mx-auto">
        {/* Final CTA */}
        <div className="bg-brand-600/10 rounded-3xl p-10 sm:p-14 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            業務の課題、一緒に整理しませんか。
          </h2>
          <p className="text-surface-400 mb-8 max-w-lg mx-auto">
            「何を依頼すればいいかわからない」状態でも大丈夫です。
            <br />
            まずヒアリングから始めます。
          </p>
          <a
            href="mailto:rascal.devops@gmail.com"
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl transition-colors text-lg"
          >
            無料で相談する
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-surface-800">
          <div>
            <p className="font-bold text-surface-200 text-sm mb-1">
              業務改善・MVP開発
            </p>
            <p className="text-surface-600 text-xs">
              フリーランスエンジニア
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Rascal7-7-7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-surface-500 hover:text-surface-200 text-sm transition-colors"
            >
              <Github className="w-4 h-4" />
              設計・コードを見る
            </a>
            <a
              href="mailto:rascal.devops@gmail.com"
              className="flex items-center gap-2 text-surface-500 hover:text-surface-200 text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              お問い合わせ
            </a>
          </div>
        </div>

        <p className="text-center text-surface-700 text-xs mt-8">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
