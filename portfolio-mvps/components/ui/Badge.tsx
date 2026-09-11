import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** 短いラベル。用途ごとに見た目を変える。 */
const badge = cva("inline-flex items-center font-medium", {
  variants: {
    variant: {
      /** ページ冒頭の目印 */
      pill: "gap-2 px-3 py-1.5 rounded-full bg-brand-600/15 text-brand-500 text-sm",
      /** 作品の特徴 */
      highlight: "gap-1.5 px-2.5 py-1 rounded-lg bg-brand-600/15 text-brand-400 text-xs",
      /** 技術スタック */
      tech: "px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 text-xs font-normal",
    },
  },
  defaultVariants: { variant: "highlight" },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
