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
 * - 出目は物理演算に任せて自然に決める：立方体は平らな床の上で必ずいずれかの面を
 *   上にして平らに静止する。強制的な向きの補正・ホップ・スナップは行わない。
 *   静止したら「上を向いた面の値」をそのまま出目として親へ渡す（onSettled）。
 *   → 最後に不自然に回って揃うような動きが起きない。
 * - 事前に各面へランダムな値を割り当てておく（d6以下は本物のダイス配置、d7以上は
 *   範囲内の一様乱数）。物理がどの面を上にするかで出目が公平に決まる。
 * - サイコロ同士は水平方向に押し離して、積み重なって斜めになるのを防ぐ。
 *   静止直前に、上面をきっちり水平へ合わせるごく小さな整え（数度・知覚できない量）
 *   だけ行い、重なり位置も緩和する。
 * - 面数が6以下はドット目、7以上は数字（1つのサイコロ内で混在しない）。
 * - キャンバス内の色は描画用途のためトークン対象外（STYLEGUIDE 例外）。
 */

interface DiceCanvasProps {
  count: number;
  sides: number;
  rollKey: number;
  /** 自然な着地で上を向いた面の値（＝出目）を渡して呼ぶ */
  onSettled: (values: number[]) => void;
}

const DIE_SIZE = 1.85;
const DIE_RADIUS = DIE_SIZE * 0.16; // 角丸の半径
const TRAY_HALF = 8.0;

// tumble →（仕上げの）settle への移行判定。全個体が「並進も回転もほぼ止まって、
// かつ上面がほぼ水平（自然に平らに落ちた）」状態になったら settle へ。
const MIN_TUMBLE_S = 0.7;       // 最低これだけは自由に転がす（シミュ秒）
const REST_LIN2 = 0.25;         // 並進速度²がこれ未満
const REST_ANG2 = 0.25;         // 角速度²がこれ未満
const FLAT_ANGLE = 0.14;        // 上面と鉛直のなす角がこれ未満（約8°）＝平らに落ちた
const SETTLE_TIMEOUT_S = 4.0;   // 落ち着かなくてもここで settle へ（安全上限・シミュ秒）

// settle：知覚できないごく小さな整え（上面を水平化＋重なり緩和）だけを行う短い仕上げ。
// 平らに落ちた状態からの微修正なので回転量は数度以内。
const SETTLE_MS = 180;

// サイコロ同士が重ならないための最小間隔と、近づいたときに押し離す強さ。
const SEPARATE_DIST = DIE_SIZE * 1.08;
const SEPARATE_PUSH = 2.2;

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

/**
 * 6面それぞれの値。出目は物理が上向きの面で決めるので、ここは各面のラベルを作るだけ。
 * d6以下は本物のダイス（1〜sides を重複なく／面が余れば埋める）、
 * d7以上は範囲内の一様乱数（どの面が上でも公平になるよう iid）。
 */
function faceVals(sides: number): number[] {
  if (sides <= 6) {
    const base = [1, 2, 3, 4, 5, 6].map((v) => (v <= sides ? v : Math.floor(Math.random() * sides) + 1));
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    return base;
  }
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * sides) + 1);
}

/**
 * n個のサイコロを、重ならない間隔のグリッド状に散らして配置する（XZ座標）。
 * 物理演算の投げ入れ位置と、モーション低減時の静的配置の両方で共有する。
 */
