import { promises } from "@/content/site";
import { cn } from "@/lib/cn";
import { Phrase } from "./Phrase";
import { container } from "./ui";

/**
 * ヒーロー直下の、依頼する前に知りたい 3 つの約束。
 * アイコン付きのカードにはせず、罫線で区切った文章の帯にする。
 */
export function Promises() {
  return (
    <section aria-label="ご依頼いただくときのお約束" className="border-y border-line">
      <ul className={cn(container, "grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0")}>
        {promises.map(({ title, body }) => (
          <li key={title} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
            <h2 className="text-lg font-bold">
              <Phrase text={title} />
            </h2>
            <p className="mt-2 text-[15px] leading-[1.85] text-ink-muted">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
