import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/*
 * TRPG用ダイスの多面体形状（d4/d8/d10/d12/d20、d%はd10形状）。
 *
 * 1つの「頂点＋面」定義から、描画用ジオメトリ・物理コライダー（cannon の
 * ConvexPolyhedron）・数字を貼る面情報（重心/法線/向き/サイズ）をまとめて生成する。
 * d6 と非標準の面数は呼び出し側で従来の角丸キューブにフォールバックする。
 *
 * すべて「概略の外接半径 = TARGET_RADIUS」に正規化して返す。
 */

export type DieKind = 'd4' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

/** 面数 → 多面体種別。該当なしは null（角丸キューブにフォールバック）。 */
export function polyKindForSides(sides: number): DieKind | null {
  switch (sides) {
    case 4: return 'd4';
    case 8: return 'd8';
    case 10: return 'd10';
    case 12: return 'd12';
    case 20: return 'd20';
    case 100: return 'd100';
    default: return null;
  }
}

export interface LabeledFace {
  normal: THREE.Vector3; // 外向き法線（ローカル）
  center: THREE.Vector3; // 面の重心（ローカル）
  up: THREE.Vector3;     // 面上での「上」方向（数字の向き・ローカル）
  size: number;          // 数字デカールの一辺の目安
}

/**
 * d4 用の隅（頂点付近）に貼る数字デカール。1つの面に3つ並び、各頂点に集まる
 * 3つの隅は同じ値を持つ（＝頂点＝出目）。up は頂点方向＝数字の上向き。
 */
export interface CornerDecal {
  center: THREE.Vector3; // デカール中心（ローカル）
  normal: THREE.Vector3; // 面の外向き法線（ローカル）
  up: THREE.Vector3;     // 数字の上向き＝頂点へ向かう方向（ローカル）
  size: number;          // デカール一辺の目安
  vertex: number;        // どの頂点の値を刻むか（vertexDirs の添字）
}

export interface DiceShape {
  geometry: THREE.BufferGeometry;       // 本体（フラットシェード）。共有可。
  cannonShape: CANNON.ConvexPolyhedron; // 物理コライダー。共有可。
  readMode: 'face' | 'vertex';          // 出目の読み方（面/頂点＝d4）
  faces: LabeledFace[];                 // 数字を貼る面（face モードで使用）
  corners?: CornerDecal[];              // 隅の数字（vertex モード＝d4 で使用）
  vertexDirs?: THREE.Vector3[];         // 各頂点への単位方向（vertex モード＝頂点読み）
  readDir: 1 | -1;                      // face モードで出目を読む向き（+1=上, -1=下）
  inradius: number;                     // 中心→面 の距離（着地時の静止高さ）
  radius: number;                       // 概略の外接半径（配置・カメラ用）
}

/** ダイスの目標外接半径（角丸キューブと見た目の大きさを合わせる）。 */
const TARGET_RADIUS = 1.25;

// ── 汎用ヘルパー ─────────────────────────────────────────

interface RawPoly {
  verts: THREE.Vector3[];
  /** 多角形面（頂点インデックス列）。数字ラベルの単位。 */
  polys: number[][];
}

