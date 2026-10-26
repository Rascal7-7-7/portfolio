import type * as THREE_NS from "three";
import {
  CORE_R,
  SHELL_R,
  SPAWN_R,
  spawn,
  step,
  type Particle,
  type Vec3,
} from "./trustParticles";

type Three = typeof THREE_NS;

/*
 * トップの 3D。中心の LLM（核）を、光の点でできた 2 枚のポリシー層が包む。
 * 外から飛んでくる入力の粒のうち、通常の入力（空色）は核まで届き、
 * 注入された命令（赤）は外側の層で止まって波紋を出す。粒の動きは trustParticles.ts。
 *
 * 色は tailwind.config.ts の accent と、注入を表す赤だけ。
 */
const ACCENT = 0x5ccbff;
const DANGER = 0xff5c7a;
const PARTICLES = 46;
const BURSTS = 10;
const TRAIL = 0.7;
/** 最初の 1 枚。動きを減らす設定の利用者にはこの時点の静止画を出す */
const WARMUP_SECONDS = 4;

export type HeroScene = {
  start: () => void;
  stop: () => void;
  renderStatic: () => void;
  setPointer: (x: number, y: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

/** 点を丸く描くための小さな放射状テクスチャ */
function dotTexture(T: Three, soft: boolean): THREE_NS.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(soft ? 0.25 : 0.5, soft ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new T.CanvasTexture(canvas);
}

/** 球面にほぼ等間隔で点を置く（フィボナッチ格子） */
function sphereShell(T: Three, radius: number, count: number): THREE_NS.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const s = Math.sqrt(1 - y * y);
    const a = golden * i;
    positions.set([Math.cos(a) * s * radius, y * radius, Math.sin(a) * s * radius], i * 3);
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.BufferAttribute(positions, 3));
  return geo;
}

function additive(T: Three, params: THREE_NS.PointsMaterialParameters): THREE_NS.PointsMaterial {
  return new T.PointsMaterial({
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    ...params,
  });
}

/** 再現できる乱数。サーバーとブラウザで見た目が変わらないよう固定の種を使う */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

