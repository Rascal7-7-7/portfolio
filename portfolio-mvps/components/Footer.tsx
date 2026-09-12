import { profile } from "@/content/profile";
import { TextLink } from "./ui/TextLink";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-surface-800/60 bg-surface-950">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-bold text-surface-200 text-sm mb-1">{profile.name}</p>
          <p className="text-surface-500 text-xs">
            {profile.school} {profile.department}
          </p>
        </div>

        <TextLink href="#top" tone="subtle" aria-label="ページ先頭へ戻る">
          ページ先頭へ戻る
        </TextLink>
      </div>

      <p className="max-w-5xl mx-auto text-surface-700 text-xs mt-8">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
