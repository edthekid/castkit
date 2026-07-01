'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as CANNON from 'cannon-es';

/*
 * 3Dサイコロの物理演算描画（世界のアソビ大全風：角丸クリーム白＋赤フェルト）。
 *
 * 【方針】
 * - サイコロ本体は角丸ジオメトリ（RoundedBoxGeometry）。目/数字は各面に貼る
 *   半透明デカール（板）で表現する（＝面ごとに柄を出し分けられる）。
 * - 出目は最初から「上面(+Y)」に配置しておき、転がりが収まったら +Y が上を向くよう
 *   小さくホップしながら整える。テクスチャの差し替えをしないので、
 *   「止まった瞬間に出目が変わる」ことがない。
 * - 面数が6以下はドット目、7以上は数字（1つのサイコロ内で混在しない）。
 * - キャンバス内の色は描画用途のためトークン対象外（STYLEGUIDE 例外）。
 */

interface DiceCanvasProps {
  values: number[];
  sides: number;
  rollKey: number;
  onSettled: () => void;
}

const DIE_SIZE = 1.85;
const DIE_RADIUS = DIE_SIZE * 0.16; // 角丸の半径
const TRAY_HALF = 4.7;
const TUMBLE_CAP_MS = 1600;
const PRESENT_MS = 520;   // 上面を上へ整える（ホップ）時間
const HOP_HEIGHT = 0.7;

// 赤フェルト
const FELT_MID  = '#9c3030';
const FELT_EDGE = '#591616';
// クリーム白サイコロ
const DIE_COLOR   = 0xf1ead9;
const PIP_DARK    = '#141412';
const PIP_DARK_HI = '#3a3a37';
const PIP_ONE     = '#bf2f29';
const PIP_ONE_HI  = '#dc554d';

const G = {
  TL: [0.26, 0.26], TC: [0.5, 0.26], TR: [0.74, 0.26],
  ML: [0.26, 0.5],  MC: [0.5, 0.5],  MR: [0.74, 0.5],
  BL: [0.26, 0.74], BC: [0.5, 0.74], BR: [0.74, 0.74],
} as const;
const PIP_LAYOUT: Record<number, (readonly [number, number])[]> = {
  1: [G.MC], 2: [G.TL, G.BR], 3: [G.TL, G.MC, G.BR],
  4: [G.TL, G.TR, G.BL, G.BR], 5: [G.TL, G.TR, G.MC, G.BL, G.BR],
  6: [G.TL, G.TR, G.ML, G.MR, G.BL, G.BR],
};

