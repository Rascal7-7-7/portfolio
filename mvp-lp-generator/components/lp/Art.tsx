import { cx } from '@/lib/cx'
import type { CategoryKey } from '@/lib/types'

// 写真が無くても成立するよう、業種ごとの線画（viewBox 200x200・currentColor の線のみ）
const LINE_ART: Record<CategoryKey, readonly string[]> = {
  cafe: [
    'M58 88H142V110C142 134 124 150 100 150C76 150 58 134 58 110Z',
    'M142 98C164 96 166 128 140 126',
    'M40 158C60 166 140 166 160 158',
    'M84 74C76 64 92 56 84 44',
    'M102 74C94 62 110 52 102 38',
    'M120 74C112 64 128 56 120 44',
    'M66 100H134',
  ],
  salon: [
    'M64 150a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z',
    'M100 150a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z',
    'M90 136L132 40Q136 34 136 44L104 128',
    'M110 136L68 40Q64 34 64 44L96 128',
    'M157 58l3 9 9 3-9 3-3 9-3-9-9-3 9-3Z',
    'M40 92l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z',
  ],
  seitai: [
    'M56 164C86 136 112 100 132 36',
    'M90 128C70 128 56 114 52 96C72 96 86 108 90 128Z',
    'M108 98C124 90 140 94 152 106C136 116 120 114 108 98Z',
    'M122 66C108 58 102 44 104 30C118 38 124 52 122 66Z',
    'M44 52a16 16 0 1 0 32 0a16 16 0 1 0 -32 0Z',
  ],
  other: [
    'M44 82L56 56H144L156 82Z',
    'M44 82q14 16 28 0q14 16 28 0q14 16 28 0q14 16 28 0',
    'M56 92V152H144V92',
    'M88 152V114H112V152',
    'M64 104H80V120H64Z',
    'M120 104H136V120H120Z',
    'M34 152H166',
  ],
}

export function LineArt({ category, className }: { category: CategoryKey; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {LINE_ART[category].map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

/** 同心円の幾何学パターン。線画の背景に敷いて「余白が寂しい」状態を避ける */
export function Rings({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" fill="none" stroke="currentColor" className={cx('pointer-events-none', className)}>
      {[30, 52, 74, 96, 118, 140].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
