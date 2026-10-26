/**
 * トップの 3D で流れる「発話」の粒の動き。three.js に依存しない純粋な計算だけを置く。
 *
 * JARVIS の構成（発話 → 前段ゲート → LLM ルーター → 後段ゲート → 実行）を左から右へ並べ、
 * 粒は x 軸に沿って右へ進む。
 * - allowed（通常の発話）: 実行まで届く
 * - blocked（危険な発話）: 前段ゲート（発話のキーワード照合）で止まる
 * - evasive（言い換えた危険な発話）: 前段をすり抜けうるため、後段ゲート（コマンドの拒否リスト）で止める
 *
 * どちらのゲートも照合式で完全ではない。図はその設計意図を示すもので、計測値ではない。
 */

export type Vec3 = readonly [number, number, number];
export type ParticleKind = "allowed" | "blocked" | "evasive";
export type Stage = "gate1" | "gate2" | "exec";

export type Particle = {
  readonly x: number;
  /** 流れの軸からのずれ（y, z）。LLM の前後で絞り込む */
  readonly offset: readonly [number, number];
  readonly speed: number;
  readonly kind: ParticleKind;
};

/** 各段の x 座標 */
export const SPAWN_X = -8;
export const GATE1_X = -3.2;
export const LLM_X = 0;
export const GATE2_X = 3.2;
export const EXEC_X = 6.4;
/** 実行の箱の半分の大きさ。allowed はこの手前で消える */
export const EXEC_HALF = 0.6;

/** 粒の種類の割合（残りが allowed） */
export const BLOCKED_RATIO = 0.25;
export const EVASIVE_RATIO = 0.12;

export function stopX(kind: ParticleKind): number {
  if (kind === "blocked") return GATE1_X;
  if (kind === "evasive") return GATE2_X;
  return EXEC_X - EXEC_HALF;
}

function stageOf(kind: ParticleKind): Stage {
  if (kind === "blocked") return "gate1";
  if (kind === "evasive") return "gate2";
  return "exec";
}

/**
 * 流れの太さの倍率。両端で 1、LLM の位置で 0.3 まで絞る（ルーターに集まって見えるように）。
 */
export function funnel(x: number): number {
  const d = Math.min(1, Math.abs(x - LLM_X) / 4);
  return 0.3 + 0.7 * d * d * (3 - 2 * d);
}

export function position(p: Particle): Vec3 {
  const k = funnel(p.x);
  return [p.x, p.offset[0] * k, p.offset[1] * k];
}

/** offset は生まれる位置を左へずらす量。最初に全粒が同時に流れ込むのを避けるために使う */
export function spawn(rand: () => number, offset = 0): Particle {
  const r = Math.sqrt(rand()) * 1.5;
  const a = rand() * Math.PI * 2;
  const roll = rand();
  const kind: ParticleKind =
    roll < BLOCKED_RATIO ? "blocked" : roll < BLOCKED_RATIO + EVASIVE_RATIO ? "evasive" : "allowed";
  return {
    x: SPAWN_X - offset,
    offset: [Math.cos(a) * r, Math.sin(a) * r],
    speed: 2.2 + rand() * 1.6,
    kind,
  };
}

/**
 * dt 秒進める。止まる位置に着いたら新しい粒に入れ替え、着いた位置と段を hit として返す
 * （ゲートでは波紋、実行では光を出す）。
 */
export function step(
  p: Particle,
  dt: number,
  rand: () => number,
): { particle: Particle; hit: { at: Vec3; stage: Stage } | null } {
  const x = p.x + p.speed * dt;
  const stop = stopX(p.kind);
  if (x < stop) return { particle: { ...p, x }, hit: null };

  const at = position({ ...p, x: stop });
  return { particle: spawn(rand), hit: { at, stage: stageOf(p.kind) } };
}
