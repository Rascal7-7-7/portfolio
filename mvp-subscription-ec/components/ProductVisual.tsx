// 外部画像を使わず、商品ごとの配色とパッケージ形状をインライン SVG で描く。
import type { ReactNode } from 'react';
import type { PackageShape, Product, Visual } from '@/lib/types';
import { cn } from '@/lib/cn';

const LABEL_BG = '#f8f4ea';

type Props = {
  product: Product;
  className?: string;
  /** 隣に商品名がある一覧・サムネイルでは true にして読み上げを省く */
  decorative?: boolean;
};

export function ProductVisual({ product, className, decorative = false }: Props) {
  const { visual } = product;
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundImage: `linear-gradient(150deg, ${visual.from} 0%, ${visual.to} 100%)` }}
    >
      <svg
        viewBox="0 0 240 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role={decorative ? undefined : 'img'}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : `${product.name}のパッケージイメージ`}
      >
        <circle cx="186" cy="66" r="58" fill={visual.accent} opacity="0.35" />
        <path d="M18 262 C 30 200, 80 180, 104 196 C 82 214, 52 238, 18 262 Z" fill={visual.ink} opacity="0.1" />
        <path d="M18 262 L 96 200" stroke={visual.ink} strokeOpacity="0.14" strokeWidth="1.5" fill="none" />
        <ellipse cx="120" cy="252" rx="66" ry="7" fill="#000" opacity="0.12" />
        {SHAPES[visual.shape](visual)}
        <Label shape={visual.shape} visual={visual} nameEn={product.nameEn} />
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

function Label({ shape, visual, nameEn }: { shape: PackageShape; visual: Visual; nameEn: string }) {
  const box = LABEL_BOX[shape];
  const cx = box.x + box.w / 2;
  const words = nameEn.split(' ');
  const fontSize = box.w < 50 ? 7 : 9;
  return (
    <g fontFamily="var(--font-headline), sans-serif" textAnchor="middle" fill={visual.ink}>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="2" fill={LABEL_BG} />
      <text x={cx} y={box.y + 14} fontSize="5.5" letterSpacing="2" opacity="0.7">
        MORI
      </text>
      <path
        d={`M${cx - 6} ${box.y + 24} Q ${cx} ${box.y + 16} ${cx + 6} ${box.y + 24} Q ${cx} ${box.y + 30} ${cx - 6} ${box.y + 24} Z`}
        fill={visual.accent}
      />
      {words.map((w, i) => (
        <text key={w} x={cx} y={box.y + 40 + i * (fontSize + 2)} fontSize={fontSize} fontWeight="600">
          {w}
        </text>
      ))}
    </g>
  );
}
