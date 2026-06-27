# NEW_TOOL.md — 新ツール追加チェックリスト

新しいツール（例: `/countdown`）を追加するときの手順。**記事追加（`app/_lib/articles/README.md`）と違い、ツール追加は自動生成されず、複数ファイルへの登録が必要**。漏れると「ホームに出ない」「ナビに出ない」「sitemap に載らない＝SEO 機会損失」が起きる。

> 前提ルールは `CLAUDE.md`／`docs/STYLEGUIDE.md`（色トークン）／`docs/ARCHITECTURE.md`（描画モデル）を参照。

---

## 1. ページ本体を作る

`app/<tool>/` を作成（非公開モジュールは `_` プレフィックス）。

- [ ] `app/<tool>/page.tsx` — 画面。**共通の `ToolHeader` / `ToolFooter` を使う**（`docs/COMPONENTS.md`）。インタラクションがあるので基本 `'use client'`。
- [ ] `app/<tool>/_hooks/` — 状態・ロジック（`useXxx`）。ロジックはブラウザ内で完結（バックエンド無し）。
- [ ] `app/<tool>/_components/` — ツール固有 UI。
- [ ] 文言は**日英両対応**（`useTranslation` の `t()` か `locale === 'ja' ? … : …`）。色は**トークンのみ**（`text-ck-*` / `var(--ck-*)` / `ck.*`）。

## 2. メタデータ + JSON-LD（SEO 必須）

- [ ] `app/<tool>/layout.tsx` を作成。`roulette/layout.tsx` を雛形にする：
  - [ ] `metadata`（title / description / openGraph）
  - [ ] `alternates: pageAlternates('/<tool>')` ← canonical + hreflang
  - [ ] `webAppJsonLd({ name, description, path: '/<tool>' })`
  - [ ] `breadcrumbJsonLd('<日本語名>', '/<tool>')`
  - ※ ヘルパーは `app/_lib/seo.ts`。

## 3. 各所への登録（ここが漏れやすい）

新ツールのパスを、以下**すべて**に追加する。

- [ ] `app/sitemap.ts` — `STATIC_PAGES` に1行追加（`path` / `updated`（公開日 YYYY-MM-DD）/ `changeFrequency` / `priority: 0.8` 目安）。**※記事と違い手動**。
- [ ] `app/page.tsx` — ホームのツールカード配列（`href` / `icon` / `titleKey` / `descKey`）。
- [ ] `app/_components/AppShell.tsx` — **2箇所**：①ナビ配列（`href` / `icon` / `labelKey`）②タイトルマップ（`ja` / `en` / `short`）。
- [ ] `app/_components/RelatedTools.tsx` — 関連ツール配列（`titleJa/En`・`descJa/En`）。
- [ ] `app/guide/page.tsx` — **日本語配列・英語配列の両方**にエントリ＋末尾の `TOOL_MAP` にも追加。
- [ ] `app/_lib/tools.ts` — `TOOL_SHARE` に X シェア文言（ja/en）。

## 4. i18n 辞書

- [ ] `app/_i18n/translations.ts` — 上記で参照した `nav.<tool>` / `home.<tool>.title` / `home.<tool>.desc` などのキーを **ja・en 両方**追加。

## 5. アイコン

- [ ] 既存アイコン（`IconTarget` など）で足りなければアイコンコンポーネントを追加。`page.tsx` / `AppShell` / `RelatedTools` で同じものを使う。

## 6. 検証（完了条件）

- [ ] `npm run lint` が通る
- [ ] `npm run build` が通る（型チェック＋本番ビルド）
- [ ] `npm run dev` で実機確認：日↔英切替・主要操作・モバイル幅
- [ ] ナビ／ホーム／関連ツール／ガイドに表示され、リンクが正しいこと

## 7. ドキュメント更新（陳腐化させない）

- [ ] `SPEC.md`（機能・ルート一覧）
- [ ] `README.md`（ツール一覧に触れている箇所）
- [ ] `docs/ARCHITECTURE.md`（`<tool>/` の記載・概要のツール列挙）
- [ ] 必要なら `CLAUDE.md` 冒頭のツール列挙

## 8. コミット運用（`CLAUDE.md`「開発の進め方」）

- [ ] 着手前にブランチ：`git switch -c tool/<tool>`
- [ ] 意味のある単位でコミット（骨組み / ロジック / 登録 / ドキュメント など）
- [ ] `build` が通ってからコミット