/** THREE の多面体ジオメトリ（三角形スープ）から、頂点をまとめ、法線ごとに面を復元する。 */
function fromThreeGeometry(geo: THREE.BufferGeometry): RawPoly {
  const pos = geo.getAttribute('position');
  const verts: THREE.Vector3[] = [];
  const keyToIndex = new Map<string, number>();
  const vindex = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    let i = keyToIndex.get(k);
    if (i === undefined) { i = verts.length; verts.push(new THREE.Vector3(x, y, z)); keyToIndex.set(k, i); }
    return i;
  };
  const tris: [number, number, number][] = [];
  for (let t = 0; t < pos.count; t += 3) {
    tris.push([
      vindex(pos.getX(t), pos.getY(t), pos.getZ(t)),
      vindex(pos.getX(t + 1), pos.getY(t + 1), pos.getZ(t + 1)),
      vindex(pos.getX(t + 2), pos.getY(t + 2), pos.getZ(t + 2)),
    ]);
  }

  // 三角形を法線でグルーピング（同一平面 = 同じ面）。
  // 法線を文字列に丸めて分類すると、同一面のファン三角形でも丸め境界でバケットが
  // 割れて面数が増える（例：正十二面体が17面に化ける）。凸多面体では隣接面の法線
  // が十分に離れている（十二面体で約63°）ため、法線が「ほぼ平行」（dot>0.99）な
  // 三角形を同じ面へマージする許容誤差方式にして、同一面の分裂を防ぐ。
  const groups: { normal: THREE.Vector3; verts: Set<number> }[] = [];
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), nrm = new THREE.Vector3();
  for (const [a, b, c] of tris) {
    tmpA.subVectors(verts[b], verts[a]);
    tmpB.subVectors(verts[c], verts[a]);
    nrm.crossVectors(tmpA, tmpB).normalize();
    let g = groups.find((x) => x.normal.dot(nrm) > 0.99);
    if (!g) { g = { normal: nrm.clone(), verts: new Set() }; groups.push(g); }
    g.verts.add(a); g.verts.add(b); g.verts.add(c);
  }

  // 各グループの頂点を、面の重心まわりに角度順（CCW）に並べて多角形にする
  const polys: number[][] = [];
  for (const group of groups) {
    const idx = [...group.verts];
    const center = new THREE.Vector3();
    idx.forEach((i) => center.add(verts[i]));
    center.multiplyScalar(1 / idx.length);
    const n = center.clone().normalize(); // 中心=原点なので重心方向が外向き法線
    const t = verts[idx[0]].clone().sub(center).normalize();
    const bt = new THREE.Vector3().crossVectors(n, t);
    idx.sort((p, q) => {
      const vp = verts[p].clone().sub(center);
      const vq = verts[q].clone().sub(center);
      return Math.atan2(vp.dot(bt), vp.dot(t)) - Math.atan2(vq.dot(bt), vq.dot(t));
    });
    polys.push(idx);
  }
  return { verts, polys };
}

/** 頂点を目標半径へスケールし、面法線が外向き（CCW）になるよう整える。 */
function normalizePoly(raw: RawPoly): RawPoly {
  const maxLen = Math.max(...raw.verts.map((v) => v.length()));
  const s = TARGET_RADIUS / maxLen;
  const verts = raw.verts.map((v) => v.clone().multiplyScalar(s));
  const polys = raw.polys.map((face) => {
    // 面の法線が外向き（重心方向と同じ）でなければ反転
    const c = new THREE.Vector3();
    face.forEach((i) => c.add(verts[i]));
    c.multiplyScalar(1 / face.length);
    const nrm = new THREE.Vector3()
      .crossVectors(verts[face[1]].clone().sub(verts[face[0]]), verts[face[2]].clone().sub(verts[face[0]]))
      .normalize();
    return nrm.dot(c) < 0 ? [...face].reverse() : face;
  });
  return { verts, polys };
}

/**
 * 五角二重錐（トラペゾヘドロン）＝d10 の頂点・面を作る。
 *
 * 赤道の10頂点は上下にジグザグ（+e/-e）する2つの五角形リング。カイト面が
 * 「平面」になるには振れ幅 e を任意に決められず、頂点高さ H と次の関係が必要：
 *   e = H·(1-cos36°)/(1+cos36°)
 * これを外すと各カイトがねじれて、面がへこんだ不正な形状になる（要注意）。
 * R は赤道半径＝横幅、H は尖り具合。見た目の縦横比は正規化後で R/H に比例。
 */
function trapezohedron(): RawPoly {
  const n = 5;
  const R = 1;                           // 赤道リング半径（横幅）
  const H = 1.16;                        // 頂点の高さ（尖り具合）
  const c = Math.cos(Math.PI / n);       // cos36°
  const e = (H * (1 - c)) / (1 + c);     // カイトが平面になる上下振れ（必須条件）
  const verts: THREE.Vector3[] = [
    new THREE.Vector3(0, H, 0),   // 0: 上頂点
    new THREE.Vector3(0, -H, 0),  // 1: 下頂点
  ];
  for (let k = 0; k < 2 * n; k++) {
    const ang = (k * Math.PI) / n;
    verts.push(new THREE.Vector3(R * Math.cos(ang), k % 2 === 0 ? e : -e, R * Math.sin(ang)));
  }
  const R_ = (k: number) => 2 + ((k % (2 * n)) + 2 * n) % (2 * n); // リング頂点index
  const polys: number[][] = [];
  for (let i = 0; i < n; i++) {
    // 上のカイト：上頂点・高・低・高
    polys.push([0, R_(2 * i), R_(2 * i + 1), R_(2 * i + 2)]);
    // 下のカイト：下頂点・低・高・低
    polys.push([1, R_(2 * i + 1), R_(2 * i + 2), R_(2 * i + 3)]);
  }
  return { verts, polys };
}

