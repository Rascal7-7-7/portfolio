import { profile } from "@/content/profile";

/**
 * トップと Case Study の両方で使う。
 * 行き先を "/#..." にしているのは、Case Study からもトップの各節へ戻れるようにするため。
 * トップ上では同一ドキュメント内の移動になり、再読み込みは起きない。
 */
const navItems = [
  { href: "/#projects", label: "作品" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "連絡先" },
];

export function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-700 focus:text-white"
      >
        メインコンテンツへスキップ
      </a>
      <header
        id="top"
        className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/85 backdrop-blur"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a
            href="/#top"
            className="font-bold text-surface-50 whitespace-nowrap"
            aria-label={`${profile.name} — トップページへ`}
          >
            {profile.name}
          </a>

          <nav aria-label="サイト内ナビゲーション">
            <ul className="flex items-center gap-1 sm:gap-4 text-sm">
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex items-center px-2 py-2 text-surface-300 hover:text-surface-50 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-2 text-surface-300 hover:text-surface-50 transition-colors"
                  aria-label="GitHub（新しいタブで開く）"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
