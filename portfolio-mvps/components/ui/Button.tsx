import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * 塗りつぶしのアクション。現状はすべてリンクとして使うため <a> を返す。
 * primary は accent 地に白文字（7.4:1）。secondary は罫線だけで、地は塗らない。
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[15px] font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-accent hover:bg-accent-hover text-white",
        secondary: "border border-rule bg-paper hover:border-ink-subtle text-ink",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof button>;

export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <a className={cn(button({ variant }), className)} {...props} />;
}

export { button };
