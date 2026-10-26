"use client";

import Link from "next/link";
import { actions } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/dates";
import { invoiceStatus } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { InvoiceStatusBadge } from "@/components/StatusBadge";
import { buttonStyles } from "@/components/ui";
import type { AppData, Invoice, ISODate } from "@/types";

interface InvoiceListProps {
  invoices: readonly Invoice[];
  data: AppData;
  today: ISODate;
  empty: string;
  /** 案件詳細の中では取引先・案件名を繰り返さず、請求番号を見出しにする */
  withProject?: boolean;
}

function dueText(invoice: Invoice, today: ISODate): string {
  if (invoice.draft) return `見積 ${invoice.estimateNo ?? ""} の承認待ち`;
  if (invoice.paidOn) return `入金 ${formatDate(invoice.paidOn)}`;
  return `期日 ${formatDate(invoice.dueOn)}（${formatRelative(today, invoice.dueOn)}）`;
}

export function InvoiceList({ invoices, data, today, empty, withProject = true }: InvoiceListProps) {
  if (invoices.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-warm-500">{empty}</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {invoices.map((inv) => {
        const project = data.projects.find((p) => p.id === inv.projectId);
        const status = invoiceStatus(inv, today);
        return (
          <li key={inv.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors hover:bg-warm-100/70 sm:flex-nowrap sm:px-5">
            {/* 行の左側から請求書の紙面を開く。請求番号に下線を引いてリンクだと分かるようにする */}
            <Link href={`/invoices/${inv.id}`} className="hit group min-w-0 flex-1 basis-full rounded sm:basis-auto">
              {withProject ? (
                <>
                  <p className="text-sm font-semibold break-words text-ink">{project?.client ?? "—"}</p>
                  <p className="text-xs break-words text-warm-500">{project?.name}</p>
                  <p className="num mt-0.5 text-xs text-warm-500">
                    <span className="text-ink underline decoration-rule underline-offset-2 group-hover:decoration-ink">{inv.number}</span> ・{" "}
                    <span className="whitespace-nowrap">{dueText(inv, today)}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="num text-sm font-medium text-ink underline decoration-rule underline-offset-2 group-hover:decoration-ink">{inv.number}</p>
                  <p className="num mt-0.5 text-xs text-warm-500">{dueText(inv, today)}</p>
                </>
              )}
            </Link>
            <div className="flex flex-1 items-center gap-3 sm:flex-none sm:flex-col sm:items-end sm:gap-1">
              <InvoiceStatusBadge status={status} />
              <p className="num ml-auto text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap text-ink sm:order-first sm:ml-0">
                {formatYen(inv.amount)}
              </p>
            </div>
            {/* 下書きは発行前なので入金を記録できない。列をそろえるため同じ幅の空きを置く */}
            {inv.draft ? (
              <span aria-hidden className="hidden w-24 shrink-0 sm:block" />
            ) : (
              <button
                type="button"
                onClick={() => actions.setInvoicePaid(inv.id, !inv.paidOn)}
                className={inv.paidOn ? buttonStyles.rowActionQuiet : buttonStyles.rowAction}
              >
                {inv.paidOn ? "入金を取消" : "入金済にする"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
