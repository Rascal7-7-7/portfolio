import { profile } from "@/content/profile";
import { Phrase } from "./Phrase";

type Entry = { readonly date: string; readonly label: string; readonly result: string };

/** "2025-12" → "2025/12" */
const month = (date: string) => date.replace("-", "/");

function Timeline({ title, entries }: { title: string; entries: readonly Entry[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-ink-subtle">{title}</h3>
      <ul className="mt-3 divide-y divide-rule border-y border-rule">
        {entries.map(({ date, label, result }) => (
          <li key={label} className="grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-x-4 py-3 text-[15px]">
            <span className="font-mono text-[13px] tabular-nums text-ink-subtle">{month(date)}</span>
            <span className="text-ink">
              <Phrase text={label} />
            </span>
            <span className="text-sm text-ink-muted">{result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 自己紹介の下に置く、資格と受賞・任命の一覧。年月は等幅で揃える。 */
export function Credentials() {
  return (
    <div className="reveal mt-12 grid gap-10 sm:grid-cols-2">
      <Timeline title="受賞・任命" entries={profile.awards} />
      <div>
        <Timeline title="資格" entries={profile.credentials} />
        <p className="mt-3 text-sm text-ink-muted">
          <Phrase text="基本情報技術者試験は科目A免除済み（科目Bを受験予定）" />
        </p>
      </div>
    </div>
  );
}
