'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/*
 * 3Dサイコロの物理演算描画。
 *
 * 【方針】
 * - サイコロは cannon-es の Box 剛体としてトレイ内を転がる（重力・跳ね返り・回転・摩擦）。
 * - 出目は上位（useDice）で確定済み。物理はあくまで演出で、転がりが収まったら
 *   各サイコロを「結果の面が上」を向く姿勢へ短時間で整え（present）、その後 onSettled を呼ぶ。
 *   → 呼び出し側はこのタイミングで合計をポップアップ表示する。
 * - キャンバス内の色は描画用途のためトークン対象外（STYLEGUIDE 例外）。
 *
 * 面数が6を超えるダイス（d8/d20 等）や d100 も、視認性重視で「数字を描いた立方体」
 * として表現する（多面体ジオメトリは持たない割り切り）。結果の面は必ず上を向く。
 */

interface DiceCanvasProps {
  /** 各サイコロの確定した出目 */
  values: number[];
  /** 面数（表示の桁調整用。d100 は100） */
  sides: number;
  color: string;
  /** roll ごとに変化。変わるたびに振り直す */
  rollKey: number;
  /** 転がりが収まって結果面が見えたときに呼ぶ */
  onSettled: () => void;
}

const DIE_SIZE = 1.5;
const TRAY_HALF = 5.2;
const TUMBLE_CAP_MS = 1250; // これを超えたら整え動作に移る
const PRESENT_MS = 380;      // 結果面を上に向ける補間時間

/** #RRGGBB の明度から読みやすい文字色を選ぶ。 */
function readableText(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? '#18181b' : '#ffffff';
}

