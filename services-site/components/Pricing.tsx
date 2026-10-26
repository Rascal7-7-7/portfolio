import { prices } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/** 料金の目安。金額は「〜」付きの目安として出し、決まり方を一文で添える */
export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <SectionHeader
        id="pricing-heading"
        eyebrow="料金の目安"
        title="作る量に合わせて、先にお見積りします"
        description="お話を伺ってから、作るものと金額をお伝えします。お見積りまでは無料です。"
      />
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {prices.map(({ title, price, note }) => (
          <li key={title} className="flex flex-col rounded-xl bg-canvas p-7 shadow-card">
            <h3 className="font-bold">
              <Phrase text={title} />
            </h3>
            <p className="mt-5 text-[34px] font-bold leading-none tabular-nums">{price}</p>
            <p className="mt-5 border-t border-line pt-5 text-[15px] leading-[1.8] text-ink-muted">{note}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
