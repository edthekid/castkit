// サイコロツールの定数・型。
// ここで定義する色は「サイコロ盤面の描画色」であり、STYLEGUIDE の
// 描画用途の例外に該当するためハードコードを許容する（トークン非対象）。

export type DiceMode = 'basic' | 'trpg';

export type RollPhase = 'idle' | 'rolling' | 'result';

/** 1回分の出目（各サイコロの面数と出た値）。 */
export interface DieResult {
  sides: number;
  value: number;
}

/** 履歴1件。 */
export interface RollRecord {
  id: string;
  /** 例: "2d6" / "1d100" */
  notation: string;
  /** 各サイコロの出目（表示順） */
  values: number[];
  total: number;
  sides: number;
  count: number;
  /** d100（パーセンタイル 1〜100）かどうか */
  isD100: boolean;
}

export const MIN_DICE = 1;
export const MAX_DICE = 10;

/** 基本モードで選べる面数。 */
export const BASIC_SIDES = [4, 6, 8, 10, 12, 20] as const;

/** TRPGモードで選べるダイス種別（d100 を含む）。 */
export const TRPG_SIDES = [4, 6, 8, 10, 12, 20, 100] as const;

/** d100 は面数 100 として扱う特別値。 */
export const D100 = 100;

/**
 * TRPGモードのダイスセット・プリセット（個数＋面数をまとめて設定）。
 * よく使う構成をワンタップで組めるようにする。
 */
export const TRPG_PRESETS: readonly { count: number; sides: number }[] = [
  { count: 1, sides: 20 },  // 判定・攻撃（D&D 等）
  { count: 2, sides: 6 },   // 2d6 系（多数のシステム）
  { count: 3, sides: 6 },   // 能力値
  { count: 4, sides: 6 },   // 能力値（4個）
  { count: 2, sides: 10 },  // 2d10
  { count: 1, sides: 100 }, // パーセンタイル
];

export const MAX_HISTORY = 20;

/**
 * ロール演出の最大時間（ms）。3D物理演算がこの時間内に静止するよう調整し、
 * 静止後に合計をポップアップ表示する。物理側から早期に settle 通知が来た場合も
 * この値を上限のセーフティとして使う。
 */
export const ROLL_DURATION_MS = 2200;

/** localStorage キー（色・モード等の設定を保存）。 */
export const STORAGE_KEY = 'castkit.dice.v1';

/**
 * ダイスの色プリセット（描画色。トークン対象外）。
 * 配信画面でも見やすい、彩度を抑えた視認性の高い色を厳選。
 */
export const COLOR_PRESETS: readonly string[] = [
  '#d64545', // レッド
  '#3f6a8a', // ブルー
  '#4f8a5b', // グリーン
  '#a3702f', // アンバー
  '#7c5380', // パープル
  '#2f3136', // チャコール
  '#e4e4e7', // ホワイト
];

export const DEFAULT_COLOR = '#d64545';
