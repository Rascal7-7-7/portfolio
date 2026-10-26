import { describe, expect, it } from "vitest";
import {
  EXEC_HALF,
  EXEC_X,
  GATE1_X,
  GATE2_X,
  LLM_X,
  funnel,
  spawn,
  step,
  type Particle,
  type Stage,
} from "./trustParticles";

/** 再現できる乱数（線形合同法） */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

/** 入れ替わるまで進め、入れ替わる直前の x と hit を返す */
function runUntilRespawn(p: Particle, rand: () => number) {
  let cur = p;
  for (let i = 0; i < 10_000; i++) {
    const { particle, hit } = step(cur, 1 / 60, rand);
    if (hit) return { lastX: cur.x, stage: hit.stage as Stage, atX: hit.at[0] };
    cur = particle;
  }
  throw new Error("入れ替わらなかった");
}

const base = { x: -8, offset: [0.5, 0.5] as const, speed: 3 };

describe("trustParticles", () => {
  it("通常の発話は実行まで届く", () => {
    const r = runUntilRespawn({ ...base, kind: "allowed" }, seeded(3));
    expect(r.stage).toBe("exec");
    expect(r.lastX).toBeGreaterThan(GATE2_X);
    expect(r.atX).toBe(EXEC_X - EXEC_HALF);
  });

  it("危険な発話は前段ゲートで止まる", () => {
    const r = runUntilRespawn({ ...base, kind: "blocked" }, seeded(5));
    expect(r.stage).toBe("gate1");
    expect(r.atX).toBe(GATE1_X);
    expect(r.lastX).toBeLessThan(GATE1_X);
  });

  it("言い換えた危険な発話は前段を越え、後段ゲートで止まる", () => {
    const r = runUntilRespawn({ ...base, kind: "evasive" }, seeded(7));
    expect(r.stage).toBe("gate2");
    expect(r.lastX).toBeGreaterThan(GATE1_X);
    expect(r.atX).toBe(GATE2_X);
  });

  it("流れは LLM の位置で最も細く、両端では元の太さ", () => {
    expect(funnel(LLM_X)).toBeCloseTo(0.3);
    expect(funnel(-8)).toBeCloseTo(1);
    expect(funnel(EXEC_X)).toBeCloseTo(1);
    expect(funnel(GATE1_X)).toBeLessThan(1);
  });

  it("元の粒を書き換えない", () => {
    const p: Particle = { ...base, kind: "allowed" };
    step(p, 0.5, seeded());
    expect(p.x).toBe(-8);
  });

  it("3種類がおおむね決めた割合で生まれる", () => {
    const rand = seeded(11);
    const n = 6000;
    const count = { allowed: 0, blocked: 0, evasive: 0 };
    for (let i = 0; i < n; i++) count[spawn(rand).kind]++;
    expect(count.blocked / n).toBeGreaterThan(0.2);
    expect(count.blocked / n).toBeLessThan(0.3);
    expect(count.evasive / n).toBeGreaterThan(0.08);
    expect(count.evasive / n).toBeLessThan(0.16);
  });
});
