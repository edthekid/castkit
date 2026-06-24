import { ck } from '../_theme/colors';

// ─── 型 ─────────────────────────────────────────────────

/** あみだの横線1本 */
export interface Rung {
  row: number;   // 何段目か（0始まり）
  col: number;   // 左の柱インデックス（col と col+1 を繋ぐ）
}

/** 1人分のトレース経路 */
export interface TracePath {
  playerIndex: number;
  points: { x: number; y: number }[];  // SVG座標の通過点
  resultIndex: number;                  // 到達した結果のインデックス
}

// ─── SVGレイアウト定数 ───────────────────────────────────
export const SVG_PADDING_X    = 60;  // 左右余白
export const SVG_PADDING_TOP  = 70;  // 上余白（名前ラベル用）
export const SVG_PADDING_BTM  = 60;  // 下余白（結果ラベル用）
export const COL_WIDTH         = 90; // 柱間の横幅
export const ROW_HEIGHT        = 48; // 段の縦幅
export const MIN_RUNGS_PER_COL = 2;  // 柱間に最低何本横線を引くか
export const BUTTON_AREA_H     = 64; // 名前ラベル下のボタンエリア高さ(px DOM)

// ─── アニメーション定数 ──────────────────────────────────
// トレース時間(ms) ── 一定速度・合計8秒
export const TRACE_DURATION_FAST_MS = 0;     // 未使用（一定速度モード）
export const TRACE_DURATION_SLOW_MS = 0;     // 未使用（一定速度モード）
export const TRACE_DURATION_MS      = 8000;  // 合計8秒・一定速度

// ─── デフォルト値 ────────────────────────────────────────
export const DEFAULT_PLAYERS = ['Aさん', 'Bさん', 'Cさん', 'Dさん'];
export const DEFAULT_RESULTS = ['当たり', 'はずれ', 'はずれ', '特賞'];

// ─── 配色 ────────────────────────────────────────────────
// 色の定義は _theme/colors.ts の ck.series に集約（globals.cssの--ck-series-*と同期）。
// 個々の色コードはこのファイルに直接書かない。
export const PLAYER_COLORS: readonly string[] = ck.series;
