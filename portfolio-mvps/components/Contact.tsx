import { Github, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { TextLink } from "./ui/TextLink";
import { container } from "./ui/container";

export function Contact() {
  return (
    <section id="contact" className="pt-8 pb-14 sm:pt-10 sm:pb-16" aria-labelledby="contact-heading">
      <div className={container}>
        <SectionHeader
          id="contact-heading"
          title="連絡先"
          description="作品やコードについてのご質問は、こちらからお願いします。"
        />

        <div className="flex flex-col items-start sm:flex-row sm:gap-6">
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
