import type * as THREE_NS from "three";
import {
  EXEC_HALF,
  EXEC_X,
  GATE1_X,
  GATE2_X,
  LLM_X,
  SPAWN_X,
  position,
  spawn,
  step,
  type Particle,
  type ParticleKind,
  type Stage,
  type Vec3,
} from "./trustParticles";

type Three = typeof THREE_NS;

/*
 * トップの 3D。JARVIS の構成図をそのまま立体にしたもの。
 * 左から 発話 → 前段ゲート → LLM ルーター → 後段ゲート → 実行 を並べ、発話の粒が右へ流れる。
 * 粒の動きは trustParticles.ts。ゲートは点で描いた円盤、LLM は多面体、実行は箱。
 *
 * 色は tailwind.config.ts の accent（通常）・danger（危険）・caution（言い換え）だけ。
 */
const ACCENT = 0x5ccbff;
const DANGER = 0xff5c7a;
const CAUTION = 0xffb547;
const PARTICLES = 54;
const BURSTS = 14;
const TRAIL = 0.9;
const GATE_R = 1.9;
/** 最初の 1 枚。動きを減らす設定の利用者にはこの時点の静止画を出す */
const WARMUP_SECONDS = 5;

/** 画面上にラベルを重ねる位置（3D 空間の座標）。並び順は HeroScene.tsx のラベルと揃える */
export const ANCHORS: readonly Vec3[] = [
  [SPAWN_X + 0.6, -2.2, 0],
  [GATE1_X, -GATE_R - 0.45, 0],
  [LLM_X, -1.35, 0],
  [GATE2_X, -GATE_R - 0.45, 0],
  [EXEC_X, -1.25, 0],
];

export type ScreenPoint = { readonly x: number; readonly y: number };

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

/** ゲートの円盤。yz 平面上に、ほぼ等間隔に点を置く（ひまわりの種の並び） */
function gateDisc(T: Three, count: number): THREE_NS.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt((i + 0.5) / count) * GATE_R;
    const a = golden * i;
    positions.set([0, Math.cos(a) * r, Math.sin(a) * r], i * 3);
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.BufferAttribute(positions, 3));
  return geo;
}

/** 再現できる乱数。読み込みのたびに同じ流れで始まるよう固定の種を使う */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

