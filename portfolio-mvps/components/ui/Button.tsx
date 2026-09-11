import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * 塗りつぶしのアクション。現状はすべてリンクとして使うため <a> を返す。
 *
 * primary の背景に brand-600 を使わないこと。白文字とのコントラストが
 * 4.1:1 で WCAG AA（4.5:1）に届かない。700 は 5.93:1。
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-brand-700 hover:bg-brand-800 text-white",
        secondary: "bg-surface-800 hover:bg-surface-700 text-surface-50",
      },
      size: {
        md: "px-8 py-4 text-base",
        lg: "px-10 py-4 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof button>;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <a className={cn(button({ variant, size }), className)} {...props} />;
}

export { button };
