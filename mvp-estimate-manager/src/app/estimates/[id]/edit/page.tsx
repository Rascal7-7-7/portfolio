import EditEstimate from "@/components/EditEstimate";

export const metadata = { title: "見積を編集 | 見積マネージャー" };

export default async function EditEstimatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditEstimate id={Number(id)} />;
}
