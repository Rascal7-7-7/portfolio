// 外部画像を使わず、商品ごとの配色とパッケージ形状をインライン SVG で描く。
import { useId, type ReactNode } from 'react';
import type { Motif, PackageShape, Product, Visual } from '@/lib/types';
import { cn } from '@/lib/cn';

const LABEL_BG = '#f8f4ea';

// 素材にちなんだ印。±10 の枠に1色で描き、呼び出し側で位置と大きさを決める
const line = (c: string) => ({ stroke: c, strokeWidth: 1.4, strokeLinecap: 'round' as const, fill: 'none' });
const MOTIFS: Record<Motif, (c: string) => ReactNode> = {
  bean: (c) => (
    <g transform="rotate(25)">
      <ellipse rx="6" ry="9" fill={c} />
      <path d="M1.2 -8 C -2.6 -3, 2.6 3, -1.2 8" stroke={LABEL_BG} strokeWidth="1.2" fill="none" />
    </g>
  ),
  tea: (c) => (
    <g fill={c}>
      <path d="M0 10 L0 -2" {...line(c)} />
      <path d="M0 -1 Q 2 -6 0 -10 Q -2 -6 0 -1 Z" />
      <path d="M0 5 Q -9 3 -9 -4 Q -2 -2 0 5 Z" />
      <path d="M0 2 Q 8 1 8 -5 Q 2 -4 0 2 Z" />
    </g>
  ),
  wheat: (c) => (
    <g fill={c}>
      <path d="M0 10 L0 -8" {...line(c)} />
      {[-6, -2, 2].map((y) => (
        <g key={y}>
          <ellipse cx="-2.4" cy={y} rx="1.7" ry="3.2" transform={`rotate(-28 -2.4 ${y})`} />
          <ellipse cx="2.4" cy={y} rx="1.7" ry="3.2" transform={`rotate(28 2.4 ${y})`} />
        </g>
      ))}
      <ellipse cy="-9" rx="1.5" ry="2.8" />
    </g>
  ),
  hinoki: (c) => (
    <g {...line(c)} strokeWidth="1.6">
      <path d="M0 10 L0 -9 M0 5 L-6 1 M0 5 L6 1 M0 0 L-5 -4 M0 0 L5 -4 M0 -5 L-3 -8 M0 -5 L3 -8" />
    </g>
  ),
  petal: (c) => (
    <g fill={c}>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cy="-4.6" rx="2.8" ry="4.6" transform={`rotate(${r})`} />
      ))}
      <circle r="1.6" fill={LABEL_BG} />
    </g>
  ),
  herb: (c) => (
    <g fill={c}>
      <path d="M-1 10 Q 0 0 2 -9" {...line(c)} />
      <ellipse cx="-3.6" cy="5" rx="2.2" ry="3.6" transform="rotate(-55 -3.6 5)" />
      <ellipse cx="3.6" cy="1" rx="2.2" ry="3.6" transform="rotate(55 3.6 1)" />
      <ellipse cx="-2.6" cy="-3.5" rx="2" ry="3.2" transform="rotate(-45 -2.6 -3.5)" />
      <ellipse cx="2.4" cy="-9" rx="1.8" ry="2.6" />
    </g>
  ),
};

type Props = {
  product: Product;
  className?: string;
  /** 隣に商品名がある一覧・サムネイルでは true にして読み上げを省く */
  decorative?: boolean;
};

export function ProductVisual({ product, className, decorative = false }: Props) {
  const { visual } = product;
  // 同じページに複数並ぶため、紙の質感フィルタの id はインスタンスごとに分ける
  const paperId = `paper${useId().replace(/:/g, '')}`;
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundColor: visual.from }}
    >
      <svg
        viewBox="0 0 240 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role={decorative ? undefined : 'img'}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : `${product.name}のパッケージイメージ`}
      >
        <defs>
          <filter id={paperId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.2  0 0 0 0.1 0" />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
        <ellipse cx="120" cy="252" rx="66" ry="7" fill="#000" opacity="0.12" />
        {SHAPES[visual.shape](visual)}
        <Label shape={visual.shape} visual={visual} nameEn={product.nameEn} paperId={paperId} />
      </svg>
    </div>
  );
}

