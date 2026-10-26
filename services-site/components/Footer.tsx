import { owner } from "@/content/site";
import { cn } from "@/lib/cn";
import { container } from "./ui";

export function Footer() {
  return (
    <footer className="bg-ink pb-10 text-white/70">
      <div className={cn(container, "flex flex-col gap-2 border-t border-white/15 pt-6 text-sm sm:flex-row sm:justify-between")}>
        <p>© {new Date().getFullYear()} {owner.name}</p>
        <p>作例の店名・人名・金額はすべて架空のものです。</p>
      </div>
    </footer>
  );
}
