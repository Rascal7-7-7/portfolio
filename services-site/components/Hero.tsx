import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { owner } from "@/content/site";
import { cn } from "@/lib/cn";
import { Phrase } from "./Phrase";
import { ButtonLink, container } from "./ui";

/**
 * 最初の画面。左に「何をしてくれる人か」と相談の導線、右に作例の実際の画面（PC の予定表とスマホの予約画面）。
 * 画面写真を主役にし、飾りの図形は置かない。
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="overflow-hidden">
      <div className={cn(container, "grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-28")}>
        <div className="lg:col-span-6">
          <p className="text-[15px] text-ink-muted">
            <Phrase text="小さなお店・個人事業のWeb制作と業務ツールづくり" />
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-[32px] font-bold leading-[1.3] sm:text-[46px] sm:leading-[1.22]"
          >
            {/* 店主の言葉（予約・見積・お店のページ）で言い切る。意味の切れ目ごとに区切って割れ方を固定する */}
            <span className="inline-block">予約も、見積も、</span>
            <span className="inline-block">お店のページも。</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.9] text-ink-muted">
            紙やLINE、Excelで回している業務を伺って、いまのやり方に合わせて必要なものだけを作ります。下の作例は、どれも実際に触れます。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={owner.x} target="_blank" rel="noopener noreferrer">
              X の DM で相談する
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">（新しいタブで開く）</span>
            </ButtonLink>
            <ButtonLink href="#works" variant="secondary">
              作例を見る
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink-subtle">ご相談・お見積りは無料です。メールでも受け付けています。</p>
        </div>

        {/* 作例の実際の画面。PC の予定表の上に、お客様のスマホの予約画面を重ねる（スマホではスマホの画面 1 枚だけ） */}
        <div className="relative lg:col-span-6">
          <Image
            src="/works/hero-schedule.webp"
            alt="予約管理の作例。お店の週の予定表に、その週の予約が並んでいる"
            width={1600}
            height={1000}
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="hidden w-full rounded-xl bg-canvas shadow-shot sm:block"
          />
          <Image
            src="/works/flow-book.webp"
            alt="お客様のスマホの予約画面。空いている時間を選べる"
            width={720}
            height={1280}
            sizes="160px"
            className="mx-auto w-[58%] max-w-[240px] rounded-[26px] border-[6px] border-ink bg-canvas shadow-shot sm:absolute sm:-bottom-10 sm:-left-8 sm:w-[32%] sm:max-w-[180px] sm:rounded-[22px] sm:border-[5px]"
          />
        </div>
      </div>
    </section>
  );
}
