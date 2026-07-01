'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import * as CANNON from 'cannon-es';

/*
 * 3Dサイコロの物理演算描画。
 *
 * 【方針】
 * - サイコロは cannon-es の Box 剛体としてトレイ内を自然に転がる（重力・跳ね返り・回転・摩擦）。
 * - 出目は上位（useDice）で確定済み。物理が静止したら「上を向いた面」を検出し、
 *   その面に結果を描画してから、ほんの少しだけ姿勢を整える（自然な着地に見せる）。
 *   仕上がり時に onSettled を呼び、呼び出し側が合計をポップアップ表示する。
 * - キャンバス内の色は描画用途のためトークン対象外（STYLEGUIDE 例外）。
 *
 * 【面のスタイル】
 * - 面数が 6 以下のサイコロ（d2〜d6）は全面をドット目（オーソドックスな白サイコロ）。
 * - 面数が 7 以上（d8/d10/d12/d20/d100 等）は全面を数字。
 *   ＝1つのサイコロ内でドットと数字が混在しない。
 */

interface DiceCanvasProps {
  /** 各サイコロの確定した出目 */
  values: number[];
  /** 面数（d2〜d100）。6以下ならドット、7以上なら数字。 */
  sides: number;
  /** roll ごとに変化。変わるたびに振り直す */
  rollKey: number;
  /** 転がりが収まって結果面が見えたときに呼ぶ */
  onSettled: () => void;
}

const DIE_SIZE = 1.85;
const TRAY_HALF = 4.7;
const TUMBLE_CAP_MS = 1400; // これを超えたら整え動作に移る（自然停止が先なら早まる）
const PRESENT_MS = 420;      // 上面を水平に整える補間時間

// 濃色トレイの配色（描画色＝トークン対象外）。白サイコロを浮かび上がらせる。
const TRAY_BG    = 0x26262b; // 背景（濃いチャコール）
const TRAY_FLOOR = 0x33333a; // 床（背景より少し明るく＝接地影が見える）

// オーソドックスな白サイコロの配色（描画色＝トークン対象外）。
const DIE_BODY   = '#f5f3ee'; // アイボリー寄りの白
const DIE_HI     = '#fdfcf8'; // 面中央のハイライト
const DIE_LO     = '#e7e4db'; // 面フチのわずかな陰り
const PIP_DARK   = '#1b1b1f'; // 黒目
const PIP_DARK_HI= '#3c3c44';
const PIP_ONE    = '#c8322b'; // 「1」の目だけ赤（和風のオーソドックス）
const PIP_ONE_HI = '#e0574e';

// 目の配置（3×3グリッドの正規化座標）。
const G = {
  TL: [0.26, 0.26], TC: [0.5, 0.26], TR: [0.74, 0.26],
  ML: [0.26, 0.5],  MC: [0.5, 0.5],  MR: [0.74, 0.5],
  BL: [0.26, 0.74], BC: [0.5, 0.74], BR: [0.74, 0.74],
} as const;
const PIP_LAYOUT: Record<number, (readonly [number, number])[]> = {
  1: [G.MC],
  2: [G.TL, G.BR],
  3: [G.TL, G.MC, G.BR],
  4: [G.TL, G.TR, G.BL, G.BR],
  5: [G.TL, G.TR, G.MC, G.BL, G.BR],
  6: [G.TL, G.TR, G.ML, G.MR, G.BL, G.BR],
};

/**
 * 1つの面のテクスチャを生成。
 * pips=true ならドット目（1〜6）、false なら数字。中央ハイライトの陰影で
 * 立方体でも“角の丸い”サイコロらしい質感を出す。
 */