export function createHeroScene(
  T: Three,
  canvas: HTMLCanvasElement,
  onAnchors: (points: readonly ScreenPoint[]) => void,
): HeroScene {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(11, 1, 0.1, 800);
  /**
   * 右手前の少し上から見る向き。画角を狭くして遠くから見ることで遠近の歪みを抑え、
   * 2 枚のゲートが同じ大きさの楕円に見えるようにする。距離は resize で縦横比に合わせて決める。
   */
  const viewDir = new T.Vector3(0.55, 0.32, 1).normalize();
  const lookAt = new T.Vector3(-0.3, -0.9, 0);

  const world = new T.Group();
  scene.add(world);

  const dot = dotTexture(T, false);
  const glow = dotTexture(T, true);
  const disposables: { dispose: () => void }[] = [renderer, dot, glow];
  const track = <D extends { dispose: () => void }>(d: D): D => {
    disposables.push(d);
    return d;
  };
  const additive = (params: THREE_NS.PointsMaterialParameters) =>
    track(
      new T.PointsMaterial({
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        ...params,
      }),
    );
  const glowSprite = (color: number, scale: number, opacity: number) => {
    const sprite = new T.Sprite(
      track(
        new T.SpriteMaterial({
          map: glow,
          color,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: T.AdditiveBlending,
        }),
      ),
    );
    sprite.scale.setScalar(scale);
    return sprite;
  };

  // 流れの軸。製図の補助線のように細く薄く引く
  const axisGeo = track(new T.BufferGeometry());
  axisGeo.setAttribute(
    "position",
    new T.BufferAttribute(new Float32Array([SPAWN_X - 0.5, 0, 0, EXEC_X + 1.2, 0, 0]), 3),
  );
  const axis = new T.Line(
    axisGeo,
    track(new T.LineDashedMaterial({ color: 0x5f636b, dashSize: 0.18, gapSize: 0.14 })),
  );
  axis.computeLineDistances();
  world.add(axis);

  // ゲート 2 枚。点の円盤と外周の輪
  const ringGeo = track(new T.RingGeometry(GATE_R, GATE_R + 0.03, 96));
  const discGeo = track(gateDisc(T, 900));
  for (const gx of [GATE1_X, GATE2_X]) {
    const disc = new T.Points(discGeo, additive({ map: dot, color: ACCENT, size: 0.055, opacity: 0.5 }));
    disc.position.x = gx;
    const rim = new T.Mesh(
      ringGeo,
      track(
        new T.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7, side: T.DoubleSide }),
      ),
    );
    rim.position.x = gx;
    rim.rotation.y = Math.PI / 2;
    world.add(disc, rim);
  }

  // LLM ルーター。暗い多面体に稜線、背後に光
  const llmGeo = track(new T.IcosahedronGeometry(0.75, 1));
  const llm = new T.Mesh(llmGeo, track(new T.MeshBasicMaterial({ color: 0x0a1820 })));
  llm.add(
    new T.LineSegments(
      track(new T.EdgesGeometry(llmGeo)),
      track(new T.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8 })),
    ),
  );
  llm.position.x = LLM_X;
  const llmGlow = glowSprite(ACCENT, 3.6, 0.35);
  llmGlow.position.x = LLM_X;
  world.add(llmGlow, llm);

  // 実行。箱の稜線。通常の発話が届くたびに光る
  const execGeo = track(new T.BoxGeometry(EXEC_HALF * 2, EXEC_HALF * 2, EXEC_HALF * 2));
  const exec = new T.Mesh(execGeo, track(new T.MeshBasicMaterial({ color: 0x0b0f14 })));
  exec.add(
    new T.LineSegments(
      track(new T.EdgesGeometry(execGeo)),
      track(new T.LineBasicMaterial({ color: 0xededeb, transparent: true, opacity: 0.75 })),
    ),
  );
  exec.position.x = EXEC_X;
  const execGlow = glowSprite(ACCENT, 3, 0);
  execGlow.position.x = EXEC_X;
  world.add(execGlow, exec);

  // 発話の粒。頭（点）と尾（線分）を頂点色で塗り分ける
  const rand = seeded(20261026);
  const colors: Record<ParticleKind, THREE_NS.Color> = {
    allowed: new T.Color(ACCENT),
    blocked: new T.Color(DANGER),
    evasive: new T.Color(CAUTION),
  };
  let particles: Particle[] = Array.from({ length: PARTICLES }, (_, i) =>
    spawn(rand, (i / PARTICLES) * (EXEC_X - SPAWN_X)),
  );

  const headPos = new Float32Array(PARTICLES * 3);
  const headCol = new Float32Array(PARTICLES * 3);
  const headGeo = track(new T.BufferGeometry());
  headGeo.setAttribute("position", new T.BufferAttribute(headPos, 3));
  headGeo.setAttribute("color", new T.BufferAttribute(headCol, 3));
  world.add(new T.Points(headGeo, additive({ map: dot, size: 0.17, vertexColors: true })));

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

  // ゲートで止まった位置に出す波紋。輪をゲートの面に沿わせ、使い回す
  const burstGeo = track(new T.RingGeometry(0.1, 0.13, 48));
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
    const mesh = new T.Mesh(burstGeo, mat);
    mesh.rotation.y = Math.PI / 2;
    world.add(mesh);
    return { mesh, mat, age: Infinity };
  });
  let nextBurst = 0;
  let execFlash = 0;

  function onHit(at: Vec3, stage: Stage) {
    if (stage === "exec") {
      execFlash = 1;
      return;
    }
    const b = bursts[nextBurst];
    nextBurst = (nextBurst + 1) % BURSTS;
    b.mesh.position.set(at[0], at[1], at[2]);
    b.mat.color.setHex(stage === "gate1" ? DANGER : CAUTION);
    b.age = 0;
  }

  /** 生まれた直後と、実行に吸い込まれる直前を暗くする（端で急に現れたり消えたりしない） */
  function brightness(p: Particle): number {
    const fadeIn = Math.min(1, (p.x - SPAWN_X) / 1.5);
    const fadeOut = p.kind === "allowed" ? Math.min(1, (EXEC_X - EXEC_HALF - p.x) / 0.8 + 0.25) : 1;
    return Math.max(0, Math.min(fadeIn, fadeOut));
  }

  function writeParticles() {
    particles.forEach((p, i) => {
      const c = colors[p.kind];
      const k = brightness(p);
      const [x, y, z] = position(p);
      const [tx, ty, tz] = position({ ...p, x: p.x - TRAIL });
      headPos.set([x, y, z], i * 3);
      headCol.set([c.r * k, c.g * k, c.b * k], i * 3);
      trailPos.set([x, y, z, tx, ty, tz], i * 6);
      trailCol.set([c.r * k * 0.7, c.g * k * 0.7, c.b * k * 0.7, 0, 0, 0], i * 6);
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
      if (hit) onHit(hit.at, hit.stage);
      return particle;
    });
    writeParticles();

    for (const b of bursts) {
      if (b.age === Infinity) continue;
      b.age += dt;
      const life = b.age / 0.8;
      if (life >= 1) {
        b.age = Infinity;
        b.mat.opacity = 0;
        continue;
      }
      b.mesh.scale.setScalar(1 + life * 3);
      b.mat.opacity = (1 - life) ** 2 * 0.9;
    }

    execFlash = Math.max(0, execFlash - dt * 2.5);
    execGlow.material.opacity = execFlash * 0.45;
    llm.rotation.set(elapsed * 0.2, elapsed * 0.3, 0);
    llmGlow.material.opacity = 0.32 + Math.sin(elapsed * 1.4) * 0.05;

    // マウスの位置へ少しだけ回す（追従は緩やかに）
    const ease = Math.min(1, dt * 3);
    world.rotation.y += (pointer.x * 0.14 - world.rotation.y) * ease;
    world.rotation.x += (pointer.y * 0.06 - world.rotation.x) * ease;
  }

  // ラベルの位置。3D の座標を画面の座標へ写して呼び出し側へ渡す
  const anchorVec = new T.Vector3();
  let size = { width: 1, height: 1 };
  function render() {
    renderer.render(scene, camera);
    onAnchors(
      ANCHORS.map(([x, y, z]) => {
        anchorVec.set(x, y, z).applyMatrix4(world.matrixWorld).project(camera);
        return {
          x: ((anchorVec.x + 1) / 2) * size.width,
          y: ((1 - anchorVec.y) / 2) * size.height,
        };
      }),
    );
  }

  let raf = 0;
  let last = 0;
  function frame(now: number) {
    // タブ復帰直後などに大きく飛ばないよう、1 コマの時間に上限を設ける
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
    last = now;
    advance(dt);
    render();
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
    renderStatic: render,
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    resize(width, height) {
      if (!width || !height) return;
      size = { width, height };
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // 横幅（発話〜実行の約 17）と高さ（ゲートの円盤の約 5）の両方が収まる距離まで引く
      const halfV = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      const fitWidth = 9.6 / (halfV * camera.aspect);
      const fitHeight = 3.1 / halfV;
      const distance = Math.max(fitWidth, fitHeight);
      camera.position.copy(lookAt).addScaledVector(viewDir, distance);
      camera.lookAt(lookAt);
      camera.updateProjectionMatrix();
      world.updateMatrixWorld();
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      disposables.forEach((d) => d.dispose());
    },
  };
}
