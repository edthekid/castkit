// サイコロツールの定数・型。
// ここで定義する色は「サイコロ盤面の描画色」であり、STYLEGUIDE の
// 描画用途の例外に該当するためハードコードを許容する（トークン非対象）。

export type DiceMode = 'basic' | 'trpg' | 'chinchiro';

export type RollPhase = 'idle' | 'rolling' | 'result';

/** チンチロで使うサイコロ数・面数（固定）。 */
export const CHINCHIRO_COUNT = 3;
export const CHINCHIRO_SIDES = 6;

/** 基本モードは6面（d6）固定。個数だけ選ぶ。 */
export const BASIC_SIDES = 6;

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
  /** チンチロの結果（チンチロモードのみ）。表示は role+value を i18n で解決する。 */
  chinchiro?: { role: string; value: number | null; multiplier: number };
}

export const MIN_DICE = 1;
export const MAX_DICE = 10;

/** 面数（数値入力）の下限・上限。 */
export const MIN_SIDES = 2;
export const MAX_SIDES = 100;

/** d100 は面数 100 として扱う特別値（パーセンタイル判定の注記に使用）。 */
export const D100 = 100;

/**
 * TRPGモードのダイスセット・プリセット（個数＋面数をまとめて設定）。
 * 面数の小さい順に並べ、整ったグリッドで表示する。
 */
export const DICE_PRESETS: readonly { count: number; sides: number }[] = [
  { count: 1, sides: 4 },
  { count: 2, sides: 6 },
  { count: 3, sides: 6 },
  { count: 4, sides: 6 },
  { count: 1, sides: 8 },
  { count: 1, sides: 10 },
  { count: 2, sides: 10 },
  { count: 1, sides: 12 },
  { count: 1, sides: 20 },
  { count: 2, sides: 20 },
  { count: 1, sides: 100 },
];

export const MAX_HISTORY = 20;

/**
 * ロール演出の最大時間（ms）。3D物理演算（DiceCanvas の SETTLE_TIMEOUT_MS）が
 * この時間内に必ず静止するよう、それより十分長い値をセーフティとして設定する。
 * 物理側から早期に settle 通知（onSettled）が来た場合は、この値を待たずに確定する。
 */
export const ROLL_DURATION_MS = 4800;

/** localStorage キー（モード等の設定を保存）。 */
export const STORAGE_KEY = 'castkit.dice.v1';
