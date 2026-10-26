import { faqs } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/** よくある質問。開閉はブラウザ標準の details を使い、三角は自前の「＋」に替える */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <SectionHeader id="faq-heading" eyebrow="よくある質問" title="ご依頼の前に" className="lg:col-span-5" />
        <div className="divide-y divide-line border-y border-line lg:col-span-7">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-bold [&::-webkit-details-marker]:hidden">
                <Phrase text={question} />
                <span
                  aria-hidden="true"
                  className="text-xl font-normal text-ink-subtle transition-transform duration-200 group-open:rotate-45"
                >
                  ＋
                </span>
              </summary>
              <p className="pb-6 pr-10 leading-[1.9] text-ink-muted">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