/** 面の柄（ドット or 数字）を透明背景で描くデカール用テクスチャ。 */
function markTexture(value: number, pips: boolean): THREE.CanvasTexture {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, S, S);

  const drawPip = (cx: number, cy: number, r: number, dark: boolean) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, dark ? PIP_DARK_HI : PIP_ONE_HI);
    g.addColorStop(1, dark ? PIP_DARK : PIP_ONE);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  if (pips) {
    const layout = PIP_LAYOUT[value] ?? PIP_LAYOUT[6];
    const isOne = value === 1;
    const r = isOne ? S * 0.145 : S * 0.1;
    for (const [nx, ny] of layout) drawPip(nx * S, ny * S, r, !isOne);
  } else {
    ctx.fillStyle = PIP_DARK;
    ctx.font = `700 ${value >= 100 ? 108 : value >= 10 ? 128 : 152}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillText(String(value), S / 2, S / 2 + 6);
    ctx.shadowColor = 'transparent';
    if (value === 6 || value === 9) ctx.fillRect(S / 2 - 34, S * 0.5 + 66, 68, 9);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** 6面の値。index0 = +Y（上面＝結果）。d6以下は本物のダイスらしく配置。 */
function faceVals(result: number, sides: number): number[] {
  if (sides <= 6) {
    const pool = [1, 2, 3, 4, 5, 6].filter((v) => v !== result && v <= sides);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const arr = [result];
    const opp = 7 - result;
    const oi = pool.indexOf(opp);
    if (opp >= 1 && opp <= sides && oi >= 0) { arr[1] = opp; pool.splice(oi, 1); }
    while (arr.length < 6) arr.push(pool.pop() ?? (Math.floor(Math.random() * sides) + 1));
    return arr;
  }
  const arr = [result];
  while (arr.length < 6) arr.push(Math.floor(Math.random() * sides) + 1);
  return arr;
}

// 各面デカールの配置（法線方向 + 面向きの回転）。index0 = +Y（上面）。
const H = DIE_SIZE / 2 + 0.02;
const FACE_SLOTS: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  { pos: [0, H, 0],  rot: [-Math.PI / 2, 0, 0] },       // 0 +Y（結果）
  { pos: [0, -H, 0], rot: [Math.PI / 2, 0, 0] },        // 1 -Y
  { pos: [H, 0, 0],  rot: [0, Math.PI / 2, 0] },        // 2 +X
  { pos: [-H, 0, 0], rot: [0, -Math.PI / 2, 0] },       // 3 -X
  { pos: [0, 0, H],  rot: [0, 0, 0] },                  // 4 +Z
  { pos: [0, 0, -H], rot: [0, Math.PI, 0] },            // 5 -Z
];

interface Die {
  group: THREE.Group;
  body: CANNON.Body;
  decalMats: THREE.MeshStandardMaterial[];
  target: THREE.Quaternion | null;
  fromQ: THREE.Quaternion;
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
}

export function DiceCanvas({ values, sides, rollKey, onSettled }: DiceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef({ values, sides, onSettled });
  useEffect(() => { propsRef.current = { values, sides, onSettled }; });

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
    camera.position.set(0, 12, 8);
    camera.lookAt(0, 0, 0.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const hemi = new THREE.HemisphereLight(0xfff3ea, 0x5a1a1a, 0.4);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1e2, 1.3);
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
    const rim = new THREE.DirectionalLight(0xffe8d8, 0.22);
    rim.position.set(-6, 6, -6);
    scene.add(rim);

    // 赤フェルト（ビネット＋布目）
    const feltC = document.createElement('canvas');
    feltC.width = feltC.height = 512;
    const felt = feltC.getContext('2d')!;
    const fg = felt.createRadialGradient(256, 256, 40, 256, 256, 340);
    fg.addColorStop(0, FELT_MID);
    fg.addColorStop(1, FELT_EDGE);
    felt.fillStyle = fg;
    felt.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 12000; i++) {
      const a = Math.random() * 0.06;
      felt.fillStyle = Math.random() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,235,220,${a * 0.6})`;
      felt.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
    const feltTex = new THREE.CanvasTexture(feltC);
    feltTex.colorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color(FELT_EDGE);
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ map: feltTex, roughness: 0.98, metalness: 0 }),
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ── cannon ─────────────────────────────────────────
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -40, 0) });
    world.allowSleep = true;

    const dieMat = new CANNON.Material('die');
    const groundMat = new CANNON.Material('ground');
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, groundMat, { friction: 0.35, restitution: 0.42 }));
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, dieMat, { friction: 0.2, restitution: 0.35 }));

    const ground = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);
    const addWall = (nx: number, nz: number, px: number, pz: number) => {
      const w = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
      w.quaternion.setFromEuler(0, Math.atan2(nx, nz), 0);
      w.position.set(px, 0, pz);
      world.addBody(w);
    };
    addWall(0, 1, 0, -TRAY_HALF); addWall(0, -1, 0, TRAY_HALF);
    addWall(1, 0, -TRAY_HALF, 0); addWall(-1, 0, TRAY_HALF, 0);

    // 共有リソース
    const bodyGeo = new RoundedBoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE, 5, DIE_RADIUS);
    const bodyMat = new THREE.MeshStandardMaterial({ color: DIE_COLOR, roughness: 0.3, metalness: 0.02, envMapIntensity: 0.6 });
    const decalGeo = new THREE.PlaneGeometry(DIE_SIZE * 0.74, DIE_SIZE * 0.74);

    const dice: Die[] = [];

    let phase: 'tumble' | 'present' | 'done' = 'done';
    let phaseStart = 0;
    let settledCalled = true;

    const clearDice = () => {
      for (const d of dice) {
        scene.remove(d.group);
        d.decalMats.forEach((m) => { m.map?.dispose(); m.dispose(); });
        world.removeBody(d.body);
      }
      dice.length = 0;
    };

    const throwDice = (vals: number[], sd: number) => {
      clearDice();
      const n = vals.length;
      const pips = sd <= 6;

      vals.forEach((value, i) => {
        const group = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        const fv = faceVals(value, sd);
        const decalMats: THREE.MeshStandardMaterial[] = [];
        FACE_SLOTS.forEach((slot, f) => {
          const mat = new THREE.MeshStandardMaterial({
            map: markTexture(fv[f], pips),
            transparent: true,
            depthWrite: false,
            roughness: 0.55,
            metalness: 0,
          });
          decalMats.push(mat);
          const plane = new THREE.Mesh(decalGeo, mat);
          plane.position.set(...slot.pos);
          plane.rotation.set(...slot.rot);
          group.add(plane);
        });
        scene.add(group);

        const cbody = new CANNON.Body({
          mass: 1,
          material: dieMat,
          shape: new CANNON.Box(new CANNON.Vec3(DIE_SIZE / 2, DIE_SIZE / 2, DIE_SIZE / 2)),
          linearDamping: 0.05,
          angularDamping: 0.06,
          allowSleep: true,
          sleepSpeedLimit: 0.2,
          sleepTimeLimit: 0.25,
        });
        // 躍動感：奥・高所から手前へ勢いよく投げ、強いスピンを与える
        const lane = n > 1 ? (i - (n - 1) / 2) / (n - 1) : 0;
        cbody.position.set(
          lane * (TRAY_HALF * 1.3) + (Math.random() - 0.5) * 1.2,
          7.5 + Math.random() * 3.5,
          -TRAY_HALF + 0.6 + Math.random() * 1.4,
        );
        cbody.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cbody.velocity.set((Math.random() - 0.5) * 6, -3.5, 5.5 + Math.random() * 3.5);
        cbody.angularVelocity.set(
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
        );
        world.addBody(cbody);

        dice.push({
          group, body: cbody, decalMats, target: null,
          fromQ: new THREE.Quaternion(), fromPos: new THREE.Vector3(), toPos: new THREE.Vector3(),
        });
      });

      phase = 'tumble';
      phaseStart = performance.now();
      settledCalled = false;
      if (reduceMotion) beginPresent();
      startLoop();
    };

    // 静止後：結果面(+Y)を上へ向ける最小回転を目標に、小さくホップして着地。
    const beginPresent = () => {
      phase = 'present';
      phaseStart = performance.now();
      const up = new THREE.Vector3(0, 1, 0);
      dice.forEach((d) => {
        d.body.sleep();
        const q = d.group.quaternion.clone();
        const curUp = up.clone().applyQuaternion(q); // 現在の局所+Yのワールド向き
        const align = new THREE.Quaternion().setFromUnitVectors(curUp, up);
        d.target = align.multiply(q);
        d.fromQ = d.group.quaternion.clone();
        d.fromPos = d.group.position.clone();
        const x = THREE.MathUtils.clamp(d.body.position.x, -TRAY_HALF + 1, TRAY_HALF - 1);
        const z = THREE.MathUtils.clamp(d.body.position.z, -TRAY_HALF + 1, TRAY_HALF - 1);
        d.toPos = new THREE.Vector3(x, DIE_SIZE / 2, z);
      });
    };

    // ── ループ ─────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    const stopLoop = () => { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const startLoop = () => { if (running) return; running = true; clock.getDelta(); raf = requestAnimationFrame(animate); };

    const allAsleep = () => dice.length > 0 && dice.every(
      (d) => d.body.sleepState === CANNON.Body.SLEEPING
        || (d.body.velocity.lengthSquared() < 0.05 && d.body.angularVelocity.lengthSquared() < 0.05),
    );

    const syncMesh = (d: Die) => {
      d.group.position.copy(d.body.position as unknown as THREE.Vector3);
      d.group.quaternion.copy(d.body.quaternion as unknown as THREE.Quaternion);
    };

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 1 / 30);

      if (phase === 'tumble') {
        world.step(1 / 120, dt, 4);
        for (const d of dice) syncMesh(d);
        if (performance.now() - phaseStart > TUMBLE_CAP_MS || allAsleep()) beginPresent();
      } else if (phase === 'present') {
        const p = Math.min(1, (performance.now() - phaseStart) / PRESENT_MS);
        const e = 1 - Math.pow(1 - p, 3);          // ease-out（回転・水平移動）
        const hop = HOP_HEIGHT * 4 * p * (1 - p);  // 放物線ホップ
        dice.forEach((d) => {
          if (d.target) d.group.quaternion.slerpQuaternions(d.fromQ, d.target, e);
          d.group.position.x = THREE.MathUtils.lerp(d.fromPos.x, d.toPos.x, e);
          d.group.position.z = THREE.MathUtils.lerp(d.fromPos.z, d.toPos.z, e);
          d.group.position.y = THREE.MathUtils.lerp(d.fromPos.y, d.toPos.y, e) + hop;
        });
        if (p >= 1) {
          phase = 'done';
          if (!settledCalled) { settledCalled = true; propsRef.current.onSettled(); }
        }
      }

      renderer.render(scene, camera);
      if (phase === 'done') { stopLoop(); return; }
      raf = requestAnimationFrame(animate);
    };

    // ── リサイズ / 可視化 ───────────────────────────────
    const resize = () => {
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(() => { resize(); if (!running) renderer.render(scene, camera); });
    ro.observe(container);
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !running) { resize(); renderer.render(scene, camera); }
    };
    document.addEventListener('visibilitychange', onVisible);

    sceneRef.current = { throwDice };
    throwDice(propsRef.current.values, propsRef.current.sides);

    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', onVisible);
      ro.disconnect();
      clearDice();
      bodyGeo.dispose();
      bodyMat.dispose();
      decalGeo.dispose();
      floorMesh.geometry.dispose();
      (floorMesh.material as THREE.Material).dispose();
      feltTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, []);

  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    sceneRef.current?.throwDice(propsRef.current.values, propsRef.current.sides);
  }, [rollKey]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
