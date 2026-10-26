import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * 塗りつぶしのアクション。現状はすべてリンクとして使うため <a> を返す。
 * primary は ink（ほぼ白）地に paper（黒）文字（17.0:1）。secondary は罫線だけで、地は塗らない。
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[15px] font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-ink hover:bg-white text-paper",
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
