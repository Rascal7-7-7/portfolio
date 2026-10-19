import type { Summary } from "@/lib/calc";
import { formatYen } from "@/lib/utils";

interface Kpi {
  label: string;
  value: string;
  note: string;
}

/** Stripe Dashboard の概要欄にならい、カードではなく罫線で区切った1本の帯で並べる */
export default function KpiCards({ summary }: { summary: Summary }) {
  const { count, pendingAmount, wonAmount, winRatePercent } = summary;
  const kpis: Kpi[] = [
    { label: "受注金額（税込）", value: formatYen(wonAmount), note: `受注 ${count.won} 件` },
    { label: "回答待ち（税込）", value: formatYen(pendingAmount), note: `送付済み ${count.sent} 件` },
    {
      label: "受注率",
      value: winRatePercent === null ? "—" : `${winRatePercent}%`,
      note: `受注 ${count.won} / 決着 ${count.won + count.lost} 件`,
    },
    { label: "下書き", value: `${count.draft} 件`, note: "送付前の見積" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white px-4 py-4">
          <dt className="text-xs text-muted">{kpi.label}</dt>
          <dd className="tnum mt-1 text-xl font-semibold text-navy sm:text-2xl">{kpi.value}</dd>
          <dd className="tnum mt-0.5 text-xs text-muted">{kpi.note}</dd>
        </div>
      ))}
    </dl>
  );
}
