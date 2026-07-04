# ARCHITECTURE.md — システム構成

## 1. 全体像

```
[ブラウザ] ──HTTPS──> [Vercel（静的配信 + edge関数）] 
                          ↑ git push で自動デプロイ
                      [GitHub: edthekid/castkit]
DNS: Cloudflare（cast-kit.com → Vercel）
解析: Vercel Analytics
お問い合わせ: Google フォーム（外部）
```

- **バックエンド無し**。ページはビルド時に生成（SSG/Static）。ツールのロジックは**すべてブラウザ内**で完結。
- 画像生成系（OGP・アイコン）もデフォルトの Node.js ランタイムでビルド時に静的生成（`○ Static`）。

---

## 2. 技術スタック

| 分類 | 採用 |
|------|------|
| フレームワーク | Next.js 16（App Router・Turbopack） |
| 言語 | TypeScript / React 19 |
| スタイル | Tailwind CSS v4（`@theme`）+ daisyUI + 自作トークン |
| トースト | sonner |
| Markdown | marked |
| 3Dサイコロ | Three.js + cannon-es（`/dice` のみ・クライアント動的 import で他ページのバンドルに含めない） |
| 解析 | @vercel/analytics |
| ホスティング | Vercel / Cloudflare(DNS) |

---

## 3. ディレクトリ構成

```
app/
├─ layout.tsx                # ルート: <html>, メタ, フォント, JSON-LD, LanguageProvider, AppShell, Analytics
├─ page.tsx                  # ホーム（全幅ランディング）
├─ globals.css               # :root デザイントークン / @theme / 共通ユーティリティ / .article-body
│
├─ _components/              # 共通UI（COMPONENTS.md 参照）
├─ _lib/                     # データ・ヘルパー
│   ├─ seo.ts                #   SITE_URL, pageAlternates, *JsonLd ヘルパー
│   ├─ tools.ts              #   ツールのシェア文言（TOOL_SHARE）
│   ├─ site.ts               #   CONTACT_FORM_URL など
│   ├─ appIcon.tsx           #   アイコン描画の共通関数（icon / manifest-icon で共用）
│   └─ articles/             #   記事の単一ソース
│       ├─ _types.ts         #     ArticleInput / Article 型
│       ├─ _template.ts      #     新規記事のひな型
│       ├─ <slug>.ts         #     各記事（メタ + Markdown本文）
│       └─ README.md         #     記事追加ガイド
│   └─ articles.ts           #   索引（ARTICLES 配列 + 取得ヘルパー）
│
├─ _i18n/                    # 多言語
│   ├─ translations.ts       #   翻訳辞書（ja/en）+ TranslationKey 型
│   ├─ LanguageContext.tsx   #   locale の決定・保持（Provider）
│   └─ useTranslation.ts     #   t() / locale フック
│
├─ _theme/colors.ts          # JS用カラートークン（ck）。globals.css の :root と同値を保つ
│
├─ <tool>/                   # 各ツール（team-division / roulette / amida / topic / debate / scoreboard / dice）
│   ├─ page.tsx              #   画面（ToolHeader + 本体 + ToolFooter）
│   ├─ layout.tsx            #   メタデータ + JSON-LD
│   ├─ _hooks/               #   状態・ロジック（useXxx）
│   ├─ _components/          #   ツール固有UI（debate は page.tsx 内に集約）
│   ├─ _constants.ts         #   定数（各ツール）
│   ├─ _utils.ts / _styles.ts #   ヘルパー・スタイル（ツールにより有無。_styles は roulette のみ）
│   └─ _data/                #   固定データ（topic / debate のみ）
│
├─ articles/                 # 記事
│   ├─ page.tsx              #   一覧
│   ├─ [slug]/page.tsx       #   詳細（generateStaticParams + marked でHTML化）
│   └─ _components/ArticleList.tsx
│
├─ guide/  privacy/  contact/   # コンテンツ・規約ページ
└─ sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx / icon.tsx / manifest-icon-*/route.tsx
```

---

## 4. 描画モデル（重要）

