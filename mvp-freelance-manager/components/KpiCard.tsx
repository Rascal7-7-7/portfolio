import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  href: string;
  label: string;
  value: string;
  icon: ReactNode;
  sub: ReactNode;
  tone?: "default" | "alert";
}

export function KpiCard({ href, label, value, icon, sub, tone = "default" }: KpiCardProps) {
  return (
    <Link
      href={href}
      className="group block min-w-0 rounded-xl border border-line bg-canvas p-4 shadow-card transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-semibold text-warm-500">{label}</p>
        <span className={cn(tone === "alert" ? "text-orange" : "text-warm-300")} aria-hidden>
          {icon}
        </span>
      </div>
      <p className="num mt-2 truncate text-xl font-bold text-ink sm:text-2xl">{value}</p>
      <p className={cn("mt-1 truncate text-xs", tone === "alert" ? "font-semibold text-orange" : "text-warm-500")}>
        {sub}
      </p>
    </Link>
  );
}
