import { ArrowRight } from "lucide-react";
import { inquiry, mailto, owner } from "@/content/site";
import { cn } from "@/lib/cn";
import { Phrase } from "./Phrase";
import { ButtonLink, container } from "./ui";

/** 相談の導線。メールを開くと、返信に必要な項目が最初から入っている */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-ink py-20 text-white sm:py-28">
      <div className={cn(container, "grid gap-10 lg:grid-cols-12 lg:gap-14")}>
        <div className="lg:col-span-7">
          <h2 id="contact-heading" className="text-[28px] font-bold leading-[1.3] sm:text-[40px] sm:leading-[1.2]">
            <Phrase text="まずは、いまのやり方を聞かせてください" />
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.9] text-white/80">
            <Phrase text="「こんなことはできる？」の段階でも大丈夫です。ご相談とお見積りは無料です。" />
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={owner.x} target="_blank" rel="noopener noreferrer" variant="secondary">
              X の DM で相談する
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">（新しいタブで開く）</span>
            </ButtonLink>
            <a
              href={mailto}
              className="inline-flex min-h-12 items-center rounded-full px-6 text-[15px] font-medium text-white ring-1 ring-white/30 hover:ring-white/70"
            >
              メールで相談する
            </a>
          </div>
          <p className="mt-4 text-sm text-white/70">
            X：{owner.xHandle}　メール：{owner.email}
          </p>
        </div>
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-white/70">はじめに教えていただきたいこと</p>
          <ul className="mt-3 divide-y divide-white/15 border-y border-white/15">
            {inquiry.body.split("\n").map((line) => (
              <li key={line} className="py-3 text-[15px]">
                {line.replace(/：$/, "")}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-white/70">メールのボタンから開くと、この項目が最初から入っています。DM なら一言目は「相談です」だけでも大丈夫です。</p>
        </div>
      </div>
    </section>
  );
}
