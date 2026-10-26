import type { FlowDiagram as FlowDiagramData } from "@/content/projects";
import { Arrow, ArrowMarker, COLOR } from "./FlowDiagram";

/*
 * FlowDiagram（Case Study の縦の図）を、トップの代表作用に横1列へ並べ直したもの。
 * 本流の説明（note）は省き、ラベルだけを置く。下段は上段との関係が分かるよう、
 * Case Study と同じ補足（状態を書く／1ファイル／読むだけ）を箱の中に添える。中身は Case Study と同じデータを使う。
 * viewBox の幅 640 は、本文の最大幅（max-w-2xl の内側）とほぼ等倍になる値。
 */
const W = 640;
const PAD = 8;
const ARROW_GAP = 24;
const BOX_H = 56;
const TOP = PAD + 18; // 箱の上に「信頼境界」を置く余白
const MIN_SIDE_W = 112;

/** 下段の補足（11px）が箱からはみ出さない幅。全角は 11、半角は 6.5 として見積もる。 */
function sideWidth(notes: readonly string[]): number {
  const textW = (s: string) =>
    Array.from(s).reduce((w, c) => w + (c.charCodeAt(0) < 128 ? 6.5 : 11), 0);
  return Math.max(MIN_SIDE_W, ...notes.map((n) => Math.ceil(textW(n)) + 16));
}
const SIDE_H = 46;

/** 「ポリシー層（決定的）」のような括弧付きのラベルは、括弧の前で2行に分ける。 */
function splitLabel(label: string): string[] {
  const i = label.indexOf("（");
  return i > 0 ? [label.slice(0, i), label.slice(i)] : [label];
}

export function FlowRow({
  id,
  diagram,
  className,
}: {
  /** 同じページ内で一意な接頭辞 */
  id: string;
  diagram: FlowDiagramData;
  className?: string;
}) {
  const { description, steps, sidePath } = diagram;
  const markerId = `${id}-arrow`;
  const SIDE_W = sideWidth(sidePath?.steps.map((step) => step.note) ?? []);
  const boxW = (W - PAD * 2 - ARROW_GAP * (steps.length - 1)) / steps.length;
  const ruleY = TOP + BOX_H + 18;
  const sideY = ruleY + 14;
  const height = sidePath ? sideY + SIDE_H + PAD : TOP + BOX_H + PAD;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={description}
        className="block w-full h-auto"
      >
        <title>{description}</title>
        <ArrowMarker id={markerId} />

        {steps.map(({ label, boundary }, i) => {
          const x = PAD + i * (boxW + ARROW_GAP);
          const lines = splitLabel(label);
          const firstY = TOP + BOX_H / 2 + 5 - (lines.length - 1) * 9;
          return (
            <g key={`${label}-${i}`}>
              {boundary && (
                <text
                  x={x + boxW / 2}
                  y={TOP - 6}
                  fill={COLOR.boundary}
                  fontSize={12.5}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  信頼境界
                </text>
              )}
              <rect
                x={x}
                y={TOP}
                width={boxW}
                height={BOX_H}
                rx={8}
                fill={COLOR.box}
                stroke={boundary ? COLOR.boundary : COLOR.line}
                strokeWidth={boundary ? 2 : 1}
              />
              <text
                x={x + boxW / 2}
                y={firstY}
                fill={COLOR.label}
                fontSize={13}
                fontWeight={700}
                textAnchor="middle"
              >
                {lines.map((line, j) => (
                  <tspan key={line} x={x + boxW / 2} dy={j === 0 ? 0 : 18}>
                    {line}
                  </tspan>
                ))}
              </text>
              {i < steps.length - 1 && (
                <Arrow
                  x1={x + boxW + 2}
                  y1={TOP + BOX_H / 2}
                  x2={x + boxW + ARROW_GAP - 3}
                  y2={TOP + BOX_H / 2}
                  markerId={markerId}
                />
              )}
            </g>
          );
        })}

        {sidePath && (
          <g>
            <line
              x1={PAD}
              y1={ruleY}
              x2={W - PAD}
              y2={ruleY}
              stroke={COLOR.line}
              strokeDasharray="4 4"
            />
            {sidePath.steps.map(({ label, note }, i) => {
              const x = PAD + i * (SIDE_W + ARROW_GAP);
              return (
                <g key={`${label}-${i}`}>
                  <rect
                    x={x}
                    y={sideY}
                    width={SIDE_W}
                    height={SIDE_H}
                    rx={6}
                    fill={COLOR.box}
                    stroke={COLOR.line}
                    strokeDasharray="4 3"
                  />
                  <text
                    x={x + SIDE_W / 2}
                    y={sideY + 19}
                    fill={COLOR.label}
                    fontSize={13}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                  <text
                    x={x + SIDE_W / 2}
                    y={sideY + 36}
                    fill={COLOR.note}
                    fontSize={12.5}
                    textAnchor="middle"
                  >
                    {note}
                  </text>
                  {i < sidePath.steps.length - 1 && (
                    <Arrow
                      x1={x + SIDE_W + 2}
                      y1={sideY + SIDE_H / 2}
                      x2={x + SIDE_W + ARROW_GAP - 3}
                      y2={sideY + SIDE_H / 2}
                      markerId={markerId}
                    />
                  )}
                </g>
              );
            })}
            <text
              x={PAD + sidePath.steps.length * (SIDE_W + ARROW_GAP) - ARROW_GAP + 14}
              y={sideY + SIDE_H / 2 + 4}
              fill={COLOR.note}
              fontSize={12}
            >
              {sidePath.note}
            </text>
          </g>
        )}
      </svg>
    </figure>
  );
}
