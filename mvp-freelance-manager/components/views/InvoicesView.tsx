"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { invoiceStatus, monthlyRevenue } from "@/lib/selectors";
import { formatMonthLabel } from "@/lib/dates";
import { cn, formatYen } from "@/lib/utils";
import { buttonStyles, Card, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoiceForm } from "@/components/InvoiceForm";
import { INVOICE_STATUS_LABEL, type InvoiceStatus } from "@/types";

type Filter = InvoiceStatus | "all";
const FILTERS: Filter[] = ["all", "overdue", "unpaid", "paid"];

export function InvoicesView() {
  const store = useAppStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const sorted = data.invoices.toSorted((a, b) => b.issuedOn.localeCompare(a.issuedOn));
  const visible = filter === "all" ? sorted : sorted.filter((inv) => invoiceStatus(inv, today) === filter);
  const total = (status: InvoiceStatus) =>
    data.invoices.filter((inv) => invoiceStatus(inv, today) === status).reduce((s, inv) => s + inv.amount, 0);
  const revenue = monthlyRevenue(data.invoices, today);

  return (
    <Page>
      <PageHeader
        eyebrow="Invoices"
        title="請求・入金"
        description="案件に紐づけて請求書を作成し、入金を記録します（デモのため実際の送付はしません）。"
        action={
          <button type="button" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm} className={buttonStyles.primary}>
            <Plus size={16} aria-hidden />
            請求書を作成
          </button>
        }
      />

      {showForm && (
        <Card title="新しい請求書" className="mb-5">
          <InvoiceForm projects={data.projects} today={today} onCreated={() => setShowForm(false)} />
        </Card>
      )}

      <dl className="mb-5 grid grid-cols-3 gap-3">
        {(["overdue", "unpaid", "paid"] as const).map((s) => (
          <div key={s} className="min-w-0 rounded-xl border border-line bg-canvas p-3 shadow-card sm:p-4">
            <dt className={cn("text-[11px] font-semibold sm:text-xs", s === "overdue" ? "text-orange" : "text-warm-500")}>
              {INVOICE_STATUS_LABEL[s]}
              {s === "paid" && "（累計）"}
            </dt>
            <dd className="num mt-1 truncate text-sm font-bold text-ink sm:text-xl">{formatYen(total(s))}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="状態で絞り込み">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === f ? "bg-ink text-white" : "bg-black/5 text-warm-500 hover:bg-black/10",
                )}
              >
                {f === "all" ? "すべて" : INVOICE_STATUS_LABEL[f]}
              </button>
            ))}
          </div>
          <Card>
            <InvoiceList invoices={visible} data={data} today={today} empty="該当する請求はありません" />
          </Card>
        </div>

        <Card title="月別の入金" className="self-start">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-warm-500">
                <th scope="col" className="px-5 py-2 font-semibold">月</th>
                <th scope="col" className="px-5 py-2 text-right font-semibold">入金</th>
                <th scope="col" className="px-5 py-2 text-right font-semibold">見込み</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {revenue.toReversed().map((m) => (
                <tr key={m.month}>
                  <th scope="row" className="px-5 py-2 text-left font-normal text-warm-500">
                    {formatMonthLabel(m.month)}
                  </th>
                  <td className="num px-5 py-2 text-right font-semibold text-ink">{formatYen(m.paid)}</td>
                  <td className="num px-5 py-2 text-right text-warm-500">{m.expected ? formatYen(m.expected) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Page>
  );
}
