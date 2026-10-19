import Link from "next/link";
import EstimateList from "@/components/EstimateList";
import Icon from "@/components/Icon";

export const metadata = { title: "見積一覧 | 見積マネージャー" };

export default function EstimatesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">見積一覧</h1>
          <p className="mt-1 text-sm text-body">
            明細を入れるだけで税込金額を自動計算。送付から受注までを1画面で追えます。
          </p>
        </div>
        <Link
          href="/estimates/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="plus" />
          新規見積を作成
        </Link>
      </div>
      <EstimateList />
    </div>
  );
}
