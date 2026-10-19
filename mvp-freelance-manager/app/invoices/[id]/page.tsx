import type { Metadata } from "next";
import { InvoiceDetailView } from "@/components/views/InvoiceDetailView";

export const metadata: Metadata = { title: "請求書" };

export default async function InvoiceDetailPage(props: PageProps<"/invoices/[id]">) {
  const { id } = await props.params;
  return <InvoiceDetailView id={id} />;
}
