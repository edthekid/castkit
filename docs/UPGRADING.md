# UPGRADING.md — Next.js メジャー/マイナーアップグレード手順

`AGENTS.md` の通り、この Next.js は**破壊的変更**を含む。バージョンを上げるときは場当たり的に `npm install next@latest` せず、本書の手順と検証で**回帰なく**上げ切る。

> 前提: `AGENTS.md`（破壊的変更の注意）／`CLAUDE.md`（コミット運用・検証ルール）／`docs/DEBUGGING.md`（修正の完了条件）。

**現状**: Next.js 16 / React 19 / Tailwind CSS v4 / daisyUI / Turbopack（dev・`next.config.ts`）。

---

## 1. 始める前に

- [ ] 専用ブランチを切る：`git switch -c chore/next-<新バージョン>`（`main` を直接いじらない）。
- [ ] 直前が `npm run build` 成功状態であることを確認（＝戻れる地点）。`git log -1` と `npx next --version` を記録。
- [ ] リリースノート／破壊的変更に目を通す：Next.js 公式ブログ ＋ `node_modules/next/dist/docs/`（更新後はここも新しくなる）。

## 2. アップグレード

1. **公式 codemod を使う**（手動で `package.json` を書き換えない）：
   ```bash
   npx @next/codemod@latest upgrade
   ```
   対話で対象バージョンと自動変換を選ぶ。`next` / `eslint-config-next`（必要なら `react` / `react-dom`）が更新される。
2. 再インストール：`npm install`。
3. **非推奨・破壊的変更の確認**：`node_modules/next/dist/docs/` の該当ガイドと deprecation を読む（AGENTS.md）。codemod が変えた差分（`git diff`）を必ず目視する。

## 3. 検証（必須・`docs/DEBUGGING.md` の完了条件に準拠）

- [ ] `npm run lint` — exit 0、warning を新規に増やさない。
- [ ] `npx tsc --noEmit` — 型エラー 0。
- [ ] `npm run build` — 本番ビルド成功。**ルート種別**（`○ Static` / `● SSG`）が従来どおりか出力で確認。
- [ ] `npm run dev` で動作確認：**日↔英切替**（`?lang=en`）・主要操作・**モバイル幅**。
- [ ] `npm run build && npm run start` で本番条件を確認：**ハイドレーション警告ゼロ**（Console）。

### このサイト特有の要確認ポイント

- [ ] 画像生成（`opengraph-image` / `icon` / `manifest-icon-*`）が**静的生成のまま**ビルドできる（`next/og`・Node.js ランタイム。`manifest-icon` は `dynamic = 'force-static'`）。
- [ ] `metadata` / `alternates`（canonical・hreflang）/ JSON-LD が従来どおり出力される（生成 HTML を確認）。
- [ ] `/sitemap.xml` / `/robots.txt` / `/manifest.webmanifest` が生成される。
- [ ] Turbopack 設定（`next.config.ts`）が新バージョンの API と整合。

## 4. 関連ライブラリが同時に上がる場合

- **React**（19 → 次）：ハイドレーション・`'use client'` 境界・hooks ルールに影響。`docs/STYLEGUIDE.md §7` を再確認。
- **Tailwind v4 / daisyUI**：`@theme` ／ `@plugin "daisyui"`（`app/globals.css`）の記法変更に注意。デザイントークンが解決されるか（色化け・クラス未生成）を実機で確認。
- いずれも **Next 本体とは別コミットに分ける**と切り分けやすい。

## 5. デプロイ & ロールバック

- ブランチを `main` にマージ → `git push` で Vercel が自動デプロイ（`docs/DEPLOY.md`）。
- Vercel の **Node.js バージョン**が新 Next の要件を満たすか（Project Settings）を確認。ビルドログを必ず見る。
- 問題が出たら：コード起因は `git revert`、即時復旧は **Vercel ダッシュボードで直前デプロイに Rollback**。

## 6. 仕上げ（ドキュメント更新）

- [ ] `README.md` / `SPEC.md` / `docs/ARCHITECTURE.md` のバージョン表記（「Next.js 16」等）を更新。
- [ ] 破壊的変更で構成・規約が変わったら該当 `docs/` も更新（`CLAUDE.md` 保守ルール）。
