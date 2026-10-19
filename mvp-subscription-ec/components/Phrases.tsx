/** 文節ごとに inline-block で包み、語の途中で改行させない（word-break:auto-phrase は Chromium 限定のため） */
export function Phrases({ parts }: { parts: ReadonlyArray<string> }) {
  return parts.map((part, i) =>
    part.trim() === '' ? (
      part
    ) : (
      <span key={i} className="inline-block">
        {part}
      </span>
    ),
  );
}
