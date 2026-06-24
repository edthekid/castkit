/**
 * ════════════════════════════════════════════════════════
 * CastKit デザイントークン（モノクロパレット）
 * ────────────────────────────────────────────────────────
 * 【メンテナンス方法】
 *
 * 1. globals.css の :root セクションを編集する
 *    （ここが全色の Single Source of Truth）
 *
 * 2. このファイルの値を globals.css に合わせる
 *    （TypeScript/JSXのインラインスタイルはこのファイル経由）
 *
 * 3. Tailwind クラス名（bg-zinc-900等）は変更不要
 *    （CSS変数と別系統のためこのファイルに含めない）
 *
 * 【使い方】
 *   import { ck } from '@/_theme/colors';
 *   <div style={{ color: ck.text.primary, background: ck.bg.card }} />
 *   const color = ck.series[i % ck.series.length];
 * ════════════════════════════════════════════════════════
 */

// ─── グレースケール基本パレット ──────────────────────────
// globals.css の --ck-gray-* と同じ値を保つこと
export const gray = {
  50:  '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
} as const;

// ─── セマンティックトークン ────────────────────────────
// globals.css の --ck-* と同じ値を保つこと
export const ck = {
  // 背景
  bg: {
    page:   '#ffffff',
    card:   gray[50],
    muted:  gray[100],
  },

  // ボーダー
  border: {
    default: gray[200],
    strong:  gray[300],
  },

  // テキスト
  text: {
    primary:   gray[900],
    secondary: gray[500],
    muted:     gray[400],
    onDark:    '#ffffff',
  },

  // アクセント
  accent: {
    default: gray[900],
    soft:    gray[100],
    border:  gray[200],
  },

  // シャドウ（rgba値はCSS的に柔軟な使い方が必要なため文字列で保持）
  shadow: {
    soft: 'rgba(17,17,20,0.06)',
    mid:  'rgba(17,17,20,0.18)',
    glow: 'rgba(17,17,20,0.10)',
    ring: 'rgba(17,17,20,0.08)',
  },

  // グラデーション
  gradient: {
    text:   `linear-gradient(135deg, ${gray[900]} 0%, ${gray[600]} 60%, ${gray[400]} 100%)`,
    btn:    `linear-gradient(135deg, ${gray[900]}, ${gray[700]})`,
    badge:  'linear-gradient(135deg, rgba(17,17,20,0.06), rgba(17,17,20,0.03))',
    active: 'linear-gradient(135deg, rgba(17,17,20,0.08), rgba(17,17,20,0.03))',
  },

  // シリーズカラー（amida・team-divisionで複数対象を色で見分ける用途）
  // 全体はモノクロ基調だが、判別性とおしゃれさを両立するため
  // 彩度を抑えたディープトーン（ネイビー・ワイン・フォレスト等）を使用。
  // 隣り合うインデックスで色相が重複しないよう配置している。
  series: [
    '#3a3a40', // 0: ソフトブラック
    '#a8475a', // 1: ワインレッド
    '#3f6a8a', // 2: ネイビーブルー
    '#7c8f54', // 3: オリーブグリーン
    '#7d6448', // 4: ブラウン
    '#5c5c66', // 5: グレー
    '#a3702f', // 6: バーントオレンジ
    '#477366', // 7: フォレストグリーン
    '#7c5380', // 8: モーブパープル
    '#8d8d96', // 9: ミッドグレー
    '#b3923f', // 10: マスタード
    '#5d7488', // 11: スレートブルー
  ] as readonly string[],
} as const;
