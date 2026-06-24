import { ck } from '../_theme/colors';

// ─── 型 ─────────────────────────────────────────────────
export interface TeamPattern {
  id: number;
  patternName: string;
  teams: string[][];
}

export type TabType = 'unplayed' | 'played';

// ─── 定数 ────────────────────────────────────────────────
export const MAX_RESULTS    = 100; // 生成する組み合わせの上限
export const MAX_TEAM_COUNT = 20;  // チーム数の最大値
export const MIN_TEAM_COUNT = 2;   // チーム数の最小値

// チームアクセントカラー。色の定義は _theme/colors.ts の ck.series に集約
// （globals.cssの--ck-series-*と同期）。最初の4色を使用。
export const TEAM_COLORS: readonly string[] = ck.series.slice(0, 4);
