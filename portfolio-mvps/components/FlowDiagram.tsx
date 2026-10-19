import type { FlowDiagram as FlowDiagramData } from "@/content/projects";

/*
 * 座標は viewBox 上の値。幅を 360 に抑え、390px 幅の画面でも文字が縮みすぎないようにする。
 * 色は暗い背景（surface-900/950）で AA を満たすものだけを使う。
 */
const W = 360;
const PAD = 8;
const BOX_H = 56;
const GAP = 28;
const SIDE_GAP = 14;
const SIDE_BOX_H = 52;

const COLOR = {
  box: "#09090b", // surface-950
  line: "#52525b", // surface-600（枠線のみ。文字には使わない）
  boundary: "#38bdf8", // brand-400
  label: "#fafafa", // surface-50
  note: "#a1a1aa", // surface-400
};

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={COLOR.note}
      strokeWidth={1.5}
      markerEnd="url(#flow-arrow)"
    />
  );
}

export function FlowDiagram({ diagram }: { diagram: FlowDiagramData }) {
  const { description, steps, sidePath } = diagram;
  const mainH = steps.length * BOX_H + (steps.length - 1) * GAP;
  const sideTop = mainH + 40;
  const sideCount = sidePath?.steps.length ?? 0;
  const sideW = sideCount ? (W - PAD * 2 - SIDE_GAP * (sideCount - 1)) / sideCount : 0;
  const height = sidePath ? sideTop + 24 + SIDE_BOX_H + 30 : mainH + PAD * 2;

  return (
    <figure className="rounded-xl bg-surface-900 ring-1 ring-white/5 p-4 sm:p-6 mb-8">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={description}
        className="block w-full max-w-md mx-auto h-auto"
      >
        <title>{description}</title>
        <defs>
          <marker
            id="flow-arrow"
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
              <text x={PAD + 16} y={y + 24} fill={COLOR.label} fontSize={15} fontWeight={700}>
                {label}
              </text>
              {boundary && (
                <text
                  x={W - PAD - 14}
                  y={y + 24}
                  fill={COLOR.boundary}
                  fontSize={12}
                  fontWeight={700}
                  textAnchor="end"
                >
                  信頼境界
                </text>
              )}
              <text x={PAD + 16} y={y + 44} fill={COLOR.note} fontSize={12}>
                {note}
              </text>
              {i < steps.length - 1 && (
                <Arrow x1={W / 2} y1={y + BOX_H + 2} x2={W / 2} y2={y + BOX_H + GAP - 3} />
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
              const y = sideTop + 24;
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
                    y={y + 22}
                    fill={COLOR.label}
                    fontSize={13}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                  <text
                    x={x + sideW / 2}
                    y={y + 40}
                    fill={COLOR.note}
                    fontSize={11}
                    textAnchor="middle"
                  >
                    {note}
                  </text>
                  {i < sideCount - 1 && (
                    <Arrow
                      x1={x + sideW + 1}
                      y1={y + SIDE_BOX_H / 2}
                      x2={x + sideW + SIDE_GAP - 2}
                      y2={y + SIDE_BOX_H / 2}
                    />
                  )}
                </g>
              );
            })}
            <text
              x={W / 2}
              y={sideTop + 24 + SIDE_BOX_H + 22}
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
