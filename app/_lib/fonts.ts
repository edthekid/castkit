/**
 * 表示フォントの共通定義（スコアボードとタイマーで共用）。
 * 外部ダウンロードを避けるため、いずれもシステム標準フォントのスタックで
 * 構成する（プライバシー・表示速度を維持。CLAUDE.md ルール9/10）。
 */

export interface FontOption {
  id: string;
  /** 表示名（日英共通）。 */
  label: string;
  /** 空文字はアプリ標準フォント（inherit）を意味する。 */
  stack: string;
}

export const DEFAULT_FONT_ID = 'standard';

export const FONTS: FontOption[] = [
  { id: 'standard',   label: 'Standard',      stack: '' },
  { id: 'mono',       label: 'Monospace',     stack: 'ui-monospace, "SF Mono", "Cascadia Mono", Consolas, "Liberation Mono", monospace' },
  { id: 'impact',     label: 'Impact',        stack: 'Impact, Haettenschweiler, "Franklin Gothic Bold", "Arial Narrow Bold", sans-serif' },
  { id: 'heavy',      label: 'Heavy',         stack: '"Arial Black", "Arial Bold", Gadget, sans-serif' },
  { id: 'rounded',    label: 'Rounded',       stack: '"Arial Rounded MT Bold", "Hiragino Maru Gothic ProN", ui-rounded, "Segoe UI", system-ui, sans-serif' },
  { id: 'serif',      label: 'Serif',         stack: 'Georgia, "Times New Roman", "Yu Mincho", serif' },
  { id: 'slab',       label: 'Slab',          stack: 'Rockwell, "Roboto Slab", "Courier Bold", Courier, serif' },
  { id: 'typewriter', label: 'Typewriter',    stack: '"Courier New", Courier, "Lucida Console", monospace' },
  { id: 'condensed',  label: 'Condensed',     stack: '"Arial Narrow", "Roboto Condensed", "Liberation Sans Narrow", sans-serif' },
  { id: 'clean',      label: 'Clean',         stack: 'Tahoma, Verdana, Geneva, "Segoe UI", sans-serif' },
  { id: 'system',     label: 'System UI',     stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { id: 'helvetica',  label: 'Helvetica',     stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: 'arial',      label: 'Arial',         stack: 'Arial, "Liberation Sans", "Helvetica Neue", sans-serif' },
  { id: 'verdana',    label: 'Verdana',       stack: 'Verdana, Geneva, "DejaVu Sans", sans-serif' },
  { id: 'trebuchet',  label: 'Trebuchet',     stack: '"Trebuchet MS", "Segoe UI", Tahoma, sans-serif' },
  { id: 'palatino',   label: 'Palatino',      stack: '"Palatino Linotype", "Book Antiqua", Palatino, "URW Palladio L", serif' },
  { id: 'garamond',   label: 'Garamond',      stack: 'Garamond, "EB Garamond", "Adobe Garamond Pro", Georgia, serif' },
  { id: 'consolas',   label: 'Consolas',      stack: 'Consolas, "Lucida Console", "DejaVu Sans Mono", monospace' },
  { id: 'gothic',     label: 'Century Gothic', stack: '"Century Gothic", "Apple SD Gothic Neo", "URW Gothic", "Avant Garde", sans-serif' },
  { id: 'copperplate', label: 'Copperplate',  stack: 'Copperplate, "Copperplate Gothic Light", "Trebuchet MS", serif' },
];

/** フォントID → font-family スタック（未知IDは標準）。 */
export function getFontStack(id: string): string {
  return FONTS.find((f) => f.id === id)?.stack ?? '';
}
