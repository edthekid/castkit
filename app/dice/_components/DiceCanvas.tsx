'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as CANNON from 'cannon-es';
import { polyKindForSides, getDiceShape, type DieKind } from '../_diceShapes';

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

// 赤フェルト（暗い赤で床・背景を統一）
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

/**
 * 面の柄（ドット or 数字）を透明背景で描くデカール用テクスチャ。
 * text を渡すとその文字列をそのまま刻む（d% の「00」〜「90」など）。
 */
function markTexture(value: number, pips: boolean, text?: string): THREE.CanvasTexture {
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
    const label = text ?? String(value);
    ctx.fillStyle = PIP_DARK;
    ctx.font = `700 ${label.length >= 3 ? 108 : label.length === 2 ? 128 : 152}px "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillText(label, S / 2, S / 2 + 6);
    ctx.shadowColor = 'transparent';
    // 単独の 6 / 9 だけ下線で向きを明示（「60」「90」などは対象外）。
    if (label === '6' || label === '9') ctx.fillRect(S / 2 - 34, S * 0.5 + 66, 68, 9);
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

interface Bounds { xHalf: number; zLo: number; zHi: number }

/**
 * n個のサイコロを、重ならない間隔のグリッド状に散らして配置する（XZ座標）。
 * 散らし範囲は可視範囲（bounds）に収め、投げ入れ位置とモーション低減時の
 * 静的配置の両方で共有する。中心はやや奥へ寄せ、下部の合計表示を避ける。
 */
function gridLayout(n: number, b: Bounds): { x: number; z: number }[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const halfX = Math.min(5.4, b.xHalf);
  const zc = (b.zLo + b.zHi) / 2 - 0.5;                 // 中心を少し奥へ
  const halfZ = Math.min(2.5, (b.zHi - b.zLo) / 2 - 0.3);
  const spacingX = cols > 1 ? Math.min((2 * halfX) / (cols - 1), DIE_SIZE * 2.7) : 0;
  const spacingZ = rows > 1 ? Math.min((2 * halfZ) / (rows - 1), DIE_SIZE * 1.6) : 0;

  const positions: { x: number; z: number }[] = [];
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // ランダムに散らばって見えるようジッターを大きめに。
    const jx = (Math.random() - 0.5) * spacingX * 0.45;
    const jz = (Math.random() - 0.5) * spacingZ * 0.45;
    positions.push({
      x: THREE.MathUtils.clamp((col - (cols - 1) / 2) * spacingX + jx, -halfX, halfX),
      z: THREE.MathUtils.clamp((row - (rows - 1) / 2) * spacingZ + jz + zc, b.zLo + 0.1, b.zHi - 0.1),
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
  /** 出目の読み方（face:面が読み取り方向を向く / vertex:上を向いた頂点＝d4） */
  readMode: 'face' | 'vertex';
  /** 各面の外向き法線（ローカル）。cube:6面, 多面体:面数分（face モード） */
  faceNormals: THREE.Vector3[];
  /** faceNormals と同じ順で、その面が読み取り方向を向いたときの出目（face モード） */
  values: number[];
  /** 出目を読む向き（+1=上を向いた面, -1=下を向いた面）（face モード） */
  readDir: 1 | -1;
  /** 各頂点への単位方向（vertex モード＝d4：上を向いた頂点を探す） */
  vertexDirs?: THREE.Vector3[];
  /** vertexDirs と同じ順の各頂点の出目（vertex モード＝d4） */
  vertexValues?: number[];
  /** 着地時の中心高さ（cube:DIE_SIZE/2, 多面体:内接半径） */
  restY: number;
}

/** 多面体の各面へ貼る数字（ラベル）と、その面が出たときの出目（値）を用意する。 */
function polyFaceValues(kind: string, faceCount: number): { labels: number[]; values: number[] } {
  if (kind === 'd100') {
    // d% は10面に100までの出目を割り当てられないため、各面へ 1〜100 の一様乱数を置き、
    // どの面が上でも公平になるようにする（角丸キューブと同じ考え方）。
    const labels = Array.from({ length: faceCount }, () => Math.floor(Math.random() * 100) + 1);
    return { labels, values: labels };
  }
  // d4/d8/d12/d20/d10：面数ぶんの値を重複なくシャッフルして割り当てる（＝本物のダイス）。
  // d10 は 0〜9 を刻印し、0 の面が出たら 10 とする。
  const base = kind === 'd10'
    ? Array.from({ length: faceCount }, (_, i) => i)              // 0..9
    : Array.from({ length: faceCount }, (_, i) => i + 1);         // 1..N
  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  const values = kind === 'd10' ? base.map((d) => (d === 0 ? 10 : d)) : base;
  return { labels: base, values };
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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 20, 4);
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

    // 赤フェルト（暗い赤で一様＋布目）。背景（FELT_EDGE）と同色でトレイ全体を統一。
    const feltC = document.createElement('canvas');
    feltC.width = feltC.height = 512;
    const felt = feltC.getContext('2d')!;
    felt.fillStyle = FELT_EDGE;
    felt.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 12000; i++) {
      const a = Math.random() * 0.06;
      felt.fillStyle = Math.random() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,235,220,${a * 0.6})`;
      felt.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
    const feltTex = new THREE.CanvasTexture(feltC);
    feltTex.colorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color(FELT_EDGE);
    // 床は「ライティングを受けない一様な暗い赤」（MeshBasic）。中央だけ明るくならず
    // 背景と完全に同色でトレイ全体が統一される。
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshBasicMaterial({ map: feltTex }),
    );
    floorMesh.rotation.x = -Math.PI / 2;
    scene.add(floorMesh);
    // サイコロの影だけを別レイヤー（半透明）で床の上に落とす。
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.34 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.006;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

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

    // 4枚の壁は「画面に映っている床の範囲（＝画面枠）」に合わせて配置する。
    // これでダイスは枠外へ出ず、枠に当たって弾む。可視範囲はカメラの視錐台を
    // 床（y=0）へ投影して求め、リサイズ時にも再計算する。
    const makeWall = () => {
      const w = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
      world.addBody(w);
      return w;
    };
    const wallBack = makeWall();  // 奥(-Z)：内向き法線 +Z
    const wallFront = makeWall(); // 手前(+Z)：内向き法線 -Z
    const wallLeft = makeWall();  // 左(-X)：内向き法線 +X
    const wallRight = makeWall(); // 右(+X)：内向き法線 -X
    const setWall = (w: CANNON.Body, nx: number, nz: number, px: number, pz: number) => {
      w.quaternion.setFromEuler(0, Math.atan2(nx, nz), 0);
      w.position.set(px, 0, pz);
    };

    // 画面に映る床の矩形（内側マージン込み）。壁・散らし・整地クランプで共有。
    const bounds = { xHalf: 5, zLo: -5, zHi: 5 };
    const WALL_MARGIN = 1.15; // ダイスの見かけ半径ぶん内側へ寄せ、めり込み・見切れを防ぐ
    const _ray = new THREE.Raycaster();
    const _floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const _v2 = new THREE.Vector2();
    const _corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const _ndc: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]]; // 下左/下右/上左/上右
    const updateBounds = () => {
      camera.updateMatrixWorld();
      for (let i = 0; i < 4; i++) {
        _ray.setFromCamera(_v2.set(_ndc[i][0], _ndc[i][1]), camera);
        if (!_ray.ray.intersectPlane(_floor, _corners[i])) _corners[i].set(0, 0, 0);
      }
      const frontZ = (_corners[0].z + _corners[1].z) / 2; // 画面下辺＝手前
      const backZ = (_corners[2].z + _corners[3].z) / 2;  // 画面上辺＝奥
      const xHalf = Math.min(..._corners.map((c) => Math.abs(c.x)));
      bounds.xHalf = Math.max(2.5, xHalf - WALL_MARGIN);
      bounds.zHi = Math.max(frontZ, backZ) - WALL_MARGIN;
      bounds.zLo = Math.min(frontZ, backZ) + WALL_MARGIN;
      setWall(wallBack, 0, 1, 0, bounds.zLo);
      setWall(wallFront, 0, -1, 0, bounds.zHi);
      setWall(wallLeft, 1, 0, -bounds.xHalf, 0);
      setWall(wallRight, -1, 0, bounds.xHalf, 0);
    };
    updateBounds();

    // 共有リソース
    const bodyGeo = new RoundedBoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE, 5, DIE_RADIUS);
    const bodyMat = new THREE.MeshStandardMaterial({ color: DIE_COLOR, roughness: 0.3, metalness: 0.02, envMapIntensity: 0.6 });
    const decalGeo = new THREE.PlaneGeometry(DIE_SIZE * 0.74, DIE_SIZE * 0.74);
    const unitDecalGeo = new THREE.PlaneGeometry(1, 1); // 多面体用（面ごとにスケール）
    const tmpBasisR = new THREE.Vector3();
    const tmpBasisM = new THREE.Matrix4();

    const dice: Die[] = [];

    let phase: 'tumble' | 'settle' | 'done' = 'done';
    // シミュレーション経過秒（タブが背面で rAF が間引かれても、実時間ではなく
    // 物理が実際に進んだ秒数で移行・安全上限を判定するため）。
    let elapsedSim = 0;
    let settledCalled = true;
    // d%（パーセンタイル）：2つのd10（十の位＋一の位）を合計して1〜100を出す。
    let isPercentile = false;

    // d% の合計（00×0 は 100 扱い）。dice[0]=十の位, dice[1]=一の位。
    const combinePercentile = (tens: number, ones: number) => {
      const total = tens + ones;
      return total === 0 ? 100 : total;
    };

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

    interface BuiltDie {
      group: THREE.Group;
      decalMats: THREE.MeshStandardMaterial[];
      readMode: 'face' | 'vertex';
      faceNormals: THREE.Vector3[];
      values: number[];
      readDir: 1 | -1;
      vertexDirs?: THREE.Vector3[];
      vertexValues?: number[];
      restY: number;
      cannonShape: CANNON.Shape;
    }

    /** Fisher–Yates で 1..n をシャッフルした配列を返す（頂点/面への値割り当て用）。 */
    const shuffled1toN = (n: number): number[] => {
      const a = Array.from({ length: n }, (_, i) => i + 1);
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    /** 角丸キューブのダイス（d6 と非標準の面数用）。1〜6はドット、7以上は数字。 */
    const buildCubeDie = (sd: number, pips: boolean): BuiltDie => {
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
      return {
        group, decalMats, readMode: 'face',
        faceNormals: FACE_NORMALS, values: fv, readDir: 1, restY: DIE_SIZE / 2,
        cannonShape: new CANNON.Box(new CANNON.Vec3(DIE_SIZE / 2, DIE_SIZE / 2, DIE_SIZE / 2)),
      };
    };

    /** 面/隅に数字デカール（半透明板）を1枚貼るヘルパー。text で刻む文字列を上書き可。 */
    const addDecal = (
      group: THREE.Group, decalMats: THREE.MeshStandardMaterial[],
      value: number, center: THREE.Vector3, normal: THREE.Vector3, up: THREE.Vector3, size: number,
      text?: string,
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        map: markTexture(value, false, text),
        transparent: true,
        depthWrite: false,
        roughness: 0.55,
        metalness: 0,
      });
      decalMats.push(mat);
      const plane = new THREE.Mesh(unitDecalGeo, mat);
      plane.scale.setScalar(size);
      // 面の法線=+Z, 数字の上=+Y になる姿勢へ。
      tmpBasisR.crossVectors(up, normal).normalize();
      tmpBasisM.makeBasis(tmpBasisR, up, normal);
      plane.quaternion.setFromRotationMatrix(tmpBasisM);
      plane.position.copy(center).addScaledVector(normal, 0.012);
      group.add(plane);
    };

    /** TRPG用の本物の多面体ダイス（d4/d8/d10/d12/d20/d%）。 */
    const buildPolyDie = (kind: DieKind): BuiltDie => {
      const shape = getDiceShape(kind);
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(shape.geometry, bodyMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      const decalMats: THREE.MeshStandardMaterial[] = [];

      // d4：頂点読み。各頂点に値をシャッフル割り当て、各面の3隅にその頂点値を刻む。
      // 上を向いた頂点＝出目（3つの側面の頂点付近に同じ数字が見える本物のd4）。
      if (shape.readMode === 'vertex') {
        const vertexValues = shuffled1toN(shape.vertexDirs!.length);
        shape.corners!.forEach((c) => {
          addDecal(group, decalMats, vertexValues[c.vertex], c.center, c.normal, c.up, c.size);
        });
        scene.add(group);
        return {
          group, decalMats, readMode: 'vertex',
          faceNormals: [], values: [], readDir: 1, restY: shape.inradius,
          vertexDirs: shape.vertexDirs!, vertexValues,
          cannonShape: shape.cannonShape,
        };
      }

      // face モード：各面に1つ数字を貼る。
      const { labels, values } = polyFaceValues(kind, shape.faces.length);
      shape.faces.forEach((face, f) => {
        addDecal(group, decalMats, labels[f], face.center, face.normal, face.up, face.size);
      });
      scene.add(group);
      return {
        group, decalMats, readMode: 'face',
        faceNormals: shape.faces.map((f) => f.normal), values, readDir: shape.readDir, restY: shape.inradius,
        cannonShape: shape.cannonShape,
      };
    };

    /**
     * d10形状に任意のラベル・値を割り当てたダイス（d% のパーセンタイル用）。
     * labels[f] を刻み、その面が出たら values[f] を返す（面ごとにシャッフル割り当て）。
     */
    const buildD10Labeled = (labels: string[], values: number[]): BuiltDie => {
      const shape = getDiceShape('d10');
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(shape.geometry, bodyMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      const decalMats: THREE.MeshStandardMaterial[] = [];
      // 面へのラベル割り当てをシャッフル（着地の偏りに関係なく公平）。
      const order = shuffled1toN(shape.faces.length).map((v) => v - 1);
      const faceValues: number[] = [];
      shape.faces.forEach((face, f) => {
        const k = order[f];
        faceValues.push(values[k]);
        addDecal(group, decalMats, values[k], face.center, face.normal, face.up, face.size, labels[k]);
      });
      scene.add(group);
      return {
        group, decalMats, readMode: 'face',
        faceNormals: shape.faces.map((f) => f.normal), values: faceValues, readDir: shape.readDir, restY: shape.inradius,
        cannonShape: shape.cannonShape,
      };
    };

    // d%（パーセンタイル）用の2つのd10：十の位（00〜90）と一の位（0〜9）。
    const TENS_LABELS = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'];
    const TENS_VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    const ONES_LABELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const ONES_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const makeDie = (sd: number): BuiltDie => {
      const kind = polyKindForSides(sd);
      return kind ? buildPolyDie(kind) : buildCubeDie(sd, sd <= 6);
    };

    const throwDice = (cnt: number, sd: number) => {
      clearDice();
      // d%（sd===100）は十の位＋一の位の2つのd10を振って合計する。
      isPercentile = sd === 100;
      const built: BuiltDie[] = isPercentile
        ? [buildD10Labeled(TENS_LABELS, TENS_VALUES), buildD10Labeled(ONES_LABELS, ONES_VALUES)]
        : Array.from({ length: cnt }, () => makeDie(sd));
      const n = built.length;

      if (reduceMotion) {
        // モーション低減設定：転がさず静的に配置。読み取り面/頂点を上へ向け出目とする。
        const layout = gridLayout(n, bounds);
        const reads: number[] = [];
        for (let i = 0; i < n; i++) {
          const d = built[i];
          if (d.readMode === 'vertex') {
            d.group.quaternion.setFromUnitVectors(d.vertexDirs![0], WORLD_UP);
            reads.push(d.vertexValues![0]);
          } else {
            d.group.quaternion.setFromUnitVectors(d.faceNormals[0], WORLD_UP.clone().multiplyScalar(d.readDir));
            reads.push(d.values[0]);
          }
          d.group.position.set(layout[i].x, d.restY, layout[i].z);
          dice.push({ group: d.group, body: null, decalMats: d.decalMats, readMode: d.readMode, faceNormals: d.faceNormals, values: d.values, readDir: d.readDir, vertexDirs: d.vertexDirs, vertexValues: d.vertexValues, restY: d.restY });
        }
        const results = isPercentile ? [combinePercentile(reads[0], reads[1])] : reads;
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
      const layout = gridLayout(n, bounds);
      for (let i = 0; i < n; i++) {
        const d = built[i];

        const body = new CANNON.Body({
          mass: 1,
          material: dieMat,
          shape: d.cannonShape,
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
        body.velocity.set((Math.random() - 0.5) * 1.8, -7 - Math.random() * 3, (Math.random() - 0.5) * 1.6);
        body.angularVelocity.set(
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 26,
        );
        world.addBody(body);

        dice.push({ group: d.group, body, decalMats: d.decalMats, readMode: d.readMode, faceNormals: d.faceNormals, values: d.values, readDir: d.readDir, vertexDirs: d.vertexDirs, vertexValues: d.vertexValues, restY: d.restY });
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
     * サイコロの現在の姿勢から「読み取り方向を向いている面」を返す。
     * 多くのダイスは上（readDir=+1）、d4 は底（readDir=-1）の面を読む。
     * cos はその面法線と読み取り方向の内積（1 に近いほど平らに静止）。
     */
    const upFaceOf = (d: Die, q: CANNON.Quaternion): { index: number; cos: number } => {
      tmpQ.set(q.x, q.y, q.z, q.w);
      let index = 0;
      let cos = -Infinity;
      for (let f = 0; f < d.faceNormals.length; f++) {
        const dot = d.readDir * tmpNrm.copy(d.faceNormals[f]).applyQuaternion(tmpQ).dot(WORLD_UP);
        if (dot > cos) { cos = dot; index = f; }
      }
      return { index, cos };
    };

    /**
     * d4（vertex モード）：現在の姿勢から「一番上を向いている頂点」を返す。
     * 正四面体は必ず1面を底に静止するので、対する頂点が明確に真上を向く。
     */
    const topVertexOf = (d: Die, q: CANNON.Quaternion): { index: number; cos: number } => {
      tmpQ.set(q.x, q.y, q.z, q.w);
      const dirs = d.vertexDirs!;
      let index = 0;
      let cos = -Infinity;
      for (let v = 0; v < dirs.length; v++) {
        const dot = tmpNrm.copy(dirs[v]).applyQuaternion(tmpQ).dot(WORLD_UP);
        if (dot > cos) { cos = dot; index = v; }
      }
      return { index, cos };
    };

    /** 静止判定用：読み取り面/頂点が真上（読み取り方向）にどれだけ揃っているか。 */
    const alignCos = (d: Die, q: CANNON.Quaternion): number =>
      (d.readMode === 'vertex' ? topVertexOf(d, q) : upFaceOf(d, q)).cos;

    /**
     * 仕上げ（settle）：物理を止め、上を向いた面の値を出目として確定する。
     * 位置は物理が置いたそのまま（剛体なので重なりは起きない）。回転だけ、
     * 上面をきっちり水平へ合わせるごく小さな整え（平らに落ちていれば数度以内）を
     * 短時間で補間する。＝不自然に回って見える動きにはならない。
     */
    const beginSettle = () => {
      phase = 'settle';
      settleStartMs = performance.now();

      flatFromQ.length = 0; flatToQ.length = 0; flatFromP.length = 0; flatToP.length = 0;
      settleResults.length = 0;
      const reads: number[] = [];
      const target = new THREE.Vector3();
      const localDir = new THREE.Vector3();
      dice.forEach((d) => {
        const fromQ = d.group.quaternion.clone();
        const q = d.body ? d.body.quaternion : (d.group.quaternion as unknown as CANNON.Quaternion);
        // 出目＝読み取り方向を向いた面（face）／上を向いた頂点（vertex＝d4）。
        // その方向を真上へ最小回転で合わせる（平らに落ちていれば数度以内）。
        if (d.readMode === 'vertex') {
          const top = topVertexOf(d, q);
          reads.push(d.vertexValues![top.index]);
          localDir.copy(d.vertexDirs![top.index]);
          target.copy(WORLD_UP);
        } else {
          const up = upFaceOf(d, q);
          reads.push(d.values[up.index]);
          localDir.copy(d.faceNormals[up.index]);
          target.copy(WORLD_UP).multiplyScalar(d.readDir);
        }
        if (d.body) { d.body.velocity.set(0, 0, 0); d.body.angularVelocity.set(0, 0, 0); d.body.sleep(); }
        tmpNrm.copy(localDir).applyQuaternion(fromQ);
        const toQ = new THREE.Quaternion().setFromUnitVectors(tmpNrm, target).multiply(fromQ);
        flatFromQ.push(fromQ);
        flatToQ.push(toQ);
        // 位置は据え置き（床の高さだけ揃える）。XZ は物理が置いたまま。
        const from = d.group.position.clone();
        flatFromP.push(from);
        flatToP.push(new THREE.Vector3(
          THREE.MathUtils.clamp(from.x, -bounds.xHalf, bounds.xHalf),
          d.restY,
          THREE.MathUtils.clamp(from.z, bounds.zLo, bounds.zHi),
        ));
      });
      // d% は十の位＋一の位を1つの結果に合成。それ以外は各ダイスの出目をそのまま。
      if (isPercentile && reads.length >= 2) settleResults.push(combinePercentile(reads[0], reads[1]));
      else settleResults.push(...reads);
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
          return alignCos(d, body.quaternion) > Math.cos(FLAT_ANGLE);
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
          // settleResults は毎ロール使い回す共有配列なので、コピーを渡して
          // 履歴に積んだ過去レコードの values が次のロールで書き換わらないようにする。
          if (!settledCalled) { settledCalled = true; propsRef.current.onSettled([...settleResults]); }
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
      updateBounds(); // 画角が変わったら壁（画面枠）も追従させる
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
      unitDecalGeo.dispose();
      floorMesh.geometry.dispose();
      (floorMesh.material as THREE.Material).dispose();
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
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