/** RawPoly から DiceShape（描画・物理・面情報）を構築する。 */
function buildShape(raw: RawPoly, readDir: 1 | -1, readMode: 'face' | 'vertex' = 'face'): DiceShape {
  const { verts, polys } = normalizePoly(raw);

  // ── 描画ジオメトリ（多角形をファン三角形に、フラット法線で）──
  const positions: number[] = [];
  const normals: number[] = [];
  const faces: LabeledFace[] = [];
  const corners: CornerDecal[] = [];
  for (const face of polys) {
    const center = new THREE.Vector3();
    face.forEach((i) => center.add(verts[i]));
    center.multiplyScalar(1 / face.length);
    const normal = new THREE.Vector3()
      .crossVectors(verts[face[1]].clone().sub(verts[face[0]]), verts[face[2]].clone().sub(verts[face[0]]))
      .normalize();
    // ファン三角形
    for (let i = 1; i < face.length - 1; i++) {
      const a = verts[face[0]], b = verts[face[i]], c = verts[face[i + 1]];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
      for (let k = 0; k < 3; k++) normals.push(normal.x, normal.y, normal.z);
    }
    // 数字の向き（面上での「上」）：ワールドYを面へ射影。法線がYに近い面はZを使う。
    let up = new THREE.Vector3(0, 1, 0).addScaledVector(normal, -normal.y);
    if (up.lengthSq() < 1e-4) up = new THREE.Vector3(0, 0, 1).addScaledVector(normal, -normal.z);
    up.normalize();
    // 面の内接半径の目安（重心→辺の最短距離）
    let inFace = Infinity;
    for (let i = 0; i < face.length; i++) {
      const p = verts[face[i]], q = verts[face[(i + 1) % face.length]];
      const mid = p.clone().add(q).multiplyScalar(0.5);
      inFace = Math.min(inFace, mid.distanceTo(center));
    }
    faces.push({ normal, center, up, size: inFace * 1.5 });

    // vertex モード（d4）：各面の3隅に数字を置く。数字は頂点方向を上向きに、
    // 重心と頂点の中間あたりへ配置。頂点に集まる3隅は同じ値になる（＝出目）。
    if (readMode === 'vertex') {
      const edge = verts[face[0]].distanceTo(verts[face[1]]);
      for (const vi of face) {
        const toV = verts[vi].clone().sub(center);
        corners.push({
          center: center.clone().addScaledVector(toV, 0.52),
          normal: normal.clone(),
          up: toV.clone().normalize(),
          size: edge * 0.34,
          vertex: vi,
        });
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

  // ── 物理コライダー（三角形で ConvexPolyhedron）──
  const cannonVerts = verts.map((v) => new CANNON.Vec3(v.x, v.y, v.z));
  const cannonFaces: number[][] = [];
  for (const face of polys) {
    for (let i = 1; i < face.length - 1; i++) cannonFaces.push([face[0], face[i], face[i + 1]]);
  }
  const cannonShape = new CANNON.ConvexPolyhedron({ vertices: cannonVerts, faces: cannonFaces });

  const inradius = Math.min(...faces.map((f) => f.center.length()));
  const radius = Math.max(...verts.map((v) => v.length()));
  return {
    geometry, cannonShape, readMode, faces, readDir, inradius, radius,
    ...(readMode === 'vertex'
      ? { corners, vertexDirs: verts.map((v) => v.clone().normalize()) }
      : {}),
  };
}

// ── キャッシュ付きファクトリ ─────────────────────────────
const cache = new Map<DieKind, DiceShape>();

export function getDiceShape(kind: DieKind): DiceShape {
  const cached = cache.get(kind);
  if (cached) return cached;

  let shape: DiceShape;
  switch (kind) {
    case 'd4':
      // 頂点読み：各面の3隅に数字。机上で上を向いた頂点＝出目（本物のd4と同じ）。
      shape = buildShape(fromThreeGeometry(new THREE.TetrahedronGeometry(1)), 1, 'vertex');
      break;
    case 'd8':
      shape = buildShape(fromThreeGeometry(new THREE.OctahedronGeometry(1)), 1);
      break;
    case 'd12':
      shape = buildShape(fromThreeGeometry(new THREE.DodecahedronGeometry(1)), 1);
      break;
    case 'd20':
      shape = buildShape(fromThreeGeometry(new THREE.IcosahedronGeometry(1)), 1);
      break;
    case 'd10':
    case 'd100':
      shape = buildShape(trapezohedron(), 1);
      break;
  }
  cache.set(kind, shape);
  return shape;
}
