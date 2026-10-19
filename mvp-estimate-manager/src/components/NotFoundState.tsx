import Link from "next/link";

export default function NotFoundState() {
  return (
    <div className="p-8 text-sm text-body">
      <p>見積が見つかりません。「デモデータに戻す」でデータが初期状態に戻った可能性があります。</p>
      <Link href="/estimates" className="mt-2 inline-block font-semibold text-primary hover:underline">
        見積一覧へ戻る
      </Link>
    </div>
  );
}
