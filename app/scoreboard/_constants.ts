import { ck } from '../_theme/colors';

// ─── 型 ─────────────────────────────────────────────────
export interface Team {
  id: string;
  /** 表示名。空のときはプレースホルダ（「チーム n」）を表示する。 */
  name: string;
  /**
   * チーム固有の連番（1始まり）。デフォルト名「チーム n」に使う。
   * 配列インデックスではなくチームに紐づくため、並べ替えてもデフォルト名が一緒に移動する。
   */
  seq: number;
  score: number;
  /** テーマカラー（ck.series のいずれか） */
  color: string;
}

/** スコアの記録スナップショット（「記録」ボタンで履歴スタックに積む） */
export interface ScoreRecord {
  id: string;
  /** 記録時刻のラベル（作成時に確定。レンダリング中に toLocale* を呼ばないため） */
  label: string;
  entries: { name: string; score: number; color: string }[];
}

/** 表示デザイン。7セグ風 / モダンミニマル / カードスタイル */
export type DesignMode = 'segment' | 'minimal' | 'card';

/** 並び順。default = チーム固有 seq 順 / score = 得点の高い順 */
export type SortMode = 'default' | 'score';

/**
 * スコア表示フォント（「ミニマル」「カード」デザインのみ反映。7セグは DSEG 固定）。
 * 定義は共通モジュール app/_lib/fonts.ts に集約（タイマーと共用）。ここでは
 * 従来の import 経路を保つため再エクスポートする。
 */
export { type FontOption, FONTS, DEFAULT_FONT_ID, getFontStack } from '../_lib/fonts';

// ─── 定数 ────────────────────────────────────────────────
export const MIN_TEAMS = 2;   // 最小チーム数
export const MAX_TEAMS = 10;  // 最大チーム数
export const MAX_HISTORY = 50; // Undo スタックの深さ
export const MAX_RECORDS = 30; // 記録スタックの保持数

export const DESIGN_MODES: readonly DesignMode[] = ['segment', 'minimal', 'card'];

/** チームカラーの候補。色の定義は _theme/colors.ts の ck.series に集約（globals.css の --ck-series-* と同期）。 */
export const TEAM_COLORS: readonly string[] = ck.series;

/** LocalStorage キー（オートセーブ） */
export const STORAGE_KEY = 'castkit:scoreboard:v1';