export function createHeroScene(T: Three, canvas: HTMLCanvasElement): HeroScene {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 13);

  const world = new T.Group();
  scene.add(world);

  const dot = dotTexture(T, false);
  const glow = dotTexture(T, true);
  const disposables: { dispose: () => void }[] = [renderer, dot, glow];
  const track = <D extends { dispose: () => void }>(d: D): D => {
    disposables.push(d);
    return d;
  };

  // 核（LLM）。暗い多面体に空色の稜線、背後に柔らかい光
  const coreGeo = track(new T.IcosahedronGeometry(CORE_R, 1));
  const core = new T.Mesh(coreGeo, track(new T.MeshBasicMaterial({ color: 0x0a1820 })));
  const edges = new T.LineSegments(
    track(new T.EdgesGeometry(coreGeo)),
    track(new T.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.85 })),
  );
  core.add(edges);
  const coreGlow = new T.Sprite(
    track(
      new T.SpriteMaterial({
        map: glow,
        color: ACCENT,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: T.AdditiveBlending,
      }),
    ),
  );
  coreGlow.scale.setScalar(5.2);
  world.add(coreGlow, core);

  // ポリシー層 2 枚。外側ほど点を細かく、互いに逆向きに回す
  const outer = new T.Points(
    track(sphereShell(T, SHELL_R, 1400)),
    track(additive(T, { map: dot, color: ACCENT, size: 0.07, opacity: 0.9 })),
  );
  const inner = new T.Points(
    track(sphereShell(T, (SHELL_R + CORE_R) / 2 + 0.1, 520)),
    track(additive(T, { map: dot, color: ACCENT, size: 0.06, opacity: 0.55 })),
  );
  world.add(outer, inner);

  // 入力の粒。頭（点）と尾（線分）を頂点色で塗り分ける
  const rand = seeded(20261026);
  const accent = new T.Color(ACCENT);
  const danger = new T.Color(DANGER);
  let particles: Particle[] = Array.from({ length: PARTICLES }, (_, i) =>
    spawn(rand, (i / PARTICLES) * SPAWN_R),
  );

  const headPos = new Float32Array(PARTICLES * 3);
  const headCol = new Float32Array(PARTICLES * 3);
  const headGeo = track(new T.BufferGeometry());
  headGeo.setAttribute("position", new T.BufferAttribute(headPos, 3));
  headGeo.setAttribute("color", new T.BufferAttribute(headCol, 3));
  world.add(
    new T.Points(headGeo, track(additive(T, { map: dot, size: 0.16, vertexColors: true }))),
  );

  const trailPos = new Float32Array(PARTICLES * 6);
  const trailCol = new Float32Array(PARTICLES * 6);
  const trailGeo = track(new T.BufferGeometry());
  trailGeo.setAttribute("position", new T.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute("color", new T.BufferAttribute(trailCol, 3));
  world.add(
    new T.LineSegments(
      trailGeo,
      track(
        new T.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: T.AdditiveBlending,
        }),
      ),
    ),
  );

  // 注入が止まった位置に出す波紋。使い回しの輪を順番に使う
  const ringGeo = track(new T.RingGeometry(0.1, 0.125, 48));
  const bursts = Array.from({ length: BURSTS }, () => {
    const mat = track(
      new T.MeshBasicMaterial({
        color: DANGER,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: T.DoubleSide,
        blending: T.AdditiveBlending,
      }),
    );
    const mesh = new T.Mesh(ringGeo, mat);
    world.add(mesh);
    return { mesh, mat, age: Infinity };
  });
  let nextBurst = 0;

  function fireBurst(at: Vec3) {
    const b = bursts[nextBurst];
    nextBurst = (nextBurst + 1) % BURSTS;
    b.mesh.position.set(at[0], at[1], at[2]);
    // 輪を層の接平面に寝かせる（法線 = 中心からの向き）
    b.mesh.lookAt(at[0] * 2, at[1] * 2, at[2] * 2);
    b.age = 0;
  }

  /** 中心に近づくほど、また生まれた直後ほど暗くする（端で急に現れたり消えたりしない） */
  function brightness(p: Particle): number {
    const fadeIn = Math.min(1, (SPAWN_R - p.r) / 1.2);
    const fadeOut = p.kind === "allowed" ? Math.min(1, (p.r - CORE_R) / 1.2) : 1;
    return Math.max(0, Math.min(fadeIn, fadeOut));
  }

  function writeParticles() {
    particles.forEach((p, i) => {
      const c = p.kind === "allowed" ? accent : danger;
      const k = brightness(p);
      const [dx, dy, dz] = p.dir;
      headPos.set([dx * p.r, dy * p.r, dz * p.r], i * 3);
      headCol.set([c.r * k, c.g * k, c.b * k], i * 3);
      const tail = p.r + TRAIL;
      trailPos.set([dx * p.r, dy * p.r, dz * p.r, dx * tail, dy * tail, dz * tail], i * 6);
      trailCol.set([c.r * k * 0.8, c.g * k * 0.8, c.b * k * 0.8, 0, 0, 0], i * 6);
    });
    headGeo.attributes.position.needsUpdate = true;
    headGeo.attributes.color.needsUpdate = true;
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
  }

  const pointer = { x: 0, y: 0 };
  let elapsed = 0;

  function advance(dt: number) {
    elapsed += dt;
    particles = particles.map((p) => {
      const { particle, hit } = step(p, dt, rand);
      if (hit) fireBurst(hit);
      return particle;
    });
    writeParticles();

    for (const b of bursts) {
      if (b.age === Infinity) continue;
      b.age += dt;
      const life = b.age / 0.9;
      if (life >= 1) {
        b.age = Infinity;
        b.mat.opacity = 0;
        continue;
      }
      b.mesh.scale.setScalar(1 + life * 2.5);
      b.mat.opacity = (1 - life) ** 2 * 0.8;
    }

    outer.rotation.y = elapsed * 0.06;
    inner.rotation.y = -elapsed * 0.09;
    core.rotation.set(elapsed * 0.15, elapsed * 0.22, 0);
    coreGlow.material.opacity = 0.5 + Math.sin(elapsed * 1.6) * 0.06;

    // マウスの位置へ少しだけ傾ける（追従は緩やかに）
    world.rotation.x += (pointer.y * 0.35 + 0.18 - world.rotation.x) * Math.min(1, dt * 3);
    world.rotation.y += (pointer.x * 0.5 - world.rotation.y) * Math.min(1, dt * 3);
  }

  let raf = 0;
  let last = 0;
  function frame(now: number) {
    // タブ復帰直後などに大きく飛ばないよう、1 コマの時間に上限を設ける
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    advance(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  // 粒が出そろった状態から始める
  for (let t = 0; t < WARMUP_SECONDS; t += 1 / 60) advance(1 / 60);

  return {
    start() {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    renderStatic() {
      renderer.render(scene, camera);
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    resize(width, height) {
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // 縦長の枠では横にはみ出さないよう全体を小さくする
      world.scale.setScalar(Math.min(1, (width / height) * 1.15));
      camera.updateProjectionMatrix();
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      disposables.forEach((d) => d.dispose());
    },
  };
}