- **ページ**: 基本は静的生成（`○ Static`）。記事詳細は `generateStaticParams` による SSG（`● SSG`）。
- **画像系**（OGP・favicon・PWAアイコン）: `next/og` の `ImageResponse` をデフォルトの Node.js ランタイムでビルド時に静的生成（`○ Static`）。route handler 形式（manifest 用アイコン）は `dynamic = 'force-static'` を付けて静的化する。
- **クライアントコンポーネント**: 言語切替やインタラクションを持つUIは `'use client'`。`AppShell` 配下はクライアント側で locale を反映。

### 記事のレンダリング経路
```
app/_lib/articles/<slug>.ts (Markdown)
   → articles/[slug]/page.tsx で marked.parse()（ビルド時・サーバー側）
   → ArticleLayout に bodyHtml(ja/en) を渡す
   → ArticleLayout（クライアント）が locale に応じて dangerouslySetInnerHTML
```
※ Markdown→HTML はビルド時に完了。閲覧者に marked のJSは送られない。

### 3Dサイコロ（/dice）の描画・物理モデル
- Three.js + cannon-es は `/dice` だけがクライアント動的 import（`next/dynamic` ssr:false）で読み込み、他ページのバンドルに含めない。
- **標準TRPGダイス（d4/d8/d10/d12/d20/d%）は本物の多面体**。`app/dice/_diceShapes.ts` が「頂点＋面」の単一定義から、描画ジオメトリ・cannon の `ConvexPolyhedron` コライダー・数字を貼る面情報（法線/重心/向き/サイズ）をまとめて生成する（正多面体は Three.js のジオメトリから面を復元、d10/d% は五角二重錐を自前構築、種別ごとにキャッシュ）。
- **d6 と非標準の面数は角丸キューブ**（`RoundedBoxGeometry` + `CANNON.Box`）にフォールバック。
- **出目は物理任せ**：静止後、多くのダイスは上を向いた面の値を採用（face モード）。**d4 は本物と同じ「頂点読み」**（vertex モード）で、各面の3隅に頂点値を刻み、上を向いた頂点＝出目とする（頂点に集まる3隅は同値）。公平性のため面/頂点へ値をシャッフル割り当てる（d10 は 0〜9 を刻印し 0＝10）。強制的な向き補正はせず、静止直前にごく小さな水平化だけ行う。
- **d%（1d100）は本物と同じ2つのd10方式**：十の位（面に 00〜90）と一の位（面に 0〜9）の2つのd10を振り、合計して 1〜100 を算出する（`00`＋`0`＝100）。乱数で1〜100を直接引くのではなく、2ダイスの物理出目を合計する。

---

## 5. 多言語（i18n）の流れ

```
LanguageProvider（useState 初期値 = ja）
   → 初回マウント後の useEffect で URLクエリ/localStorage/ブラウザ言語から locale を決定
   → useTranslation() の t() / locale を各コンポーネントが参照
AppShell の useEffect で document.documentElement.lang と document.title を更新
```
- **SSRは常に ja**（ハイドレーション不一致を避けるため初期値を固定）。
- 言語別の**URLは存在しない**（同一URLで表示を切替）。

---

## 6. SEO 関連モジュール

| ファイル | 役割 |
|----------|------|
| `_lib/seo.ts` | `SITE_URL`, `pageAlternates`（canonical/hreflang）, `webAppJsonLd` / `websiteJsonLd` / `breadcrumb*JsonLd` / `articleJsonLd` |
| `app/sitemap.ts` | 静的ページ＋ `ARTICLES` から記事を自動生成 |
| `app/opengraph-image.tsx` | OGP画像（日英） |
| 各 `layout.tsx` / `ArticleSchema` | ページ別メタ＋JSON-LD |

---

## 7. ホスティング / 環境

- **Vercel**（Hobby）でビルド・配信。`git push` で `main` を自動デプロイ。
- **環境変数 `NEXT_PUBLIC_SITE_URL`**（= `https://cast-kit.com`）がビルド時に埋め込まれ、canonical/sitemap/OGP/シェアURLの基準になる。
- **DNS**: Cloudflare。独自ドメイン `cast-kit.com`。
