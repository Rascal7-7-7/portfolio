import { owner } from "@/content/site";
import { cn } from "@/lib/cn";
import { container } from "./ui";

const nav = [
  { href: "#works", label: "作例" },
  { href: "#steps", label: "進め方" },
  { href: "#pricing", label: "料金" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className={cn(container, "flex h-16 items-center justify-between gap-4")}>
        <a href="#top" className="flex min-h-11 items-center font-bold">
          {owner.name}
        </a>
        <nav aria-label="ページ内のメニュー" className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 text-[15px] text-ink-muted sm:flex">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-11 items-center hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-black"
          >
            相談する
          </a>
        </nav>
      </div>
    </header>
  );
}
