import type { Summary } from "@/lib/calc";
import { formatYen } from "@/lib/utils";

interface Kpi {
  label: string;
  value: string;
  note: string;
}

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
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <li key={kpi.label} className="rounded-md bg-white p-4 shadow-card">
          <p className="text-xs font-medium text-muted">{kpi.label}</p>
          <p className="tnum mt-1 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
            {kpi.value}
          </p>
          <p className="mt-1 text-xs text-muted">{kpi.note}</p>
        </li>
      ))}
    </ul>
  );
}
