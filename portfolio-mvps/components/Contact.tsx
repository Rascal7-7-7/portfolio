import { Github, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { TextLink } from "./ui/TextLink";
import { container } from "./ui/container";

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-rule" aria-labelledby="contact-heading">
      <div className={container}>
        <SectionHeader
          id="contact-heading"
          index="03"
          title="連絡先"
          description="インターン・選考のご連絡、作品やコードについてのご質問は、メールでお願いします。"
        />

        <div className="reveal flex flex-col items-start gap-1 sm:flex-row sm:gap-8">
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
    </section>
  );
}
