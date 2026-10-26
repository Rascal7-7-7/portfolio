import { steps } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/** 進め方。番号は手順の順序そのものなので、等幅の数字で左に置く */
export function Steps() {
  return (
    <Section id="steps" labelledBy="steps-heading" tone="soft">
      <SectionHeader
        id="steps-heading"
        eyebrow="進め方"
        title="売り込むより先に、困りごとを伺います"
      />
      <ol className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line shadow-card sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="bg-canvas p-6 sm:p-7">
            <p className="text-sm font-medium tabular-nums text-ink-subtle">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-lg font-bold">
              <Phrase text={step.title} />
            </h3>
            <p className="mt-2 text-[15px] leading-[1.85] text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
