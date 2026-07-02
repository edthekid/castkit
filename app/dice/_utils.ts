import type { RollRecord } from './_constants';
import type { TranslationKey } from '../_i18n/translations';

/** ダイス記法（例: "2d6" / "1d100"）。 */
export function notation(count: number, sides: number): string {
  return `${count}d${sides}`;
}

/** 1〜max のランダムな整数（両端含む）。 */
export function randInt(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

/** 面数に応じた1個分の出目を引く（1〜sides）。 */
export function rollOne(sides: number): number {
  return randInt(sides);
}

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/** チンチロの役名を現在の言語で組み立てる（通常役・ゾロ目は数字を差し込む）。 */
export function chinchiroName(role: string, value: number | null, t: Translate): string {
  switch (role) {
    case 'pinzoro': return t('dice.chinchiro.pinzoro');
    case 'zorome':  return t('dice.chinchiro.zorome', { n: value ?? 0 });
    case 'shigoro': return t('dice.chinchiro.shigoro');
    case 'hifumi':  return t('dice.chinchiro.hifumi');
    case 'normal':  return t('dice.chinchiro.normal', { n: value ?? 0 });
    default:        return t('dice.chinchiro.menashi');
  }
}

/**
 * Discord等に貼り付けやすいコピー用テキストを組み立てる。
 * 例: "🎲 2d6 -> [3, 5] = 8"　チンチロは "🎲 [1, 2, 2] シゴロ ×2" 形式。
 */
export function formatRoll(record: RollRecord, t?: Translate): string {
  if (record.chinchiro) {
    const name = t ? chinchiroName(record.chinchiro.role, record.chinchiro.value, t) : record.chinchiro.role;
    return `🎲 [${record.values.join(', ')}] ${name} ×${record.chinchiro.multiplier}`;
  }
  return `🎲 ${record.notation} -> [${record.values.join(', ')}] = ${record.total}`;
}
