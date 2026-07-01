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
 * - 出目は最初から「上面(+Y)」に配置しておき、テクスチャの差し替えは一切しない
 *   （＝止まった瞬間に出目が変わることがない）。
 * - 着地の決め方：物理でのチャチャな転がりが自然に収まりかけたら（速度が下がったら）、
 *   結果面(+Y)を上に向ける「ごく小さな補正角速度」を毎フレーム加算し続ける。
 *   スクリプトでホップさせたり瞬間移動させたりせず、あくまで通常の重力・摩擦・
 *   衝突応答の中で自然に収束させる（＝実物のサイコロが最後に少し転がって
 *   面を決めるような、continuous physics の一部として着地する）。
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

// 転がり中、速度が落ちてきた個体に「結果面(+Y)を上へ」向ける弱いバイアスをかける
// （最後の flatten の回転量を小さくして自然に見せるためのお膳立て）。
const BIAS_ACTIVE_SPEED2 = 36;  // lin²+ang² がこれ未満のときだけ弱くバイアス
const BIAS_ANGVEL_GAIN = 4;
const BIAS_MAX_ANGVEL = 2.4;
const ALIGN_DONE_ANGLE = 0.04;

// tumble →（仕上げの）flatten への移行判定。
const MIN_TUMBLE_S = 0.9;      // 最低これだけは自由に転がす（シミュ秒）
const LAND_LIN2 = 1.0;         // 全個体の並進速度²がこれ未満＝跳ね終えて落ち着いた
const SETTLE_TIMEOUT_S = 3.6;  // 落ち着かなくてもここで flatten へ（安全上限・シミュ秒）

// flatten：結果面を上に向け、床に接地させ、重なりを解消して静止させる短い仕上げ。
// これにより「斜めのまま止まる／重なる」が構造的に起きない。
const FLATTEN_MS = 300;

// サイコロ同士が重ならないための最小間隔と、近づいたときに押し離す強さ。
const SEPARATE_DIST = DIE_SIZE * 1.05;
const SEPARATE_PUSH = 1.8;

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

/**
 * n個のサイコロを、重ならない間隔のグリッド状に散らして配置する（XZ座標）。
 * 物理演算の投げ入れ位置と、モーション低減時の静的配置の両方で共有する。
 */
