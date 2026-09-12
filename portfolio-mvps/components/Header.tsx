import { profile } from "@/content/profile";

const navItems = [
  { href: "#projects", label: "作品" },
  { href: "#approach", label: "考え方" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "連絡先" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-800/60 bg-surface-950/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a
          href="#top"
          className="font-bold text-surface-50 whitespace-nowrap"
          aria-label={`${profile.name} — ページ先頭へ`}
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
  );
}
