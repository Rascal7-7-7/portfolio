"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { actions, useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/dates";
import { invoiceStatus } from "@/lib/selectors";
import { buttonStyles, Page, PageSkeleton } from "@/components/ui";
import { InvoiceStatusBadge } from "@/components/StatusBadge";
import { InvoiceDocument } from "@/components/InvoiceDocument";

export function InvoiceDetailView({ id }: { id: string }) {
  const store = useAppStore();
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const invoice = data.invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return (
      <Page>
        <p className="py-16 text-center text-sm text-warm-500">
          請求書が見つかりません。
          <Link href="/invoices" className="ml-1 text-blue hover:underline">
            請求一覧へ
          </Link>
        </p>
      </Page>
    );
  }
  const project = data.projects.find((p) => p.id === invoice.projectId);

  return (
    <Page>
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3 print:hidden">
          <Link href="/invoices" className="inline-flex items-center gap-1 text-xs text-warm-500 hover:text-ink">
            <ArrowLeft size={14} aria-hidden />
            請求一覧
          </Link>
          {project && (
            <Link href={`/projects/${project.id}`} className="min-w-0 truncate text-xs text-warm-500 hover:text-ink hover:underline">
              案件「{project.name}」
            </Link>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="flex items-center gap-3 text-sm">
            <InvoiceStatusBadge status={invoiceStatus(invoice, today)} />
            <span className="num text-xs text-warm-500">
              {invoice.paidOn ? `${formatDate(invoice.paidOn)} に入金` : `期日 ${formatDate(invoice.dueOn)}`}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => actions.setInvoicePaid(invoice.id, !invoice.paidOn)}
              className={buttonStyles.secondary}
            >
              {invoice.paidOn ? "入金を取消" : "入金済にする"}
            </button>
            <button type="button" onClick={() => window.print()} className={buttonStyles.primary}>
              <Printer size={16} aria-hidden />
              印刷
            </button>
          </div>
        </div>

        <InvoiceDocument invoice={invoice} project={project} />
        <p className="mt-3 text-xs text-warm-500 print:hidden">デモのため、実際の送付は行いません。</p>
      </div>
    </Page>
  );
}
