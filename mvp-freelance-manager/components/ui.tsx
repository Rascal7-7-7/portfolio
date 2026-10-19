import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, icon, action, className, children }: CardProps) {
  return (
    <section
      className={cn("min-w-0 rounded-xl border border-line bg-canvas shadow-card", className)}
      aria-label={title}
    >
      {title && (
        <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
            <span className="text-warm-300" aria-hidden>
              {icon}
            </span>
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-0.5 text-xs font-medium text-blue hover:underline"
    >
      {children}
      <ChevronRight size={14} aria-hidden />
    </Link>
  );
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold text-warm-300">{eyebrow}</p>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-warm-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Page({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return (
    <main className={cn("mx-auto w-full px-4 py-6 sm:px-6 sm:py-8", narrow ? "max-w-4xl" : "max-w-6xl")}>
      {children}
    </main>
  );
}

export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-md bg-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-active disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-1.5 rounded-md bg-black/5 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-black/10",
  input:
    "w-full rounded-md border border-[#dddddd] bg-canvas px-3 py-2 text-sm text-ink placeholder:text-warm-300 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue-tint",
} as const;

export function PageSkeleton() {
  return (
    <Page>
      <div className="animate-pulse space-y-4" aria-busy="true" aria-label="読み込み中">
        <div className="h-8 w-48 rounded bg-warm-200" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-warm-100" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-warm-100" />
      </div>
    </Page>
  );
}
