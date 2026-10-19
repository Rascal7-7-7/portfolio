import CustomerView from "@/components/CustomerView";

export const metadata = { title: "お見積りのご確認 | 見積マネージャー（デモ）" };

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerView id={Number(id)} />;
}
