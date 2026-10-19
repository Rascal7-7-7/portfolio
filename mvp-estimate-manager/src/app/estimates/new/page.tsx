import EstimateForm from "@/components/estimate-form/EstimateForm";

export const metadata = { title: "新規見積 | 見積マネージャー" };

export default function NewEstimatePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">新規見積</h1>
        <p className="mt-1 text-sm text-body">
          品目・数量・単価を入れると、小計・消費税・合計と見積書が自動で更新されます。
        </p>
      </div>
      <EstimateForm />
    </div>
  );
}
