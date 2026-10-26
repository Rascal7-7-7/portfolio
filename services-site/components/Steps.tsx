import { steps } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/**
 * 進め方。カードの格子にはせず、1 本の線の上に 4 つの点を置く時系列にする（手順の順序がそのまま見える）。
 * 広い画面では横、狭い画面では縦に線を引く。
 */
export function Steps() {
  return (
    <Section id="steps" labelledBy="steps-heading" tone="soft">
      <SectionHeader id="steps-heading" title="ご相談から公開まで" />
      <ol className="relative mt-12 grid gap-10 border-l border-ink/15 pl-8 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            {/* 線の上の点。番号はその横に小さく添える */}
            <span
              aria-hidden="true"
              className="absolute -left-[37px] top-1.5 size-[9px] rounded-full bg-ink lg:-top-[45px] lg:left-0"
            />
            <p className="text-sm font-medium tabular-nums text-ink-subtle">{i + 1}</p>
            <h3 className="mt-1 text-lg font-bold">
              <Phrase text={step.title} />
            </h3>
            <p className="mt-2 text-[15px] leading-[1.85] text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
