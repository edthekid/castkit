import type { ArticleInput } from './_types';

/**
 * ── 新しい記事のひな型 ──
 *
 * 1. このファイルをコピーして app/_lib/articles/<slug>.ts を作る
 *    （<slug> は記事URLになる: /articles/<slug>。英小文字とハイフン推奨）
 * 2. 下の `template` を分かりやすい変数名にリネーム（例: export const myArticle）
 * 3. 各フィールドを埋める（本文 body は Markdown で書く。JSXのエスケープ不要）
 * 4. app/_lib/articles.ts で import して ARTICLES 配列に追加
 *
 * → ページ・記事一覧・ホームの記事枠・サイトマップ・JSON-LD が自動生成される。
 *
 * ※ このテンプレート自体は ARTICLES に登録しないこと（ひな型のため）。
 * ※ 詳しい書き方は同じフォルダの README.md を参照。
 */
export const template: ArticleInput = {
  // URLスラッグ。ファイル名と一致させる（/articles/<slug>）
  slug: 'your-slug',

  // 関連するツールのパス（記事⇄ツールの相互リンクに使う）
  toolHref: '/team-division',

  // 公開日 YYYY-MM-DD
  date: '2026-06-22',

  // 一覧カード・パンくず・CTAボタンで使う短いラベル
  tag: { ja: 'タグ名', en: 'Tag' },

  // 記事タイトル（H1・一覧・SEOタイトルに共用）。検索キーワードを前方に置く
  title: {
    ja: '記事のタイトル｜サブテーマ',
    en: 'Article Title: Subtitle',
  },

  // メタディスクリプション（検索結果の説明文・SEO）
  description: {
    ja: '記事の要約を100〜120文字前後で。検索キーワードを自然に含める。',
    en: 'A concise summary (~150 chars) that includes your search keywords.',
  },

  // 記事一覧カードに表示する抜粋
  excerpt: {
    ja: '一覧で表示される短い紹介文。',
    en: 'A short blurb shown in the article list.',
  },

  // 本文（Markdown）。使える記法は README.md を参照
  body: {
    ja: `導入の段落をここに書く。ツールの概要とメリットを2〜3文で簡潔に。

## 見出し（## はセクション見出し = h2）

**太字のリード文**

段落本文。段落は空行で区切る。改行1つは段落内の折り返しになる。

- 箇条書きはハイフンで
- **項目名**：のように太字も使える

## まとめ

最後にまとめの段落を書く。`,
    en: `Intro paragraph here. 2–3 concise sentences on the tool and its benefits.

## Heading (## is a section heading = h2)

**Bold lead-in**

Body paragraph. Separate paragraphs with a blank line; a single newline just wraps within a paragraph.

- Bullet lists use a hyphen
- **Item name**: bold works inside list items too

## Summary

A closing paragraph.`,
  },
};
