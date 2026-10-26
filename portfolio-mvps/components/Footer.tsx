import { profile } from "@/content/profile";
import { TextLink } from "./ui/TextLink";
import { container, containerWide } from "./ui/container";

/** wide はトップページ用。本文の幅（containerWide）に左端を揃える */
export function Footer({ wide = false }: { wide?: boolean }) {
  return (
    <footer className="pb-12">
      <div className={wide ? containerWide : container}>
        <div className="border-t border-rule pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm text-ink-subtle">
            © {new Date().getFullYear()} {profile.name}
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            <span className="inline-block">{profile.school}</span>
          </p>
          <TextLink href="#top" className="text-sm" aria-label="ページ先頭へ戻る">
            ページ先頭へ戻る
          </TextLink>
        </div>
      </div>
    </footer>
  );
}
