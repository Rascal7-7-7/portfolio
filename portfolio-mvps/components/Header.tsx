import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { container, containerWide } from "./ui/container";

/**
 * トップと Case Study の両方で使う。
 * 行き先を "/#..." にしているのは、Case Study からもトップの各節へ戻れるようにするため。
 * トップ上では同一ドキュメント内の移動になり、再読み込みは起きない。
 */
const navItems = [
  { href: "/#projects", label: "作品" },
  { href: "/#about", label: "自己紹介" },
  { href: "/#contact", label: "連絡先" },
];

const navLink =
  "inline-flex min-h-11 items-center px-1 text-ink-muted hover:text-ink transition-colors";

/** wide はトップページ用。本文の幅（containerWide）に左端を揃える */
export function Header({ wide = false }: { wide?: boolean }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-md focus:bg-accent focus:text-paper"
      >
        メインコンテンツへスキップ
      </a>
      <header id="top" className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-sm">
        {/* 幅と余白は本文と同じ container を使い、名前の左端を本文に揃える */}
        <div className={cn(wide ? containerWide : container, "h-16 flex items-center justify-between gap-3")}>
          <a
            href="/#top"
            className="font-semibold text-ink whitespace-nowrap"
            aria-label={`${profile.name} — トップページへ`}
          >
            {profile.name}
          </a>

          <nav aria-label="サイト内ナビゲーション">
            <ul className="flex items-center gap-3 sm:gap-5 text-[14px] sm:text-[15px]">
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={navLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
