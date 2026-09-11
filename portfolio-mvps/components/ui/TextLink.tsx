import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * 文字だけのリンク。
 * py-2 は装飾ではなく、WCAG 2.2 のターゲットサイズ（24x24px）を満たすため。
 * 外すと高さ20pxになり基準を割る。
 */
const textLink = cva(
  "inline-flex items-center gap-1.5 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      tone: {
        accent: "text-brand-500 hover:text-brand-400",
        muted: "text-surface-400 hover:text-surface-200",
        subtle: "text-surface-500 hover:text-surface-200",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof textLink>;

export function TextLink({ tone, className, ...props }: TextLinkProps) {
  return <a className={cn(textLink({ tone }), className)} {...props} />;
}
