import { Github, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Phrase } from "./Phrase";
import { SectionHeader } from "./ui/SectionHeader";
import { TextLink } from "./ui/TextLink";
import { containerWide } from "./ui/container";

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 border-t border-rule" aria-labelledby="contact-heading">
      <div className={`${containerWide} grid gap-x-12 lg:grid-cols-12`}>
        <SectionHeader id="contact-heading" title="連絡先" className="lg:col-span-4" />

        <div className="reveal lg:col-span-8 lg:pt-3">
          <p className="max-w-2xl text-[17px] leading-[1.8] text-ink-muted">
            <Phrase text="インターン・選考のご連絡、作品やコードについてのご質問は、メールでお願いします。" />
          </p>
          <div className="mt-6 flex flex-col items-start gap-1 sm:flex-row sm:gap-8">
            <TextLink
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              tone="accent"
              aria-label="GitHub を見る（新しいタブで開く）"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </TextLink>
            <TextLink
              href={`mailto:${profile.links.email}`}
              aria-label={`メールを送る（${profile.links.email}）`}
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {profile.links.email}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
