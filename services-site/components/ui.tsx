import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Phrase } from "./Phrase";

/** ページ全体で共有する幅と左右の余白。本文の段落はこの中で max-w-2xl（1 行およそ 40 字）に抑える */
export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "secondary" };

/** 主ボタンは墨色の塗り、副ボタンは輪郭だけ。押したときに少し沈む */
export function ButtonLink({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-[background-color,box-shadow,transform] duration-150 active:translate-y-px",
        variant === "primary"
          ? "bg-ink text-white hover:bg-black"
          : "bg-canvas text-ink shadow-card hover:shadow-shot",
        className,
      )}
      {...props}
    />
  );
}

/** 節の見出し。小さな見出し語（何の節か）と、言い切りの見出し、一文の説明 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-sm font-medium text-ink-subtle">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-[28px] font-bold leading-[1.3] sm:text-[40px] sm:leading-[1.2]">
        <Phrase text={title} />
      </h2>
      {description && (
        <p className="mt-4 text-[17px] leading-[1.9] text-ink-muted">
          <Phrase text={description} />
        </p>
      )}
    </div>
  );
}

export function Section({
  id,
  labelledBy,
  tone = "canvas",
  children,
}: {
  id: string;
  labelledBy: string;
  tone?: "canvas" | "soft";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-20 sm:py-28", tone === "soft" ? "bg-soft" : "bg-canvas")}
    >
      <div className={container}>{children}</div>
    </section>
  );
}
