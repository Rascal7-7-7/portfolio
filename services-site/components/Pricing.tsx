import { pricing } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/** 料金は要相談。金額は出さず、何で決まるかを 3 つに分けて見せる */
export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <SectionHeader
          id="pricing-heading"
          eyebrow="料金"
          title="料金はご相談のうえで決めます"
          description={pricing.lead}
          className="lg:col-span-5"
        />
        <ol className="divide-y divide-line rounded-xl bg-canvas shadow-card lg:col-span-7">
          {pricing.factors.map(({ title, body }, i) => (
            <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-x-2 px-6 py-5 sm:px-7">
              <span className="pt-0.5 text-sm font-medium tabular-nums text-ink-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-bold">
                  <Phrase text={title} />
                </h3>
                <p className="mt-1 text-[15px] leading-[1.8] text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
