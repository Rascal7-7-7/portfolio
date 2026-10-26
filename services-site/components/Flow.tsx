import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { flow } from "@/content/site";
import { cn } from "@/lib/cn";
import { Phrase } from "./Phrase";
import { Section, SectionHeader } from "./ui";

/**
 * 作例どうしをつなげた例。美容室 Lien の「紹介ページ → スマホで予約 → お店の一覧」を、実際の画面で 3 段に並べる。
 * お客様が見る画面はスマホの縦長、お店が見る画面は PC の横長にして、誰が使う画面かを形で分ける。
 */
export function Flow() {
  return (
    <Section id="flow" labelledBy="flow-heading">
      <SectionHeader
        id="flow-heading"
        eyebrow="つなげると"
        title="例：美容室の「知ってもらう」から「予約の確認」まで"
        description="ひとつずつ作ることも、つなげて一連の流れにすることもできます。架空の美容室 Lien を例に、お客様とお店のそれぞれが見る画面を並べました。"
      />

      <ol className="mt-14 grid gap-10 md:grid-cols-[1fr_1fr_1.6fr] md:gap-8">
        {flow.map((step, i) => {
          const isShop = i === flow.length - 1;
          return (
            <li key={step.title} className="flex flex-col">
              {/* 画像の下端を揃え、見出しの高さを 3 段で揃える */}
              <div className="flex items-end md:min-h-[420px]">
                <Image
                  src={step.image}
                  alt=""
                  width={isShop ? 1600 : 720}
                  height={isShop ? 1000 : 1280}
                  sizes={isShop ? "(min-width: 768px) 440px, 100vw" : "(min-width: 768px) 220px, 60vw"}
                  className={cn(
                    "bg-canvas shadow-shot",
                    isShop
                      ? "w-full rounded-xl"
                      : "mx-auto w-[62%] rounded-[24px] border-[5px] border-ink md:w-[78%]",
                  )}
                />
              </div>
              <p className="mt-6 text-sm font-medium text-ink-subtle">
                {i + 1}. {isShop ? "お店が見る画面" : "お客様が見る画面"}
              </p>
              <h3 className="mt-1 text-lg font-bold">
                <Phrase text={step.title} />
              </h3>
              <p className="mt-2 text-[15px] leading-[1.8] text-ink-muted">{step.body}</p>
              <a
                href={step.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 w-fit items-center gap-1 text-[15px] font-medium underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink"
              >
                この画面を開く
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">（新しいタブで開く）</span>
              </a>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