const SHAPES: Record<PackageShape, (v: Visual) => ReactNode> = {
  bag: (v) => (
    <g>
      <path d="M68 84 L172 84 L180 250 L60 250 Z" fill={v.ink} />
      <path d="M68 84 L172 84 L180 250 L150 250 Z" fill="#fff" opacity="0.05" />
      <rect x="66" y="62" width="108" height="24" rx="2" fill={v.ink} />
      <rect x="66" y="62" width="108" height="24" rx="2" fill="#000" opacity="0.18" />
      <rect x="66" y="71" width="108" height="3" fill={v.accent} opacity="0.7" />
      <circle cx="120" cy="108" r="5" fill="#000" opacity="0.25" />
    </g>
  ),
  tin: (v) => (
    <g>
      <rect x="78" y="100" width="84" height="150" fill={v.ink} />
      <rect x="140" y="100" width="22" height="150" fill="#fff" opacity="0.07" />
      <ellipse cx="120" cy="250" rx="42" ry="7" fill={v.ink} />
      <rect x="75" y="80" width="90" height="26" rx="2" fill={v.ink} />
      <rect x="75" y="80" width="90" height="26" rx="2" fill="#000" opacity="0.22" />
      <ellipse cx="120" cy="80" rx="45" ry="8" fill={v.accent} opacity="0.9" />
    </g>
  ),
  jar: (v) => (
    <g>
      <rect x="72" y="108" width="96" height="142" rx="18" fill="#fff" opacity="0.45" />
      <rect x="78" y="140" width="84" height="104" rx="14" fill={v.accent} />
      <circle cx="96" cy="160" r="4" fill={v.ink} opacity="0.35" />
      <circle cx="140" cy="232" r="5" fill={v.ink} opacity="0.3" />
      <circle cx="150" cy="150" r="3" fill={v.ink} opacity="0.35" />
      <rect x="80" y="84" width="80" height="28" rx="4" fill={v.ink} />
      <rect x="80" y="96" width="80" height="2" fill="#fff" opacity="0.2" />
      <rect x="84" y="112" width="8" height="128" rx="4" fill="#fff" opacity="0.4" />
    </g>
  ),
  pump: (v) => (
    <g>
      <rect x="82" y="122" width="76" height="128" rx="16" fill={v.ink} />
      <rect x="138" y="128" width="12" height="116" rx="6" fill="#fff" opacity="0.12" />
      <rect x="106" y="100" width="28" height="24" rx="3" fill={v.ink} />
      <rect x="106" y="100" width="28" height="24" rx="3" fill="#000" opacity="0.2" />
      <rect x="115" y="78" width="10" height="24" fill="#2b2b2b" />
      <rect x="100" y="68" width="40" height="12" rx="3" fill="#2b2b2b" />
      <rect x="136" y="70" width="28" height="6" rx="2" fill="#2b2b2b" />
    </g>
  ),
  bottle: (v) => (
    <g>
      <path d="M94 128 Q94 112 108 108 L132 108 Q146 112 146 128 L146 242 Q146 250 138 250 L102 250 Q94 250 94 242 Z" fill={v.ink} />
      <rect x="132" y="120" width="8" height="122" rx="4" fill="#fff" opacity="0.15" />
      <rect x="104" y="66" width="32" height="44" rx="4" fill="#efe9df" />
      <rect x="104" y="66" width="32" height="44" rx="4" fill="#000" opacity="0.06" />
    </g>
  ),
  box: (v) => (
    <g>
      <path d="M70 110 L90 94 L190 94 L170 110 Z" fill={v.ink} />
      <path d="M70 110 L90 94 L190 94 L170 110 Z" fill="#fff" opacity="0.25" />
      <path d="M170 110 L190 94 L190 234 L170 250 Z" fill={v.ink} />
      <path d="M170 110 L190 94 L190 234 L170 250 Z" fill="#000" opacity="0.22" />
      <rect x="70" y="110" width="100" height="140" fill={v.ink} />
      <rect x="70" y="228" width="100" height="22" fill={v.accent} opacity="0.85" />
    </g>
  ),
};

const LABEL_BOX: Record<PackageShape, { x: number; y: number; w: number; h: number }> = {
  bag: { x: 82, y: 136, w: 76, h: 70 },
  tin: { x: 84, y: 144, w: 72, h: 62 },
  jar: { x: 86, y: 162, w: 68, h: 60 },
  pump: { x: 92, y: 150, w: 56, h: 74 },
  bottle: { x: 99, y: 150, w: 42, h: 70 },
  box: { x: 80, y: 128, w: 80, h: 80 },
};

type LabelProps = { shape: PackageShape; visual: Visual; nameEn: string; paperId: string };

function Label({ shape, visual, nameEn, paperId }: LabelProps) {
  const box = LABEL_BOX[shape];
  const cx = box.x + box.w / 2;
  const words = nameEn.split(' ');
  const fontSize = box.w < 50 ? 7 : 9;
  return (
    <g fontFamily="var(--font-headline), sans-serif" textAnchor="middle" fill={visual.ink}>
      {/* ラベルの下にごく淡い影を1段だけ敷き、紙の繊維感をノイズで重ねる */}
      <rect x={box.x + 0.8} y={box.y + 1.4} width={box.w} height={box.h} rx="2" fill="#000" opacity="0.14" />
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="2" fill={LABEL_BG} />
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="2" fill="#000" filter={`url(#${paperId})`} />
      <text x={cx} y={box.y + 14} fontSize="5.5" letterSpacing="2" opacity="0.7">
        MORI
      </text>
      {/* 背景の装飾は置かず、容器とラベルだけで見せる。素材の印はラベルに小さく1つだけ */}
      <g transform={`translate(${cx} ${box.y + 23}) scale(0.62)`}>{MOTIFS[visual.motif](visual.accent)}</g>
      {words.map((w, i) => (
        <text key={w} x={cx} y={box.y + 40 + i * (fontSize + 2)} fontSize={fontSize} fontWeight="600">
          {w}
        </text>
      ))}
    </g>
  );
}
