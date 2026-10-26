import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { mailto } from "@/content/site";
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
            {/* 意味の切れ目ごとに区切り、「紙・LINE・／Excel」のような割れ方をさせない */}
            <span className="inline-block">紙・LINE・Excelの</span>
            <span className="inline-block">手間を、</span>
            <span className="inline-block">お店に合った</span>
            <span className="inline-block">小さな仕組みに。</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.9] text-ink-muted">
            予約・見積・請求・お店の紹介ページ。いまのやり方を伺って、必要なものだけを作ります。下の作例は、どれも実際に触れます。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={mailto}>
              無料で相談する
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#works" variant="secondary">
              作例を見る
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink-subtle">ご相談・お見積りは無料です。メールで24時間受け付けています。</p>
        </div>

        {/* 作例の実際の画面。PC の予定表の上に、お客様のスマホの予約画面を重ねる */}
        <div className="relative lg:col-span-6">
          <Image
            src="/works/booking.webp"
            alt="予約管理の作例。週の予定表に、その週の予約が並んでいる"
            width={1600}
            height={1000}
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="w-full rounded-xl bg-canvas shadow-shot"
          />
          <Image
            src="/works/flow-book.webp"
            alt="お客様のスマホの予約画面。空いている時間を選べる"
            width={720}
            height={1280}
            sizes="160px"
            className="absolute -bottom-10 -left-4 w-[32%] max-w-[180px] rounded-[22px] border-[5px] border-ink bg-canvas shadow-shot sm:-left-8"
          />
        </div>
      </div>
    </section>
  );
}
