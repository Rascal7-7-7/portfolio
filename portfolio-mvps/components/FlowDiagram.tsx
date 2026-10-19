import type { FlowDiagram as FlowDiagramData } from "@/content/projects";

/*
 * 座標は viewBox 上の値。幅を 360 に抑え、390px 幅の画面でも文字が縮みすぎないようにする。
 * 色は tailwind.config.ts のトークンと同じ値。明るい地（paper）で AA を満たすものだけを文字に使う。
 */
const W = 360;
const PAD = 8;
const SIDE_GAP = 14;

/** compact はトップの狭い画面用。説明（note）を省き、箱を詰める。 */
const SIZE = {
  full: { boxH: 56, gap: 28, sideBoxH: 52 },
  compact: { boxH: 40, gap: 18, sideBoxH: 34 },
};

export const COLOR = {
  box: "#fcfbf8", // paper
  line: "#8f8b82", // 枠線のみ（paper に対し 3.3:1。非テキストの 3:1 を満たす）。文字には使わない
  boundary: "#035a8c", // accent（7.1:1）
  label: "#1c1b19", // ink（16.6:1）
  note: "#52504b", // ink.muted（7.8:1）
};

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  markerId,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  markerId: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={COLOR.note}
      strokeWidth={1.5}
      markerEnd={`url(#${markerId})`}
    />
  );
}

/** 矢印の先端。id は同じページに図が複数あっても衝突しないよう、呼び出し側から受け取る。 */
export function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill={COLOR.note} />
      </marker>
    </defs>
  );
}

export function FlowDiagram({
  id,
  diagram,
  compact = false,
  className,
}: {
  /** 同じページ内で一意な接頭辞 */
  id: string;
  diagram: FlowDiagramData;
  compact?: boolean;
  className?: string;
}) {
  const { description, steps, sidePath } = diagram;
  const { boxH: BOX_H, gap: GAP, sideBoxH: SIDE_BOX_H } = SIZE[compact ? "compact" : "full"];
  const markerId = `${id}-arrow`;
  const mainH = steps.length * BOX_H + (steps.length - 1) * GAP;
  const sideTop = mainH + (compact ? 28 : 40);
  const sideCount = sidePath?.steps.length ?? 0;
  const sideW = sideCount ? (W - PAD * 2 - SIDE_GAP * (sideCount - 1)) / sideCount : 0;
  const sideY = sideTop + (compact ? 16 : 24);
  const height = sidePath ? sideY + SIDE_BOX_H + 30 : mainH + PAD * 2;
  // compact は説明を出さないため、作品名の1行を箱の上下中央に置く
  const labelY = compact ? BOX_H / 2 + 5 : 24;
  const sideLabelY = compact ? SIDE_BOX_H / 2 + 5 : 22;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={description}
        className="block w-full max-w-md mx-auto h-auto"
      >
        <title>{description}</title>
        <ArrowMarker id={markerId} />

        {steps.map(({ label, note, boundary }, i) => {
          const y = PAD + i * (BOX_H + GAP);
          return (
            <g key={`${label}-${i}`}>
              <rect
                x={PAD}
                y={y}
                width={W - PAD * 2}
                height={BOX_H}
                rx={10}
                fill={COLOR.box}
                stroke={boundary ? COLOR.boundary : COLOR.line}
                strokeWidth={boundary ? 2 : 1}
              />
              <text x={PAD + 16} y={y + labelY} fill={COLOR.label} fontSize={15} fontWeight={700}>
                {label}
              </text>
              {boundary && (
                <text
                  x={W - PAD - 14}
                  y={y + labelY}
                  fill={COLOR.boundary}
                  fontSize={12}
                  fontWeight={700}
                  textAnchor="end"
                >
                  信頼境界
                </text>
              )}
              {!compact && (
                <text x={PAD + 16} y={y + 44} fill={COLOR.note} fontSize={12}>
                  {note}
                </text>
              )}
              {i < steps.length - 1 && (
                <Arrow
                  x1={W / 2}
                  y1={y + BOX_H + 2}
                  x2={W / 2}
                  y2={y + BOX_H + GAP - 3}
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
              y1={sideTop}
              x2={W - PAD}
              y2={sideTop}
              stroke={COLOR.line}
              strokeDasharray="4 4"
            />
            {sidePath.steps.map(({ label, note }, i) => {
              const x = PAD + i * (sideW + SIDE_GAP);
              const y = sideY;
              return (
                <g key={`${label}-${i}`}>
                  <rect
                    x={x}
                    y={y}
                    width={sideW}
                    height={SIDE_BOX_H}
                    rx={8}
                    fill={COLOR.box}
                    stroke={COLOR.line}
                    strokeDasharray="4 3"
                  />
                  <text
                    x={x + sideW / 2}
                    y={y + sideLabelY}
                    fill={COLOR.label}
                    fontSize={13}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                  {!compact && (
                    <text
                      x={x + sideW / 2}
                      y={y + 40}
                      fill={COLOR.note}
                      fontSize={11}
                      textAnchor="middle"
                    >
                      {note}
                    </text>
                  )}
                  {i < sideCount - 1 && (
                    <Arrow
                      x1={x + sideW + 1}
                      y1={y + SIDE_BOX_H / 2}
                      x2={x + sideW + SIDE_GAP - 2}
                      y2={y + SIDE_BOX_H / 2}
                      markerId={markerId}
                    />
                  )}
                </g>
              );
            })}
            <text
              x={W / 2}
              y={sideY + SIDE_BOX_H + 22}
              fill={COLOR.note}
              fontSize={12}
              textAnchor="middle"
            >
              {sidePath.note}
            </text>
          </g>
        )}
      </svg>
    </figure>
  );
}