function faceTexture(value: number, pips: boolean): THREE.CanvasTexture {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;

  // 面地：中央を明るく、フチをわずかに暗くして丸みを演出
  const vg = ctx.createRadialGradient(S * 0.5, S * 0.42, S * 0.08, S * 0.5, S * 0.5, S * 0.72);
  vg.addColorStop(0, DIE_HI);
  vg.addColorStop(0.55, DIE_BODY);
  vg.addColorStop(1, DIE_LO);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, S, S);

  const drawPip = (cx: number, cy: number, r: number, dark: boolean) => {
    // 立体的なくぼみ風のドット（左上をやや明るく）
    const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, dark ? PIP_DARK_HI : PIP_ONE_HI);
    g.addColorStop(1, dark ? PIP_DARK : PIP_ONE);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  if (pips) {
    const layout = PIP_LAYOUT[value] ?? PIP_LAYOUT[6];
    const isOne = value === 1;
    const r = isOne ? S * 0.135 : S * 0.098;
    for (const [nx, ny] of layout) drawPip(nx * S, ny * S, r, !isOne);
  } else {
    const label = String(value);
    ctx.fillStyle = PIP_DARK;
    ctx.font = `700 ${value >= 100 ? 108 : value >= 10 ? 128 : 150}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillText(label, S / 2, S / 2 + 6);
    ctx.shadowColor = 'transparent';
    // 6・9 は向き識別の下線
    if (value === 6 || value === 9) {
      ctx.fillRect(S / 2 - 34, S * 0.5 + 66, 68, 9);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** 6面ぶんのダミー値。d6 は本物同様 1〜6、それ以外は範囲内でランダム。 */
function faceValues(sides: number): number[] {
  if (sides === 6) {
    const a = [1, 2, 3, 4, 5, 6];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * sides) + 1);
}

// BoxGeometry のマテリアル順に対応する各面の法線（+X,-X,+Y,-Y,+Z,-Z）。
const FACE_NORMALS = [
  new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
];

interface Die {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  result: number;
  pips: boolean;
  targetQuat: THREE.Quaternion | null;
}

export function DiceCanvas({ values, sides, rollKey, onSettled }: DiceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 最新の props を参照するための ref（アニメーションループ内で使う）。
  const propsRef = useRef({ values, sides, onSettled });
  useEffect(() => {
    propsRef.current = { values, sides, onSettled };
  });

  const sceneRef = useRef<{ throwDice: (values: number[], sides: number) => void } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 320;

    // ── three ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 11, 7);
    camera.lookAt(0, 0, 0.35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // スタジオ風の環境光（白サイコロに柔らかな反射を与えて質感を出す）
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const hemi = new THREE.HemisphereLight(0xffffff, 0xb8bac0, 0.45);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(5.5, 13, 6.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 7;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 8;
    key.shadow.camera.bottom = -8;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.25);
    rim.position.set(-6, 6, -6);
    scene.add(rim);

    // 濃色トレイ背景＋やや明るい床。白サイコロが背景から浮き、接地影も見える。
    scene.background = new THREE.Color(TRAY_BG);
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: TRAY_FLOOR, roughness: 1, metalness: 0 }),
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ── cannon ─────────────────────────────────────────
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -38, 0) });
    world.allowSleep = true;
    world.defaultContactMaterial.friction = 0.4;

    const dieMat = new CANNON.Material('die');
    const groundMat = new CANNON.Material('ground');
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, groundMat, { friction: 0.4, restitution: 0.32 }));
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, dieMat, { friction: 0.25, restitution: 0.28 }));

    const ground = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    const addWall = (nx: number, nz: number, px: number, pz: number) => {
      const w = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
      w.quaternion.setFromEuler(0, Math.atan2(nx, nz), 0);
      w.position.set(px, 0, pz);
      world.addBody(w);
    };
    addWall(0, 1, 0, -TRAY_HALF);
    addWall(0, -1, 0, TRAY_HALF);
    addWall(1, 0, -TRAY_HALF, 0);
    addWall(-1, 0, TRAY_HALF, 0);

    const dice: Die[] = [];
    const disposeTextures: THREE.Texture[] = [];
    const dieGeo = new THREE.BoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE);

    let phase: 'tumble' | 'present' | 'done' = 'done';
    let phaseStart = 0;
    let settledCalled = true;
    const presentFrom: THREE.Quaternion[] = [];
    const presentPos: THREE.Vector3[] = [];
    const presentPosFrom: THREE.Vector3[] = [];

    const clearDice = () => {
      for (const d of dice) {
        scene.remove(d.mesh);
        (d.mesh.material as THREE.Material[]).forEach((m) => m.dispose());
        world.removeBody(d.body);
      }
      dice.length = 0;
      for (const t of disposeTextures) t.dispose();
      disposeTextures.length = 0;
    };

    const throwDice = (vals: number[], sd: number) => {
      clearDice();
      const n = vals.length;
      const pips = sd <= 6;

      vals.forEach((value, i) => {
        const faces = faceValues(sd);
        const materials = faces.map((v) => {
          const tex = faceTexture(v, pips);
          disposeTextures.push(tex);
          return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.34, metalness: 0.02, envMapIntensity: 0.32 });
        });
        const mesh = new THREE.Mesh(dieGeo, materials);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        const body = new CANNON.Body({
          mass: 1,
          material: dieMat,
          shape: new CANNON.Box(new CANNON.Vec3(DIE_SIZE / 2, DIE_SIZE / 2, DIE_SIZE / 2)),
          linearDamping: 0.06,
          angularDamping: 0.1,
          allowSleep: true,
          sleepSpeedLimit: 0.18,
          sleepTimeLimit: 0.25,
        });
        // 投げ入れ：奥・上方から手前へ勢いよく散らし、強めのスピンを与える
        const lane = n > 1 ? (i - (n - 1) / 2) / (n - 1) : 0; // -0.5..0.5
        body.position.set(
          lane * (TRAY_HALF * 1.4) + (Math.random() - 0.5),
          7 + Math.random() * 3,
          -TRAY_HALF + 0.8 + Math.random() * 1.2,
        );
        body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        body.velocity.set((Math.random() - 0.5) * 5, -3, 4.5 + Math.random() * 3);
        body.angularVelocity.set(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
        );
        world.addBody(body);

        dice.push({ mesh, body, result: value, pips, targetQuat: null });
      });

      phase = 'tumble';
      phaseStart = performance.now();
      settledCalled = false;
      if (reduceMotion) beginPresent();
      startLoop();
    };

    // 物理静止後：上を向いた面を検出→結果を描画→その面をぴったり上へ整える。
    const beginPresent = () => {
      phase = 'present';
      phaseStart = performance.now();
      presentFrom.length = 0;
      presentPos.length = 0;
      presentPosFrom.length = 0;
      const up = new THREE.Vector3(0, 1, 0);

      dice.forEach((d) => {
        d.body.sleep();
        const q = d.mesh.quaternion;

        // 上を向いている面を選ぶ
        let best = 2, bestDot = -Infinity;
        for (let f = 0; f < 6; f++) {
          const dot = FACE_NORMALS[f].clone().applyQuaternion(q).dot(up);
          if (dot > bestDot) { bestDot = dot; best = f; }
        }

        // その面に結果を描画（差し替え）
        const mats = d.mesh.material as THREE.MeshStandardMaterial[];
        const oldMap = mats[best].map;
        const tex = faceTexture(d.result, d.pips);
        disposeTextures.push(tex);
        mats[best].map = tex;
        mats[best].needsUpdate = true;
        if (oldMap) oldMap.dispose();

        // 上面を水平にそろえる（最小回転。ほぼ静止済みなので小さな整え）
        const curNormal = FACE_NORMALS[best].clone().applyQuaternion(q);
        const align = new THREE.Quaternion().setFromUnitVectors(curNormal, up);
        d.targetQuat = align.multiply(q.clone());

        presentFrom.push(q.clone());
        presentPosFrom.push(d.mesh.position.clone());
        const x = THREE.MathUtils.clamp(d.body.position.x, -TRAY_HALF + 1, TRAY_HALF - 1);
        const z = THREE.MathUtils.clamp(d.body.position.z, -TRAY_HALF + 1, TRAY_HALF - 1);
        presentPos.push(new THREE.Vector3(x, DIE_SIZE / 2, z));
      });
    };

    // ── ループ（転がり/整え中だけ回す） ─────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;

    const stopLoop = () => {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    const startLoop = () => {
      if (running) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(animate);
    };

    const allAsleep = () => dice.length > 0 && dice.every(
      (d) => d.body.sleepState === CANNON.Body.SLEEPING
        || (d.body.velocity.lengthSquared() < 0.04 && d.body.angularVelocity.lengthSquared() < 0.04),
    );

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 1 / 30);

      if (phase === 'tumble') {
        world.step(1 / 120, dt, 4);
        for (const d of dice) {
          d.mesh.position.copy(d.body.position as unknown as THREE.Vector3);
          d.mesh.quaternion.copy(d.body.quaternion as unknown as THREE.Quaternion);
        }
        if (performance.now() - phaseStart > TUMBLE_CAP_MS || allAsleep()) {
          beginPresent();
        }
      } else if (phase === 'present') {
        const p = Math.min(1, (performance.now() - phaseStart) / PRESENT_MS);
        const e = 1 - Math.pow(1 - p, 3); // ease-out
        dice.forEach((d, i) => {
          if (d.targetQuat) d.mesh.quaternion.slerpQuaternions(presentFrom[i], d.targetQuat, e);
          d.mesh.position.lerpVectors(presentPosFrom[i], presentPos[i], e);
        });
        if (p >= 1) {
          phase = 'done';
          if (!settledCalled) {
            settledCalled = true;
            propsRef.current.onSettled();
          }
        }
      }

      renderer.render(scene, camera);

      if (phase === 'done') { stopLoop(); return; }
      raf = requestAnimationFrame(animate);
    };

    // ── リサイズ ───────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (!running) renderer.render(scene, camera);
    });
    ro.observe(container);

    // タブ復帰時（可視化時）に静止フレームを描き直す（背景タブでの throttling 対策）。
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !running) {
        const w = container.clientWidth || width;
        const h = container.clientHeight || height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
        renderer.render(scene, camera);
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    sceneRef.current = { throwDice };
    throwDice(propsRef.current.values, propsRef.current.sides);

    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', onVisible);
      ro.disconnect();
      clearDice();
      dieGeo.dispose();
      floorMesh.geometry.dispose();
      (floorMesh.material as THREE.Material).dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, []);

  // rollKey が変わるたびに振り直す（初回投擲は上の effect が担当）。
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    sceneRef.current?.throwDice(propsRef.current.values, propsRef.current.sides);
  }, [rollKey]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
