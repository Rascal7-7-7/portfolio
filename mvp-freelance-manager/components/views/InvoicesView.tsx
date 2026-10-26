"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { invoiceStatus, monthlyRevenue, sortInvoices } from "@/lib/selectors";
import { formatMonthLabel } from "@/lib/dates";
import { formatYen } from "@/lib/utils";
import { buttonStyles, Card, MetricStrip, Page, PageHeader, PageSkeleton, SegmentButton } from "@/components/ui";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoiceForm } from "@/components/InvoiceForm";
import { INVOICE_STATUS_LABEL, type InvoiceStatus } from "@/types";

/** 「未入金」は期限超過を含み、下書き（見積の承認待ち）は含まない（ダッシュボードと同じ定義）。期限超過はその内訳 */
type Filter = "all" | "outstanding" | "overdue" | "paid";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "outstanding", label: "未入金" },
  { key: "overdue", label: "うち期限超過" },
  { key: "paid", label: INVOICE_STATUS_LABEL.paid },
];
const matches = (filter: Filter, status: InvoiceStatus): boolean =>
  filter === "all" || (filter === "outstanding" ? status === "unpaid" || status === "overdue" : status === filter);

export function InvoicesView() {
  const store = useAppStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const sorted = sortInvoices(data.invoices, today);
  const visible = sorted.filter((inv) => matches(filter, invoiceStatus(inv, today)));
  const total = (f: Filter) =>
    data.invoices.filter((inv) => matches(f, invoiceStatus(inv, today))).reduce((s, inv) => s + inv.amount, 0);
  const overdueTotal = total("overdue");
  const revenue = monthlyRevenue(data.invoices, today);

  return (
    <Page>
      <PageHeader
        title="請求・入金"
        description="案件に紐づけて請求書を作成し、入金を記録します（デモのため実際の送付はしません）。"
        action={
          // 開いている間はフォーム内の「この内容で作成」を主ボタンにし、こちらは閉じる操作に下げる
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            aria-expanded={showForm}
            className={showForm ? buttonStyles.secondary : buttonStyles.primary}
          >
            {showForm ? "閉じる" : (
              <>
                <Plus size={16} aria-hidden />
                請求書を作成
              </>
            )}
          </button>
        }
      />

      {showForm && (
        <Card title="新しい請求書" className="mb-6">
          <InvoiceForm projects={data.projects} invoices={data.invoices} today={today} onCreated={() => setShowForm(false)} />
        </Card>
      )}

      <MetricStrip
        className="mb-6"
        items={[
          {
            label: "未入金",
            value: total("outstanding"),
            sub: overdueTotal > 0 ? <span className="font-semibold text-shu">うち期限超過 {formatYen(overdueTotal)}</span> : undefined,
          },
          { label: "入金済（累計）", value: total("paid") },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <div className="mb-2 flex gap-1 overflow-x-auto pb-1" role="group" aria-label="状態で絞り込み">
            {FILTERS.map(({ key: f, label }) => (
              <SegmentButton key={f} active={filter === f} onClick={() => setFilter(f)}>
                {label}
              </SegmentButton>
            ))}
          </div>
          <Card>
            <InvoiceList invoices={visible} data={data} today={today} empty="該当する請求はありません" />
          </Card>
        </div>

        <Card title="月別の入金" className="self-start">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-warm-500">
                <th scope="col" className="px-5 py-2 font-normal">月</th>
                <th scope="col" className="px-5 py-2 text-right font-normal">入金</th>
                <th scope="col" className="px-5 py-2 text-right font-normal">見込み</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {revenue.toReversed().map((m) => (
                <tr key={m.month}>
                  <th scope="row" className="num px-5 py-2.5 text-left font-normal text-warm-500">
                    {formatMonthLabel(m.month)}
                  </th>
                  <td className="num px-5 py-2.5 text-right font-semibold text-ink">{formatYen(m.paid)}</td>
                  <td className="num px-5 py-2.5 text-right text-warm-500">{m.expected ? formatYen(m.expected) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Page>
  );
}
