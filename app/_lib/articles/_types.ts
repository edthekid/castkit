/**
 * 記事データの型定義。
 * 本文(body)は Markdown 文字列で記述する（JSXのエスケープ不要）。
 */
export interface ArticleInput {
  /** URLスラッグ（例: 'team-division' → /articles/team-division） */
  slug: string;
  /** 対応するツールのパス（ツール→記事リンク用） */
  toolHref: string;
  /** 公開日 YYYY-MM-DD */
  date: string;
  /** 一覧・パンくずで使う簡潔なラベル */
  tag: { ja: string; en: string };
  /** 記事タイトル（H1・一覧カード・SEOタイトルに共用） */
  title: { ja: string; en: string };
  /** メタディスクリプション（SEO） */
  description: { ja: string; en: string };
  /** 一覧カードの抜粋 */
  excerpt: { ja: string; en: string };
  /** 本文（Markdown） */
  body: { ja: string; en: string };
}

/** href を付与した確定形 */
export interface Article extends ArticleInput {
  /** 記事ページのパス（slug から自動生成: /articles/<slug>） */
  href: string;
}
