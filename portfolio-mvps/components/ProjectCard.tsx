import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { Phrase } from "./Phrase";
import { TiltCard } from "./TiltCard";

const cardLink =
  "inline-flex min-h-11 items-center gap-0.5 text-sm underline decoration-1 underline-offset-4 transition-colors";

/**
 * 業務モックアップの連作の 1 枚。代表作より目立たせないよう、画面写真・作品名・一言説明・
 * デモとコードへの導線だけにする。制作時期・技術は連作の説明に 1 回だけ書く。
 */
export function ProjectCard({ project }: { project: Project }) {
  const { name, headline, thumbnail, links } = project;

  return (
    <article className="group reveal flex flex-col">
      {thumbnail && (
        <TiltCard>
          <Image
            src={thumbnail}
            alt={`${name}のデモ画面`}
            width={800}
            height={500}
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 45vw, 100vw"
            className="block w-full h-auto rounded-md border border-rule sm:opacity-80 transition-opacity duration-300 sm:group-hover:opacity-100"
          />
        </TiltCard>
      )}
      <h4 className="mt-4 text-[15px] font-semibold text-ink">{name}</h4>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        <Phrase text={headline} />
      </p>
      <div className="mt-auto flex gap-x-4 pt-2">
        {links.demo && (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardLink} text-accent decoration-accent/40 hover:text-accent-hover`}
            aria-label={`${name}のデモを見る（新しいタブで開く）`}
          >
            デモ
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardLink} text-ink-muted decoration-ink-subtle/50 hover:text-ink`}
            aria-label={`${name}の設計・コードを見る（新しいタブで開く）`}
          >
            コード
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
