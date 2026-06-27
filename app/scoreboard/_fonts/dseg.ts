import localFont from 'next/font/local';

/**
 * DSEG 7セグメントフォント（デジタル時計風）。スコアボードの「7セグ」デザインで使用。
 *
 * ライセンス: SIL Open Font License 1.1 — © 2017 keshikan（全文は ./DSEG-LICENSE.txt）。
 * 自己ホスト（外部スクリプト・外部CDNに依存しない）でプライバシー不変条件を維持する。
 */
export const dseg7 = localFont({
  src: './DSEG7Classic-Bold.woff2',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
});
