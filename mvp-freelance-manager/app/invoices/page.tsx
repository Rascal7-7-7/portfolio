import type { Metadata } from "next";
import { InvoicesView } from "@/components/views/InvoicesView";

export const metadata: Metadata = { title: "請求・入金" };

export default function InvoicesPage() {
  return <InvoicesView />;
}