function gridLayout(n: number): { x: number; z: number }[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const halfX = TRAY_HALF - DIE_SIZE / 2 - 0.4;
  // 横(X)は広く散らす。奥行き(Z)はカメラ画角に収まるよう控えめに保つ。
  const halfZ = 3.8;
  const spacingX = cols > 1 ? Math.min((2 * halfX) / (cols - 1), DIE_SIZE * 3.4) : 0;
  const spacingZ = rows > 1 ? Math.min((2 * halfZ) / (rows - 1), DIE_SIZE * 2.2) : 0;

  const positions: { x: number; z: number }[] = [];
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // ランダムに散らばって見えるようジッターを大きめに。
    const jx = (Math.random() - 0.5) * spacingX * 0.45;
    const jz = (Math.random() - 0.5) * spacingZ * 0.45;
    positions.push({
      x: THREE.MathUtils.clamp((col - (cols - 1) / 2) * spacingX + jx, -halfX, halfX),
      z: THREE.MathUtils.clamp((row - (rows - 1) / 2) * spacingZ + jz, -halfZ, halfZ),
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

// FACE_SLOTS と同じ順の各面の外向き法線（上を向いた面の判定に使う）。
const FACE_NORMALS: THREE.Vector3[] = [
  new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
];

interface Die {
  group: THREE.Group;
  body: CANNON.Body | null;
  decalMats: THREE.MeshStandardMaterial[];
  /** FACE_SLOTS 順の各面の値（どの面が上になったかで出目を読む） */
  fv: number[];
}

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export function DiceCanvas({ count, sides, rollKey, onSettled }: DiceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef({ count, sides, onSettled });
  useEffect(() => { propsRef.current = { count, sides, onSettled }; });

  const sceneRef = useRef<{ throwDice: (count: number, sides: number) => void } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 320;

    // ── three ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 20, 14.5);
    camera.lookAt(0, 0, 0);

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
    key.shadow.camera.left = -11;
    key.shadow.camera.right = 11;
    key.shadow.camera.top = 11;
    key.shadow.camera.bottom = -11;
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

    let phase: 'tumble' | 'settle' | 'done' = 'done';
    // シミュレーション経過秒（タブが背面で rAF が間引かれても、実時間ではなく
    // 物理が実際に進んだ秒数で移行・安全上限を判定するため）。
    let elapsedSim = 0;
    let settledCalled = true;

    // settle フェーズ（ごく小さな整え）の補間データと、確定した出目。
    const flatFromQ: THREE.Quaternion[] = [];
    const flatToQ: THREE.Quaternion[] = [];
    const flatFromP: THREE.Vector3[] = [];
    const flatToP: THREE.Vector3[] = [];
    const settleResults: number[] = [];
    let settleStartMs = 0;

    const clearDice = () => {
      for (const d of dice) {
        scene.remove(d.group);
        d.decalMats.forEach((m) => { m.map?.dispose(); m.dispose(); });
        if (d.body) world.removeBody(d.body);
      }
      dice.length = 0;
    };

    const buildDie = (sd: number, pips: boolean) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(bodyGeo, bodyMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      const fv = faceVals(sd);
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
      return { group, decalMats, fv };
    };

    const throwDice = (cnt: number, sd: number) => {
      clearDice();
      const n = cnt;
      const pips = sd <= 6;

      if (reduceMotion) {
        // モーション低減設定：転がさず静的に配置。無回転なので +Y 面（index 0）が上。
        const layout = gridLayout(n);
        const results: number[] = [];
        for (let i = 0; i < n; i++) {
          const { group, decalMats, fv } = buildDie(sd, pips);
          group.position.set(layout[i].x, DIE_SIZE / 2, layout[i].z);
          dice.push({ group, body: null, decalMats, fv });
          results.push(fv[0]);
        }
        phase = 'done';
        settledCalled = false;
        renderer.render(scene, camera);
        requestAnimationFrame(() => {
          if (!settledCalled) { settledCalled = true; propsRef.current.onSettled(results); }
        });
        return;
      }

      // 重ならないグリッドに散らして落とす。各マスの真上から個別に投げ入れるので、
      // 勢いよく弾んでも「元の場所付近」に散らばって着地し、団子状に固まらない。
      const layout = gridLayout(n);
      for (let i = 0; i < n; i++) {
        const { group, decalMats, fv } = buildDie(sd, pips);

        const body = new CANNON.Body({
          mass: 1,
          material: dieMat,
          shape: new CANNON.Box(new CANNON.Vec3(DIE_SIZE / 2, DIE_SIZE / 2, DIE_SIZE / 2)),
          linearDamping: 0.05,
          angularDamping: 0.06,
          allowSleep: true,
          sleepSpeedLimit: 0.2,
          sleepTimeLimit: 0.3,
        });
        // 散らばり：広く取ったグリッド位置（大きめジッター付き）の真上から落とす。
        // 水平初速は控えめにして、落ちた場所付近＝広く散った状態のまま着地させる
        // （初速を上げると壁反射＋ランダムで中央に寄ってしまうため）。
        body.position.set(
          layout[i].x,
          8 + Math.random() * 3,
          layout[i].z,
        );
        body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        body.velocity.set((Math.random() - 0.5) * 2.4, -7 - Math.random() * 3, (Math.random() - 0.5) * 2.4);
        body.angularVelocity.set(
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
        );
        world.addBody(body);

        dice.push({ group, body, decalMats, fv });
      }

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
    const tmpNrm = new THREE.Vector3();

    /**
     * サイコロの現在の姿勢から「一番上を向いている面」を返す。
     * index は FACE_SLOTS/FACE_NORMALS の添字、cos はその面法線と鉛直上向きの内積
     * （1 に近いほど平ら＝きれいに面が上を向いて静止している）。
     */
    const upFaceOf = (q: CANNON.Quaternion): { index: number; cos: number } => {
      tmpQ.set(q.x, q.y, q.z, q.w);
      let index = 0;
      let cos = -Infinity;
      for (let f = 0; f < 6; f++) {
        const dot = tmpNrm.copy(FACE_NORMALS[f]).applyQuaternion(tmpQ).dot(WORLD_UP);
        if (dot > cos) { cos = dot; index = f; }
      }
      return { index, cos };
    };

    /**
     * 仕上げ（settle）：物理を止め、上を向いた面の値を出目として確定する。
     * 位置は物理が置いたそのまま（剛体なので重なりは起きない）。回転だけ、
     * 上面をきっちり水平へ合わせるごく小さな整え（平らに落ちていれば数度以内）を
     * 短時間で補間する。＝不自然に回って見える動きにはならない。
     */
    const beginSettle = () => {
      phase = 'settle';
      settleStartMs = performance.now();
      const lim = TRAY_HALF - DIE_SIZE / 2 - 0.1;

      flatFromQ.length = 0; flatToQ.length = 0; flatFromP.length = 0; flatToP.length = 0;
      settleResults.length = 0;
      dice.forEach((d) => {
        const fromQ = d.group.quaternion.clone();
        // 上を向いた面 → その値が出目。
        const up = upFaceOf(d.body ? d.body.quaternion : (d.group.quaternion as unknown as CANNON.Quaternion));
        settleResults.push(d.fv[up.index]);
        if (d.body) { d.body.velocity.set(0, 0, 0); d.body.angularVelocity.set(0, 0, 0); d.body.sleep(); }
        // その面をワールド上向きへ最小回転で合わせる（平らに落ちていれば数度以内）。
        tmpNrm.copy(FACE_NORMALS[up.index]).applyQuaternion(fromQ);
        const toQ = new THREE.Quaternion().setFromUnitVectors(tmpNrm, WORLD_UP).multiply(fromQ);
        flatFromQ.push(fromQ);
        flatToQ.push(toQ);
        // 位置は据え置き（床の高さだけ揃える）。XZ は物理が置いたまま。
        const from = d.group.position.clone();
        flatFromP.push(from);
        flatToP.push(new THREE.Vector3(
          THREE.MathUtils.clamp(from.x, -lim, lim),
          DIE_SIZE / 2,
          THREE.MathUtils.clamp(from.z, -lim, lim),
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
        for (const d of dice) syncMesh(d);
        elapsedSim += dt;

        // 十分転がったうえで、全個体が「ほぼ静止」かつ「面がほぼ水平に落ちた」ら仕上げへ。
        // まだ斜め（積み重なりなど）の個体があれば移行しない＝分離しきるまで自然に待つ。
        // どうしても落ち着かない場合だけ上限で移行する。
        const rested = elapsedSim > MIN_TUMBLE_S && dice.every((d) => {
          const body = d.body;
          if (!body) return true;
          if (body.velocity.lengthSquared() >= REST_LIN2 || body.angularVelocity.lengthSquared() >= REST_ANG2) return false;
          return upFaceOf(body.quaternion).cos > Math.cos(FLAT_ANGLE);
        });
        if (rested || elapsedSim > SETTLE_TIMEOUT_S) {
          beginSettle();
        }
      } else if (phase === 'settle') {
        const p = Math.min(1, (performance.now() - settleStartMs) / SETTLE_MS);
        const e = 1 - Math.pow(1 - p, 3); // ease-out
        for (let i = 0; i < dice.length; i++) {
          dice[i].group.quaternion.slerpQuaternions(flatFromQ[i], flatToQ[i], e);
          dice[i].group.position.lerpVectors(flatFromP[i], flatToP[i], e);
        }
        if (p >= 1) {
          phase = 'done';
          if (!settledCalled) { settledCalled = true; propsRef.current.onSettled(settleResults); }
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
    throwDice(propsRef.current.count, propsRef.current.sides);

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
    sceneRef.current?.throwDice(propsRef.current.count, propsRef.current.sides);
  }, [rollKey]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
