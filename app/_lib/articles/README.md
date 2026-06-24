# 記事の追加・編集ガイド

記事は **データ1ファイル** で完結します。ページ・記事一覧・サイトマップ・構造化データ（JSON-LD）は自動生成されるので、それらのファイルを触る必要はありません。

---

## 記事を追加する（2ステップ）

### 1. ひな型をコピーして記事ファイルを作る

`_template.ts` をコピーして `app/_lib/articles/<slug>.ts` を作成します。

- `<slug>` がそのまま記事URLになります（例: `team-division` → `/articles/team-division`）
- 英小文字とハイフン推奨（ファイル名と `slug` フィールドは一致させる）
- `export const template` を分かりやすい変数名にリネーム（例: `export const myArticle`）
- 各フィールドを埋める（`body` は Markdown）

### 2. 索引に登録する

`app/_lib/articles.ts` で import して `ARTICLES` 配列に追加します。

```ts
import { myArticle } from './articles/my-slug';

export const ARTICLES: Article[] = [
  teamDivision, roulette, amida, topicPicker, debate,
  myArticle, // ← 追加
].map((a) => ({ ...a, href: `/articles/${a.slug}` }));
```

配列の **並び順 = 一覧の表示順**（先頭が新着扱い）。

### これだけで自動的にできるもの

- 記事ページ `/articles/<slug>`（静的生成）
- 記事一覧ページ・ホームの「記事」枠への掲載
- `sitemap.xml` への追加
- 構造化データ（`BlogPosting` ＋ パンくず）
- ツールページ ⇄ 記事の相互リンク（`toolHref` で関連付け）

---

## 記事を編集する

該当の `app/_lib/articles/<slug>.ts` を開いて、フィールド（特に `body` の Markdown）を直接編集するだけ。JSXではないので **エスケープ不要**です。

---

## フィールド一覧

| フィールド | 用途 |
|-----------|------|
| `slug` | 記事URL（ファイル名と一致させる） |
| `toolHref` | 関連ツールのパス（相互リンク用。例: `/team-division`） |
| `date` | 公開日 `YYYY-MM-DD`（サイトマップ・記事の表示日に使用） |
| `tag` | 短いラベル（一覧・パンくず・CTAボタン文に使う） |
| `title` | タイトル（H1・一覧・SEOタイトルに共用） |
| `description` | メタディスクリプション（検索結果の説明文） |
| `excerpt` | 一覧カードの抜粋 |
| `body` | 本文（Markdown） |

すべて `{ ja, en }` の2言語です。**日本語と英語の両方** を埋めてください（サイトの言語切替で切り替わります）。

---

## 本文（body）で使える Markdown 記法

| 書き方 | 結果 |
|--------|------|
| `## 見出し` | セクション見出し（h2） |
| 空行で区切った文章 | 段落 |
| `**太字**` | 太字（強調・リード文に） |
| `- 項目` | 箇条書き |
| `[表示文](https://...)` | リンク |

### 注意点

- 見出しは `##`（h2）から。`#`（h1）は記事タイトルが兼ねるので **本文では使わない**
- 段落は **空行** で区切る（改行1つは段落内の折り返しになる）
- JSXではないので `'` `"` `&` などをそのまま書ける（`&apos;` のようなエスケープは不要）
- 番号付きリスト `1.` も使えますが、デザインを最適化しているのは `-`（箇条書き）です
- スタイルは `app/_components/ArticleLayout.tsx` 内の `.article-body` で定義（h2 / p / ul / li / strong）

---

## 確認方法

```
npm run build
```

ビルド後、記事が `● /articles/[slug]` の一覧に追加され（例: `/articles/my-slug`）、エラーが出なければ完了です。
