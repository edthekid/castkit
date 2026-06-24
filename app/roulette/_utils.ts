/** 角度(deg) → SVG座標 (上=0度, 時計回り) */
export function polarToXY(
  cx: number, cy: number, r: number, angleDeg: number,
): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

/** ホイール: 針が右側(90度)にある場合の当選インデックス */
export function calcWinnerIdx(rotation: number, numItems: number): number {
  const normalized = ((rotation % 360) + 360) % 360;
  const slice = 360 / numItems;
  const pointerAngle = ((90 - normalized) % 360 + 360) % 360;
  return Math.floor(pointerAngle / slice) % numItems;
}

/** イージング: 4次関数 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/** イージング: 後半に微振動を加えたルーレット風 */
export function easeOutElastic(t: number): number {
  if (t >= 1) return 1;
  const base = 1 - Math.pow(1 - t, 4);
  const osc = t > 0.6 ? Math.sin((t - 0.6) * Math.PI * 14) * 0.004 * (1 - t) : 0;
  return base + osc;
}

/**
 * n個のスライスに対して黒/白を交互に返す（モノクロ・2色デザイン）。
 * 人数に関わらず常に黒(#18181b)と白(#ffffff)の2色のみを使用する。
 */
export function generateColors(n: number): string[] {
  return Array.from({ length: n }, (_, i) => (i % 2 === 0 ? '#18181b' : '#ffffff'));
}
