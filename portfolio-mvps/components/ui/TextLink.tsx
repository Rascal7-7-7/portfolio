import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * 文字だけのリンク。色に頼らずリンクと分かるよう、下線を常に引く。
 * py-2 は装飾ではなく、WCAG 2.2 のターゲットサイズ（24x24px）を満たすため。
 * 外すと高さ20pxになり基準を割る。
 */
const textLink = cva(
  "inline-flex items-center gap-1 py-2 text-[15px] font-medium underline decoration-1 underline-offset-4 transition-colors",
  {
    variants: {
      tone: {
        accent:
          "text-accent decoration-accent/40 hover:text-accent-hover hover:decoration-accent-hover",
        muted: "text-ink-muted decoration-ink-subtle/40 hover:text-ink hover:decoration-ink",
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

export { textLink };
