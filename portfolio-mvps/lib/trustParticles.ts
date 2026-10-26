/**
 * トップの 3D で飛ぶ「入力」の粒の動き。three.js に依存しない純粋な計算だけを置く。
 *
 * - allowed（通常の入力）: 外から飛んできて、ポリシー層を抜け、中心の LLM まで届く
 * - blocked（注入された命令）: 外側のポリシー層で止まり、そこで散る
 *
 * JARVIS の「LLM の判断を信頼境界にしない（決定的なポリシー層で止める）」を図にしたもの。
 */

export type Vec3 = readonly [number, number, number];
export type ParticleKind = "allowed" | "blocked";

export type Particle = {
  readonly dir: Vec3;
  readonly r: number;
  readonly speed: number;
  readonly kind: ParticleKind;
};

/** 粒が生まれる半径 */
export const SPAWN_R = 7;
/** 中心の LLM の半径。allowed はここで消える */
export const CORE_R = 0.95;
/** 外側のポリシー層の半径。blocked はここで止まる */
export const SHELL_R = 2.6;
/** 注入された命令の割合 */
export const BLOCKED_RATIO = 0.3;

export function stopRadius(kind: ParticleKind): number {
  return kind === "allowed" ? CORE_R : SHELL_R;
}

/** 球面上で偏りのない向き（z を一様に取り、方位角を回す） */
function randomDir(rand: () => number): Vec3 {
  const z = rand() * 2 - 1;
  const phi = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(phi), s * Math.sin(phi), z];
}

/** offset は生まれる位置を外側へずらす量。最初に全粒が同時に飛び込むのを避けるために使う */
export function spawn(rand: () => number, offset = 0): Particle {
  return {
    dir: randomDir(rand),
    r: SPAWN_R + offset,
    speed: 1.6 + rand() * 1.4,
    kind: rand() < BLOCKED_RATIO ? "blocked" : "allowed",
  };
}

/**
 * dt 秒進める。止まる半径に着いたら新しい粒に入れ替え、
 * blocked だった場合は止まった位置を hit として返す（そこに波紋を出す）。
 */
export function step(
  p: Particle,
  dt: number,
  rand: () => number,
): { particle: Particle; hit: Vec3 | null } {
  const r = p.r - p.speed * dt;
  const stop = stopRadius(p.kind);
  if (r > stop) return { particle: { ...p, r }, hit: null };

  const hit: Vec3 | null =
    p.kind === "blocked" ? [p.dir[0] * stop, p.dir[1] * stop, p.dir[2] * stop] : null;
  return { particle: spawn(rand), hit };
}