/** 1つの面（数字）のテクスチャを生成。 */
function faceTexture(value: number, bg: string, fg: string): THREE.CanvasTexture {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);
  // 枠
  ctx.strokeStyle = fg;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, S - 16, S - 16);
  ctx.globalAlpha = 1;
  // 数字
  ctx.fillStyle = fg;
  ctx.font = `bold ${value >= 100 ? 52 : value >= 10 ? 64 : 72}px "Space Grotesk", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(value), S / 2, S / 2 + 4);
  // 6・9 の下線（向き識別）
  if (value === 6 || value === 9) {
    ctx.fillRect(S / 2 - 18, S / 2 + 34, 36, 5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/** 結果値と、残り5面のダミー値（範囲内で散らす）を作る。index0 が結果（上面）。 */
function faceValues(result: number, sides: number): number[] {
  const max = sides === 100 ? 100 : sides;
  const faces = [result];
  let guard = 0;
  while (faces.length < 6 && guard++ < 50) {
    const v = Math.floor(Math.random() * max) + 1;
    faces.push(v);
  }
  while (faces.length < 6) faces.push(((faces.length + result) % max) + 1);
  return faces;
}

interface Die {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  targetQuat: THREE.Quaternion | null;
}

export function DiceCanvas({ values, sides, color, rollKey, onSettled }: DiceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 最新の props を参照するための ref（アニメーションループ内で使う）。
  const propsRef = useRef({ values, sides, color, onSettled });
  useEffect(() => {
    propsRef.current = { values, sides, color, onSettled };
  });

  // three / cannon のセットアップ（マウント時に1度）。
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    world: CANNON.World;
    dice: Die[];
    disposeTextures: THREE.Texture[];
    throwDice: (values: number[], sides: number, color: string) => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 320;

    // ── three ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 12.5, 8.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(5, 14, 8);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.left = -10;
    dir.shadow.camera.right = 10;
    dir.shadow.camera.top = 10;
    dir.shadow.camera.bottom = -10;
    scene.add(dir);

    // 影を受ける床（透明・影のみ）
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.14 }),
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ── cannon ─────────────────────────────────────────
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -34, 0) });
    world.allowSleep = true;

    const dieMat = new CANNON.Material('die');
    const groundMat = new CANNON.Material('ground');
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, groundMat, { friction: 0.35, restitution: 0.35 }));
    world.addContactMaterial(new CANNON.ContactMaterial(dieMat, dieMat, { friction: 0.2, restitution: 0.3 }));

    // 床
    const ground = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    // 壁（見えないトレイ）
    const addWall = (nx: number, nz: number, px: number, pz: number) => {
      const w = new CANNON.Body({ mass: 0, material: groundMat, shape: new CANNON.Plane() });
      w.quaternion.setFromEuler(0, Math.atan2(nx, nz), 0);
      w.position.set(px, 0, pz);
      world.addBody(w);
    };
    addWall(0, 1, 0, -TRAY_HALF);   // 奥
    addWall(0, -1, 0, TRAY_HALF);   // 手前
    addWall(1, 0, -TRAY_HALF, 0);   // 左
    addWall(-1, 0, TRAY_HALF, 0);   // 右

    const dice: Die[] = [];
    const disposeTextures: THREE.Texture[] = [];

    // アニメーション状態
    let phase: 'tumble' | 'present' | 'done' = 'done';
    let phaseStart = 0;
    let settledCalled = true;
    const presentFrom: THREE.Quaternion[] = [];
    const presentPos: THREE.Vector3[] = [];

    const clearDice = () => {
      for (const d of dice) {
        scene.remove(d.mesh);
        d.mesh.geometry.dispose();
        (d.mesh.material as THREE.Material[]).forEach((m) => m.dispose());
        world.removeBody(d.body);
      }
      dice.length = 0;
      for (const t of disposeTextures) t.dispose();
      disposeTextures.length = 0;
    };

    const throwDice = (vals: number[], sd: number, col: string) => {
      clearDice();
      const fg = readableText(col);
      const n = vals.length;

      vals.forEach((value, i) => {
        const faces = faceValues(value, sd);
        // three の BoxGeometry マテリアル順: +X,-X,+Y,-Y,+Z,-Z。結果(faces[0])を +Y に。
        const order = [faces[1], faces[2], faces[0], faces[3], faces[4], faces[5]];
        const materials = order.map((v) => {
          const tex = faceTexture(v, col, fg);
          disposeTextures.push(tex);
          return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.05 });
        });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE), materials);
        mesh.castShadow = true;
        scene.add(mesh);

        const body = new CANNON.Body({
          mass: 1,
          material: dieMat,
          shape: new CANNON.Box(new CANNON.Vec3(DIE_SIZE / 2, DIE_SIZE / 2, DIE_SIZE / 2)),
          linearDamping: 0.08,
          angularDamping: 0.12,
          allowSleep: true,
          sleepSpeedLimit: 0.15,
          sleepTimeLimit: 0.3,
        });
        // 投げ入れ：奥側の上方から手前へ散らす
        const spread = Math.min(TRAY_HALF - 1, 1.2 + n * 0.35);
        body.position.set(
          (i - (n - 1) / 2) * (spread * 2 / Math.max(1, n)) * 0.9,
          6 + Math.random() * 2.5,
          -TRAY_HALF + 1 + Math.random() * 1.5,
        );
        body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        body.velocity.set((Math.random() - 0.5) * 4, -2, 3.5 + Math.random() * 2.5);
        body.angularVelocity.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
        );
        world.addBody(body);

        dice.push({ mesh, body, targetQuat: null });
      });

      phase = 'tumble';
      phaseStart = performance.now();
      settledCalled = false;
      // モーション低減設定では転がさず、すぐに結果面を提示する。
      if (reduceMotion) beginPresent();
      startLoop();
    };

    const beginPresent = () => {
      phase = 'present';
      phaseStart = performance.now();
      presentFrom.length = 0;
      presentPos.length = 0;
      dice.forEach((d) => {
        d.body.sleep();
        // 結果面(+Y)を上に向ける。yaw はランダムで自然に。
        const yaw = Math.random() * Math.PI * 2;
        d.targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
        presentFrom.push(d.mesh.quaternion.clone());
        // 着地位置（トレイ内にクランプ、床上）
        const x = THREE.MathUtils.clamp(d.body.position.x, -TRAY_HALF + 1, TRAY_HALF - 1);
        const z = THREE.MathUtils.clamp(d.body.position.z, -TRAY_HALF + 1, TRAY_HALF - 1);
        presentPos.push(new THREE.Vector3(x, DIE_SIZE / 2, z));
      });
    };

    // ── ループ ─────────────────────────────────────────
    // 転がり/整え中だけ回し、静止（done）したら停止する（無駄な描画を避ける）。
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
      clock.getDelta(); // 溜まった経過をリセット（初回 dt が過大にならないように）
      raf = requestAnimationFrame(animate);
    };

    const allAsleep = () => dice.length > 0 && dice.every(
      (d) => d.body.sleepState === CANNON.Body.SLEEPING
        || d.body.velocity.lengthSquared() < 0.05 && d.body.angularVelocity.lengthSquared() < 0.05,
    );

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 1 / 30);

      if (phase === 'tumble') {
        world.step(1 / 60, dt, 3);
        for (const d of dice) {
          d.mesh.position.copy(d.body.position as unknown as THREE.Vector3);
          d.mesh.quaternion.copy(d.body.quaternion as unknown as THREE.Quaternion);
        }
        if (performance.now() - phaseStart > TUMBLE_CAP_MS || allAsleep()) {
          beginPresent();
        }
      } else if (phase === 'present') {
        const p = Math.min(1, (performance.now() - phaseStart) / PRESENT_MS);
        // イージング（ease-out）
        const e = 1 - Math.pow(1 - p, 3);
        dice.forEach((d, i) => {
          if (d.targetQuat) d.mesh.quaternion.slerpQuaternions(presentFrom[i], d.targetQuat, e);
          d.mesh.position.lerp(presentPos[i], e);
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

      // 静止したら最後のフレームを描いてループを止める。
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
      // ループ停止中（静止表示）でもサイズ変更を反映するため1フレーム描く。
      if (!running) renderer.render(scene, camera);
    });
    ro.observe(container);

    sceneRef.current = { renderer, scene, camera, world, dice, disposeTextures, throwDice };

    // 初回の投擲（マウント時点で rollKey>0）
    throwDice(propsRef.current.values, propsRef.current.sides, propsRef.current.color);

    return () => {
      stopLoop();
      ro.disconnect();
      clearDice();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    };
    // マウント時のみ構築。振り直しは下の effect で行う。
  }, []);

  // rollKey が変わるたびに振り直す（初回マウントの投擲は上の effect が担当）。
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    const s = sceneRef.current;
    if (s) s.throwDice(propsRef.current.values, propsRef.current.sides, propsRef.current.color);
  }, [rollKey]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
