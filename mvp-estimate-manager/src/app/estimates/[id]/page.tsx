import EstimateDetail from "@/components/EstimateDetail";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `見積 #${id} | 見積マネージャー` };
}

export default async function EstimateDetailPage({ params, searchParams }: Props) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  return <EstimateDetail id={Number(id)} justSaved={saved === "1"} />;
}