function gridLayout(n: number): { x: number; z: number }[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const usableHalf = TRAY_HALF - DIE_SIZE / 2 - 0.35;
  const spacingX = cols > 1 ? Math.min((2 * usableHalf) / (cols - 1), DIE_SIZE * 2.1) : 0;
  const spacingZ = rows > 1 ? Math.min((2 * usableHalf) / (rows - 1), DIE_SIZE * 2.1) : 0;

  const positions: { x: number; z: number }[] = [];
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = (Math.random() - 0.5) * spacingX * 0.22;
    const jz = (Math.random() - 0.5) * spacingZ * 0.22;
    positions.push({
      x: THREE.MathUtils.clamp((col - (cols - 1) / 2) * spacingX + jx, -usableHalf, usableHalf),
      z: THREE.MathUtils.clamp((row - (rows - 1) / 2) * spacingZ + jz, -usableHalf, usableHalf),
    });
  }
  return positions;
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
  body: CANNON.Body | null;
  decalMats: THREE.MeshStandardMaterial[];
}

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const LOCAL_UP = new THREE.Vector3(0, 1, 0);

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
    // 地面に当たったときもはっきり弾むように反発を強める。
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, groundMat, { friction: 0.35, restitution: 0.78 }));
    // サイコロ同士はよく弾む（＝ぶつかったらはじけて散らばる）ように反発を強め、
    // 摩擦を下げてくっつきにくくする。
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, dieMat, { friction: 0.02, restitution: 0.9 }));

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

    let phase: 'tumble' | 'flatten' | 'done' = 'done';
    // シミュレーション経過秒（タブが背面で rAF が間引かれても、実時間ではなく
    // 物理が実際に進んだ秒数で移行・安全上限を判定するため）。
    let elapsedSim = 0;
    let settledCalled = true;

    // flatten フェーズの補間データ（beginFlatten で確定）。
    const flatFromQ: THREE.Quaternion[] = [];
    const flatToQ: THREE.Quaternion[] = [];
    const flatFromP: THREE.Vector3[] = [];
    const flatToP: THREE.Vector3[] = [];
    let flattenStartMs = 0;

    const clearDice = () => {
      for (const d of dice) {
        scene.remove(d.group);
        d.decalMats.forEach((m) => { m.map?.dispose(); m.dispose(); });
        if (d.body) world.removeBody(d.body);
      }
      dice.length = 0;
    };

    const buildDie = (value: number, sd: number, pips: boolean) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(bodyGeo, bodyMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

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
      return { group, decalMats };
    };

    const throwDice = (vals: number[], sd: number) => {
      clearDice();
      const n = vals.length;
      const pips = sd <= 6;

      if (reduceMotion) {
        // モーション低減設定：転がさず静的に配置。local +Y は常に結果面なので、
        // 回転させずそのまま置くだけで正しい出目が最初から見えている。
        const layout = gridLayout(n);
        vals.forEach((value, i) => {
          const { group, decalMats } = buildDie(value, sd, pips);
          group.position.set(layout[i].x, DIE_SIZE / 2, layout[i].z);
          dice.push({ group, body: null, decalMats });
        });
        phase = 'done';
        settledCalled = false;
        renderer.render(scene, camera);
        requestAnimationFrame(() => {
          if (!settledCalled) { settledCalled = true; propsRef.current.onSettled(); }
        });
        return;
      }

      // 重ならないグリッドに散らして落とす。各マスの真上から個別に投げ入れるので、
      // 勢いよく弾んでも「元の場所付近」に散らばって着地し、団子状に固まらない。
      const layout = gridLayout(n);
      vals.forEach((value, i) => {
        const { group, decalMats } = buildDie(value, sd, pips);

        const body = new CANNON.Body({
          mass: 1,
          material: dieMat,
          shape: new CANNON.Box(new CANNON.Vec3(DIE_SIZE / 2, DIE_SIZE / 2, DIE_SIZE / 2)),
          linearDamping: 0.05,
          angularDamping: 0.06,
          allowSleep: true,
          sleepSpeedLimit: 0.2,
          sleepTimeLimit: 0.35,
        });
        // 躍動感：高所から勢いよく落として強いスピンを与える（水平方向はごく小さく、
        // グリッドで確保した間隔を保ったまま弾ませる）。
        body.position.set(
          layout[i].x,
          8 + Math.random() * 3,
          layout[i].z,
        );
        body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        body.velocity.set((Math.random() - 0.5) * 2.2, -7 - Math.random() * 3, (Math.random() - 0.5) * 2.2);
        body.angularVelocity.set(
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
        );
        world.addBody(body);

        dice.push({ group, body, decalMats });
      });

      phase = 'tumble';
      elapsedSim = 0;
      settledCalled = false;
      startLoop();
    };

    // ── ループ ─────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    const stopLoop = () => { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const startLoop = () => { if (running) return; running = true; clock.getDelta(); raf = requestAnimationFrame(animate); };

    const tmpQ = new THREE.Quaternion();
    const tmpUp = new THREE.Vector3();
    const tmpAxis = new THREE.Vector3();

    /**
     * 転がりが落ち着いてきた個体に、結果面(+Y)を上へ向ける「弱いバイアス」をかける。
     * 強制ではなく、あくまで最後の flatten での回転量を小さくするためのお膳立て。
     * 並進はごく軽く減衰させ、寄りかかりで転がり続けないようにする。
     */
    const stepBias = (d: Die) => {
      const body = d.body!;
      const lin2 = body.velocity.lengthSquared();
      const ang2 = body.angularVelocity.lengthSquared();
      if (lin2 + ang2 > BIAS_ACTIVE_SPEED2) return; // まだ勢いよく跳ね・転がり中：物理に任せる

      tmpQ.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
      tmpUp.copy(LOCAL_UP).applyQuaternion(tmpQ);
      const angle = tmpUp.angleTo(WORLD_UP);
      if (angle <= ALIGN_DONE_ANGLE) return;

      if (body.sleepState === CANNON.Body.SLEEPING) body.wakeUp();
      tmpAxis.crossVectors(tmpUp, WORLD_UP);
      if (tmpAxis.lengthSq() < 1e-6) tmpAxis.set(1, 0, 0);
      else tmpAxis.normalize();
      const target = Math.min(angle * BIAS_ANGVEL_GAIN, BIAS_MAX_ANGVEL);
      body.angularVelocity.x += (tmpAxis.x * target - body.angularVelocity.x) * 0.14;
      body.angularVelocity.y += (tmpAxis.y * target - body.angularVelocity.y) * 0.14;
      body.angularVelocity.z += (tmpAxis.z * target - body.angularVelocity.z) * 0.14;
      body.velocity.x *= 0.9;
      body.velocity.z *= 0.9;
    };

    /**
     * 仕上げ（flatten）の目標を確定する。物理を止め、各サイコロを
     * 「結果面(+Y)を真上・床に接地・互いに重ならない位置」へ短時間で補間する。
     * これにより斜め・重なり・エッジ立ちが構造的に起きない。
     */
    const beginFlatten = () => {
      phase = 'flatten';
      flattenStartMs = performance.now();

      // 重なり解消：現在のXZから、間隔を空けた目標XZを反復緩和で求める。
      const tx = dice.map((d) => (d.body ? d.body.position.x : d.group.position.x));
      const tz = dice.map((d) => (d.body ? d.body.position.z : d.group.position.z));
      for (let it = 0; it < 16; it++) {
        for (let i = 0; i < dice.length; i++) {
          for (let j = i + 1; j < dice.length; j++) {
            let dx = tx[i] - tx[j];
            let dz = tz[i] - tz[j];
            let d2 = dx * dx + dz * dz;
            if (d2 > SEPARATE_DIST * SEPARATE_DIST) continue;
            if (d2 < 1e-6) { dx = Math.random() - 0.5; dz = Math.random() - 0.5; d2 = dx * dx + dz * dz; }
            const dist = Math.sqrt(d2);
            const push = (SEPARATE_DIST - dist) / 2;
            const nx = dx / dist;
            const nz = dz / dist;
            tx[i] += nx * push; tz[i] += nz * push;
            tx[j] -= nx * push; tz[j] -= nz * push;
          }
        }
      }
      const lim = TRAY_HALF - DIE_SIZE / 2 - 0.1;

      flatFromQ.length = 0; flatToQ.length = 0; flatFromP.length = 0; flatToP.length = 0;
      dice.forEach((d, i) => {
        if (d.body) { d.body.velocity.set(0, 0, 0); d.body.angularVelocity.set(0, 0, 0); d.body.sleep(); }
        const fromQ = d.group.quaternion.clone();
        tmpUp.copy(LOCAL_UP).applyQuaternion(fromQ);
        // 現在の +Y をワールド上向きへ最小回転で合わせる（＝ヨーはそのまま水平化）。
        const toQ = new THREE.Quaternion().setFromUnitVectors(tmpUp, WORLD_UP).multiply(fromQ);
        flatFromQ.push(fromQ);
        flatToQ.push(toQ);
        flatFromP.push(d.group.position.clone());
        flatToP.push(new THREE.Vector3(
          THREE.MathUtils.clamp(tx[i], -lim, lim),
          DIE_SIZE / 2,
          THREE.MathUtils.clamp(tz[i], -lim, lim),
        ));
      });
    };

    const syncMesh = (d: Die) => {
      if (!d.body) return;
      d.group.position.copy(d.body.position as unknown as THREE.Vector3);
      d.group.quaternion.copy(d.body.quaternion as unknown as THREE.Quaternion);
    };

    /**
     * サイコロ同士が水平方向に近づきすぎていたら、毎フレーム軽く押し離す。
     * 通常の衝突応答に重ねる追加の反発で、団子状に固まって重なるのを防ぐ
     * （押された側は sleep 中でも wakeUp して弾け合う）。
     */
    const stepSeparate = () => {
      for (let i = 0; i < dice.length; i++) {
        const a = dice[i].body;
        if (!a) continue;
        for (let j = i + 1; j < dice.length; j++) {
          const b = dice[j].body;
          if (!b) continue;
          const dx = a.position.x - b.position.x;
          const dz = a.position.z - b.position.z;
          const distSq = dx * dx + dz * dz;
          if (distSq >= SEPARATE_DIST * SEPARATE_DIST || distSq < 1e-8) continue;
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const nz = dz / dist;
          const overlap = SEPARATE_DIST - dist;
          const push = Math.min(SEPARATE_PUSH, overlap * 6);
          a.wakeUp();
          b.wakeUp();
          a.velocity.x += nx * push * 0.5;
          a.velocity.z += nz * push * 0.5;
          b.velocity.x -= nx * push * 0.5;
          b.velocity.z -= nz * push * 0.5;
        }
      }
    };

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 1 / 30);

      if (phase === 'tumble') {
        world.step(1 / 120, dt, 4);
        stepSeparate();
        for (const d of dice) { stepBias(d); syncMesh(d); }
        elapsedSim += dt;

        // 十分転がって跳ね終え、全個体の並進が落ち着いたら仕上げへ。落ち着かなくても上限で移行。
        const landed = dice.every((d) => d.body === null || d.body.velocity.lengthSquared() < LAND_LIN2);
        if ((elapsedSim > MIN_TUMBLE_S && landed) || elapsedSim > SETTLE_TIMEOUT_S) {
          beginFlatten();
        }
      } else if (phase === 'flatten') {
        const p = Math.min(1, (performance.now() - flattenStartMs) / FLATTEN_MS);
        const e = 1 - Math.pow(1 - p, 3); // ease-out
        for (let i = 0; i < dice.length; i++) {
          dice[i].group.quaternion.slerpQuaternions(flatFromQ[i], flatToQ[i], e);
          dice[i].group.position.lerpVectors(flatFromP[i], flatToP[i], e);
        }
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
