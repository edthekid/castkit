import type { RollRecord } from './_constants';
import { D100 } from './_constants';

/** ダイス記法（例: "2d6" / "1d100"）。 */
export function notation(count: number, sides: number): string {
  return `${count}d${sides}`;
}

/** 1〜max のランダムな整数（両端含む）。 */
export function randInt(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

/** 面数に応じた1個分の出目を引く（d100 は 1〜100）。 */
export function rollOne(sides: number): number {
  return randInt(sides === D100 ? 100 : sides);
}

/**
 * Discord等に貼り付けやすいコピー用テキストを組み立てる。
 * 例: "🎲 2d6 -> [3, 5] = 8"
 */
export function formatRoll(record: RollRecord): string {
  return `🎲 ${record.notation} -> [${record.values.join(', ')}] = ${record.total}`;
}
