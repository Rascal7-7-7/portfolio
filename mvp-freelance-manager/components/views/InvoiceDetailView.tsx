"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { actions, useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/dates";
import { invoiceStatus } from "@/lib/selectors";
import { buttonStyles, Page, PageSkeleton } from "@/components/ui";
import { InvoiceStatusBadge } from "@/components/StatusBadge";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { ExternalLink } from "@/components/ExternalLink";
import { ESTIMATE_INVOICE_ID } from "@/lib/seed";
import { estimateUrl } from "@/lib/utils";

/** 見積管理で承認すると /invoices/est-0014?from=approved へ飛んでくる。その時だけ下書きを発行済みにする */
function useApprovedFromEstimate(id: string): void {
  useEffect(() => {
    if (id === ESTIMATE_INVOICE_ID && new URLSearchParams(window.location.search).get("from") === "approved") {
      actions.approveEstimateInvoice();
    }
  }, [id]);
}

export function InvoiceDetailView({ id }: { id: string }) {
  const store = useAppStore();
  useApprovedFromEstimate(id);
  const number = store?.data.invoices.find((inv) => inv.id === id)?.number;
  // 請求はブラウザ内にしかないため metadata では番号を出せない。読み込めたらタブ名に番号を入れる
  useEffect(() => {
    if (number) document.title = `${number} | Hikae`;
  }, [number]);
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const invoice = data.invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return (
      <Page>
        <h1 className="py-16 text-center text-sm font-normal text-warm-500">
          請求書が見つかりません。
          <Link href="/invoices" className="ml-1 text-blue underline">
            請求一覧へ
          </Link>
        </h1>
      </Page>
    );
  }
  const project = data.projects.find((p) => p.id === invoice.projectId);

  return (
    <Page>
      <div className="max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3 print:hidden">
          <Link href="/invoices" className="hit inline-flex items-center gap-1 text-xs text-warm-500 hover:text-ink">
            <ArrowLeft size={14} aria-hidden />
            請求一覧
          </Link>
          {project && (
            <Link href={`/projects/${project.id}`} className="hit min-w-0 truncate text-xs text-warm-500 hover:text-ink hover:underline">
              案件「{project.name}」
            </Link>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="min-w-0">
            <h1 className="num text-xl font-semibold tracking-tight text-ink">請求書 {invoice.number}</h1>
            <p className="mt-1 flex items-center gap-3 text-sm">
              <InvoiceStatusBadge status={invoiceStatus(invoice, today)} />
              <span className="num text-xs text-warm-500">
                {invoice.draft
                  ? `見積 ${invoice.estimateNo} の承認待ち`
                  : invoice.paidOn
                    ? `${formatDate(invoice.paidOn)} に入金`
                    : `期日 ${formatDate(invoice.dueOn)}`}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            {/* 下書きは発行前なので入金を記録できない */}
            {!invoice.draft && (
              <button
                type="button"
                onClick={() => actions.setInvoicePaid(invoice.id, !invoice.paidOn)}
                className={invoice.paidOn ? buttonStyles.secondary : buttonStyles.primary}
              >
                {invoice.paidOn ? "入金を取消" : "入金済にする"}
              </button>
            )}
            <button type="button" onClick={() => window.print()} className={invoice.paidOn ? buttonStyles.primary : buttonStyles.secondary}>
              <Printer size={16} aria-hidden />
              印刷
            </button>
          </div>
        </div>

        {invoice.estimateNo &&
          (invoice.draft ? (
            <div className="mb-4 rounded-lg border border-line bg-canvas px-4 py-3 text-sm print:hidden">
              <p className="text-ink">
                見積 <span className="num">{invoice.estimateNo}</span> が承認されると発行されます。
              </p>
              <p className="mt-0.5 text-xs text-warm-500">デモでは、見積管理ツールでこの見積を承認すると発行済みに切り替わります。</p>
              <p className="mt-2 text-xs">
                <ExternalLink href={estimateUrl(invoice.estimateNo)}>見積 {invoice.estimateNo} を見積管理で開く</ExternalLink>
              </p>
            </div>
          ) : (
            <p className="mb-4 flex flex-wrap items-center gap-x-2 text-xs print:hidden">
              <span className="text-warm-500">
                見積 <span className="num">{invoice.estimateNo}</span> の承認を受けて発行
              </span>
              <ExternalLink href={estimateUrl(invoice.estimateNo)}>見積管理で見る（デモ）</ExternalLink>
            </p>
          ))}

        <InvoiceDocument invoice={invoice} project={project} />
        <p className="mt-3 text-xs text-warm-500 print:hidden">デモのため、実際の送付は行いません。</p>
      </div>
    </Page>
  );
}
