"use client";

import { actions } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/dates";
import { invoiceStatus } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { InvoiceStatusBadge } from "@/components/StatusBadge";
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
          <li key={inv.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-5">
            <div className="min-w-0 flex-1 basis-full sm:basis-auto">
              {withProject ? (
                <>
                  <p className="text-sm font-medium break-words text-ink">{project?.client ?? "—"}</p>
                  <p className="text-xs break-words text-warm-500">{project?.name}</p>
                  <p className="num mt-0.5 text-xs text-warm-500">
                    {inv.number} ・ <span className="whitespace-nowrap">{dueText(inv, today)}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="num text-sm font-medium text-ink">{inv.number}</p>
                  <p className="num mt-0.5 text-xs text-warm-500">{dueText(inv, today)}</p>
                </>
              )}
            </div>
            <div className="flex flex-1 items-center gap-3 sm:flex-none sm:flex-col sm:items-end sm:gap-1">
              <InvoiceStatusBadge status={status} />
              <p className="num ml-auto text-sm font-semibold whitespace-nowrap text-ink sm:order-first sm:ml-0">
                {formatYen(inv.amount)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => actions.setInvoicePaid(inv.id, !inv.paidOn)}
              className={
                inv.paidOn
                  ? "w-24 shrink-0 rounded-md px-2 py-1.5 text-xs text-warm-500 hover:bg-black/5"
                  : "w-24 shrink-0 rounded-md bg-black/5 px-2 py-1.5 text-xs font-semibold text-ink hover:bg-black/10"
              }
            >
              {inv.paidOn ? "入金を取消" : "入金済にする"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
