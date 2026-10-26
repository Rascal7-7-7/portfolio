import { formatYen } from "@/lib/utils";

/**
 * 大きく見せる金額用。「¥」を一回り小さく・軽くして、数字の桁を主役にする（Stripe の残高表示にならう）。
 * 読み上げ・コピーは formatYen と同じ文字列になる
 */
export default function Money({ amount }: { amount: number }) {
  const text = formatYen(amount);
  const digits = text.replace(/^¥/, "");
  if (digits === text) return <>{text}</>;
  return (
    <>
      <span className="mr-[-0.14em] align-[0.12em] text-[0.62em] font-medium opacity-70">¥</span>
      {digits}
    </>
  );
}
