# COMPONENTS.md — UIコンポーネント一覧

`app/_components/` 配下の共通コンポーネント。原則 **デザイントークン**（`text-ck-*` / `var(--ck-*)` / `ck.*`）を使用する（STYLEGUIDE.md 参照）。

---

## レイアウト / 全体

| コンポーネント | 役割 |
|----------------|------|
| `AppShell` | 全ページ共通シェル。サイドバー（PC）/ ドロワー（モバイル）、言語切替（右上）、`document.title`・`lang` 更新、`ScrollToTop` / `AppToaster` / `Footer` を内包。**ホーム（`/`）はサイドバー非表示で全幅**。 |
| `Footer` | 全ページ共通フッター。規約リンク（プライバシー / お問い合わせ）＋ 著作権。 |
| `LanguageSwitcher` | 日本語/英語トグル（`compact` あり）。PCは画面右上、モバイルは上部ヘッダー。 |
| `ParticleBackground` | 背景の軽量パーティクル（純CSS、`ssr:false` で動的読み込み）。 |
| `ScrollToTop` | スクロール時に右下へ出る「上へ戻る」ボタン（二層構造で表示用/hover用 transform を分離）。 |
| `AppToaster` | sonner の `Toaster` をサイト基調（モノクロ・角ばり・ハードオフセット影）でラップ。アイコンも線画。 |
| `Modal` | フォーカストラップ・Escape閉じ・フォーカス復元つき汎用モーダル。 |

---

## ツールページ共通

| コンポーネント | 役割 |
|----------------|------|
| `ToolHeader` | ツール共通ヘッダー。`titleKey` / `subtitleKey` / 任意の `action`（設定ボタン）。`EditableTitle` を内包。 |
| `ToolFooter` | ツール共通フッター。`ToolIntro` ＋ `ToolArticleLink` ＋ シェア（`tools.ts` の文言）＋ `RelatedTools` をまとめる。 |
| `ToolIntro` | ツール下部の「概要＋使い方＋活用シーン＋よくある質問」本文（`toolIntro.ts` からパスで取得）。ツールURL単体に読み物を持たせ、検索・広告審査での独自価値を示す。FAQ は各ツール layout の FAQPage JSON-LD（`toolFaqJsonLd`）と同一ソース。 |
| `EditableTitle` | クリックで編集できるページタイトル。未編集なら翻訳タイトル（言語追従）、編集後はユーザー入力を優先。中央寄せ用スペーサー内蔵。 |
| `SettingsButton` | 設定モーダルを開くボタン（件数バッジ付き。お題ガチャ/ディベートで共通）。 |
| `ShareButton` | X(Twitter) 投稿リンク。URLは `SITE_URL + usePathname()`（ハイドレーション安全・本番URL固定）。 |
| `ToolCard` | 全ツール導線カードの共通コンポーネント。サイトのシグネチャー（`.ck-tool-card`＝角ばり＋ハードオフセット影＋対角hover）を担う。`variant="featured"`（ホーム大カード）/ `"compact"`（RelatedTools 小カード）。データは `toolList.ts`（`TOOL_CARDS`）に一元化。 |
| `RelatedTools` | 他ツールへの回遊カード3件（現在ページを除外）。`ToolCard` の compact を使用。 |
| `ToolArticleLink` | 現在のツールに対応する記事へのリンク一覧（`getArticlesByToolHref`。1ツール複数記事に対応）。 |

---

## 記事・コンテンツ

| コンポーネント | 役割 |
|----------------|------|
| `ArticleLayout` | 記事詳細の表示。`article` ＋ `bodyHtml(ja/en)` を受け取り、locale に応じて本文HTMLを描画。公開日・CTA を自動生成。 |
| `ArticleSchema` | 記事の JSON-LD（BlogPosting ＋ パンくず）を出力（サーバーコンポーネント）。 |
| `StaticPageLayout` | プライバシー等の静的ページ用（タイトル＋`.article-body` でMarkdown HTML描画）。 |
| `HomeArticles` | ホーム下部の記事カードセクション（`ARTICLES` から生成）。 |

---

## アイコン

| 場所 | 内容 |
|------|------|
| `_components/icons/index.tsx` | モノクロ線画アイコン集（`IconBolt` 等）。`base(size)` で strokeWidth 等を統一。`ICON_MAP` で文字列→コンポーネント解決。 |

---

## ツール固有コンポーネント（抜粋）

各ツールの `_components/` に配置（共通化対象外のUI）。

| ツール | 主なコンポーネント |
|--------|--------------------|
| team-division | `MemberInput`, `TeamSettings`, `MemberFixPanel`, `PatternList`, `PatternCard` |
| roulette | `RouletteCore`, `wheel/RouletteWheel`・`WheelSlices`・`WheelParts`, `slot/SlotMachine`・`SingleReel`, `shared/Panels` |
| amida | `InputPanel`, `AmidaCanvas`, `ResultPanel` |
| topic | `CategorySelector`, `TopicCard`, `TopicHistory` |
| debate | （`page.tsx` 内の `SettingsModal` / `FactionBox` / `VSBadge` / `useShuffleText`） |

---

## 設計メモ

- ツールページは原則 **`ToolHeader` → 本体 → `ToolFooter`** の構成。
- 設定モーダルを持つツール（topic / debate）は `SettingsButton` を `ToolHeader` の `action` に渡す。
- 新規共通UIを足すときは、まず既存（特に `ToolHeader`/`ToolFooter`/`ToolCard`/`.ck-card`）で代替できないか確認する。
- ツール導線カードは `ToolCard` に一本化済み（ホームと `RelatedTools` が共通利用）。ツール一覧の追加・変更は `_components/toolList.ts`（`TOOL_CARDS`）を編集する。
