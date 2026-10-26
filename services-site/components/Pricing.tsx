import { pricing } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/** 料金は要相談。金額は出さず、何で決まるかを地の上の 3 行で見せる（カードにはしない） */
export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeader id="pricing-heading" title="料金はご相談のうえで決めます" description={pricing.lead} />
          <p className="mt-6 font-bold">
            <Phrase text={pricing.minimum} />
          </p>
        </div>
        <dl className="divide-y divide-line border-y border-line lg:col-span-7">
          {pricing.factors.map(({ title, body }) => (
            <div key={title} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="font-bold">
                <Phrase text={title} />
              </dt>
              <dd className="text-[15px] leading-[1.8] text-ink-muted">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
