import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { works } from "@/content/site";
import { cn } from "@/lib/cn";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/**
 * 困りごとから入り、それを解く作例を実際の画面と一緒に見せる。
 * 広い画面では画像と文章を左右交互に置き、読む順（困りごと → 作例 → 触ってみる）を一定に保つ。
 */
export function Works() {
  return (
    <Section id="works" labelledBy="works-heading" tone="soft">
      <SectionHeader
        id="works-heading"
        eyebrow="こんなお困りごとに"
        title="よくある手間を、画面ひとつで片づける"
        description="下の作例は、小さなお店や個人事業を想定して作ったものです。どれもブラウザで実際に触れます（入力した内容はお使いの端末の中だけに残ります）。"
      />

      <ol className="mt-16 space-y-20 sm:space-y-28">
        {works.map((work, i) => (
          <li key={work.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-2")}>
              <p className="text-sm font-medium text-ink-subtle">
                お困りごと {i + 1}
              </p>
              <h3 className="mt-2 text-2xl font-bold leading-snug sm:text-[28px]">
                <Phrase text={work.pain} />
              </h3>
              <p className="mt-3 leading-[1.9] text-ink-muted">{work.detail}</p>

              <div className="mt-7 border-t border-line pt-6">
                <p className="font-bold">
                  <span className="text-ink-subtle">作例：</span>
                  {work.name}
                </p>
                <p className="mt-2 leading-[1.9] text-ink-muted">{work.solution}</p>
                <a
                  href={work.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-1 font-medium underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink"
                >
                  実際に触ってみる
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">（{work.name}の作例を新しいタブで開く）</span>
                </a>
              </div>
            </div>

            <a
              href={work.demo}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              aria-hidden="true"
              className={cn(
                "block transition-transform duration-300 hover:-translate-y-1 lg:col-span-7",
                i % 2 === 1 && "lg:order-1",
              )}
            >
              <Image
                src={work.image}
                alt=""
                width={1600}
                height={1000}
                sizes="(min-width: 1024px) 640px, 100vw"
                className="w-full rounded-xl bg-canvas shadow-shot"
              />
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}
