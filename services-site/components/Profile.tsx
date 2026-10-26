import { ArrowUpRight } from "lucide-react";
import { owner, profile } from "@/content/site";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/** 作っている人。学生であることを隠さず、確かめられる事実だけを並べる */
export function Profile() {
  return (
    <Section id="profile" labelledBy="profile-heading" tone="soft">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <SectionHeader
          id="profile-heading"
          eyebrow="作っている人"
          title={owner.name}
          description={profile.lead}
          className="lg:col-span-5"
        />
        <div className="lg:col-span-7 lg:pt-8">
          <ul className="divide-y divide-line rounded-xl bg-canvas shadow-card">
            {profile.facts.map((fact) => (
              <li key={fact} className="px-6 py-4 text-[15px] leading-relaxed">
                <Phrase text={fact} />
              </li>
            ))}
          </ul>
          <a
            href={owner.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink"
          >
            技術的な取り組み（ポートフォリオ）
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">（新しいタブで開く）</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
