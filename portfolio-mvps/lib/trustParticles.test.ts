import { describe, expect, it } from "vitest";
import { CORE_R, SHELL_R, SPAWN_R, spawn, step, type Particle } from "./trustParticles";

/** 再現できる乱数（線形合同法） */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

/** 入れ替わるまで進め、入れ替わる直前の半径と hit を返す */
function runUntilRespawn(p: Particle, rand: () => number) {
  let cur = p;
  for (let i = 0; i < 10_000; i++) {
    const { particle, hit } = step(cur, 1 / 60, rand);
    // 半径が増えた = 外側で生まれ直した
    if (particle.r > cur.r) {
      return { lastR: cur.r, hit };
    }
    cur = particle;
  }
  throw new Error("入れ替わらなかった");
}

describe("trustParticles", () => {
  it("向きは単位ベクトル", () => {
    const rand = seeded(7);
    for (let i = 0; i < 100; i++) {
      const [x, y, z] = spawn(rand).dir;
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
    }
  });

  it("allowed は中心まで届き、波紋は出さない", () => {
    const rand = seeded(3);
    const p: Particle = { dir: [0, 0, 1], r: SPAWN_R, speed: 2, kind: "allowed" };
    const { lastR, hit } = runUntilRespawn(p, rand);
    expect(lastR).toBeLessThan(SHELL_R);
    expect(lastR).toBeGreaterThan(CORE_R);
    expect(hit).toBeNull();
  });

  it("blocked は外側のポリシー層で止まり、その位置に波紋を出す", () => {
    const rand = seeded(5);
    const p: Particle = { dir: [1, 0, 0], r: SPAWN_R, speed: 2, kind: "blocked" };
    const { lastR, hit } = runUntilRespawn(p, rand);
    expect(lastR).toBeGreaterThan(SHELL_R);
    expect(hit).toEqual([SHELL_R, 0, 0]);
  });

  it("元の粒を書き換えない", () => {
    const p: Particle = { dir: [0, 1, 0], r: SPAWN_R, speed: 2, kind: "allowed" };
    step(p, 0.5, seeded());
    expect(p.r).toBe(SPAWN_R);
  });

  it("おおむね BLOCKED_RATIO の割合で blocked が生まれる", () => {
    const rand = seeded(11);
    const n = 5000;
    let blocked = 0;
    for (let i = 0; i < n; i++) if (spawn(rand).kind === "blocked") blocked++;
    expect(blocked / n).toBeGreaterThan(0.25);
    expect(blocked / n).toBeLessThan(0.35);
  });
});
