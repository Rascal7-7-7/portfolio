import { Github, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { TextLink } from "./ui/TextLink";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6" aria-labelledby="contact-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          id="contact-heading"
          label="CONTACT"
          title="連絡先"
          description="作品やコードについてのご質問は、こちらからお願いします。"
        />

        <div className="flex flex-col sm:flex-row gap-4">
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
            aria-label="メールを送る"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            メールを送る
          </TextLink>
        </div>
      </div>
    </section>
  );
}
