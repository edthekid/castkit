// ─── 型 ─────────────────────────────────────────────────
export type DesignType = 1 | 2;

// ─── デフォルト候補者 ────────────────────────────────────
export const DEFAULT_ITEMS = [];

// ─── スロット定数 ────────────────────────────────────────
export const SLOT_CELL_H  = 80; // 1セルの高さ(px)
export const SLOT_VISIBLE = 3;  // 表示セル数
export const SLOT_LAPS    = 10; // 最低周回数

// ─── 配色パレット ──────────────────────────────────────
// ルーレットホイールの扇形カラー。黒/白の2色のみを使用するモノクロ配色。
// 実際の生成ロジックは _utils.ts の generateColors() を参照。
export const BASE_PALETTE = ['#18181b', '#ffffff'] as const;

// ─── Mac風タイトルバーボタン色 ─────────────────────────────
// スロットマシンのカード上部に表示する装飾用ドット（閉じる・最小化・最大化）。
// OS UIを模したデザインシンボルのため、ここのみ例外的に有彩色を使用する。
export const MAC_BUTTONS = {
  close:    '#e74c3c',
  minimize: '#f5a623',
  maximize: '#5bbf6e',
} as const;
