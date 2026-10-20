import type { Metadata } from "next";
import { InvoiceDetailView } from "@/components/views/InvoiceDetailView";
import { createSeed } from "@/lib/seed";
import { todayISO } from "@/lib/dates";

/** 番号は日付に依らないので、ダミーデータの請求ならサーバーでも番号が分かる。作成した請求はブラウザ側でタブ名を付け直す */
export async function generateMetadata(props: PageProps<"/invoices/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const number = createSeed(todayISO()).invoices.find((inv) => inv.id === id)?.number;
  return { title: number ?? "請求書" };
}

export default async function InvoiceDetailPage(props: PageProps<"/invoices/[id]">) {
  const { id } = await props.params;
  return <InvoiceDetailView id={id} />;
}
