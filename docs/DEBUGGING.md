# DEBUGGING.md — デバッグ手順（品質担保つき）

CastKit の不具合を**再現性をもって切り分け、回帰なく直し切る**ための手順。場当たり的に直さず、ここの「完了条件」を満たして初めて修正完了とする。

> 前提ルールは `CLAUDE.md`（最重要ルール）／`docs/STYLEGUIDE.md` §7 SSR・§8 検証 を参照。

---

## 1. このサイト特有の前提（どこを疑うか）

CastKit は **バックエンド無し・SSG・ブラウザ内処理**。そのため不具合はほぼ次の3種に収束する。サーバーログは存在しない。

| 種別 | 主な原因 | 主な観測手段 |
|------|----------|--------------|
| **ビルド時** | 型エラー・静的生成失敗・Next の破壊的変更 | `npm run build` の出力 |
| **ハイドレーション不一致** | SSR(=ja固定) と CSR の出力差 | ブラウザ Console の hydration 警告 |
| **クライアントロジック** | フック・状態・i18n・トークン | DevTools・`npm run lint` |

---

## 2. まず再現する（再現できない修正は信用しない）

1. **開発サーバで再現**：`npm run dev`（Turbopack）。
2. **本番限定の不具合は本番ビルドで再現**：`npm run build && npm run start`。
   SSG・静的化・ハイドレーションは dev と挙動が異なるため、**dev で出ない不具合は必ずこちらで確認**する。Vercel と同条件。
3. **日英の両ロケールで確認**：`?lang=en` を付与（SSRは常に ja のため英語固有の不一致が起きやすい）。
4. **モバイル幅で確認**：DevTools のレスポンシブ表示。

---

## 3. 症状別プレイブック

| 症状 | 切り分け | 典型的な原因・対処 |
|------|----------|--------------------|
| **ビルド失敗** | ローカル `npm run build` でエラー箇所を特定 | Next 固有なら `node_modules/next/dist/docs/` の該当ガイドを読む（AGENTS.md）。型エラーは該当行を修正。 |
| **`Hydration failed` / テキスト不一致** | Console の警告スタックを見る | render 中に `window` / `Math.random()` / `Date`(ロケール) を使っていないか（→ effect か決定論的手段へ）。初期 locale が `ja` 固定か。SSR と初期描画を一致させる（STYLEGUIDE §7）。 |
| **React Hook エラー**（条件付き呼び出し・setState-in-effect・render中ref更新） | `npm run lint` | フックは早期 return より前で無条件に呼ぶ。意図的な mount 初期化/演出の setState-in-effect は理由付き `eslint-disable-next-line` で明示。 |
| **スタイルが当たらない / 色がおかしい** | 使ったクラスが生成 CSS にあるか | トークンは `@theme`／`:root`（`globals.css`）に定義済みか。色は `text-ck-*`／`var(--ck-*)`／`ck.*` のみ（ハードコード禁止、描画用途を除く）。 |
| **文言が出ない / キーがそのまま表示** | `app/_i18n/translations.ts` を確認 | `ja`・`en` の**両方**にキーがあるか。`t('key')` のキー名一致。 |
| **トーストが二重に出る** | Strict Mode の二重実行 | setState の updater 内で副作用（toast 等）を呼ばない（STYLEGUIDE §7）。 |
| **検索/SEO がおかしい**（canonical・hreflang・JSON-LD・sitemap） | ビルド出力のルート種別（`○ Static`/`● SSG`）と生成 HTML | 各ページに `pageAlternates` と JSON-LD があるか（CLAUDE.md ルール8）。構造化データは Google [Rich Results Test] で検証。`/sitemap.xml`・`/robots.txt` を直接開いて確認。 |
| **本番だけ再現**（dev では出ない） | `npm run build && npm run start` で再現 → Vercel ビルドログ | 静的化・環境変数 `NEXT_PUBLIC_SITE_URL`・ハイドレーションを疑う。 |

---

## 4. デバッグ出力のルール（痕跡を残さない）

- **現状、コードベースに `console.*` は 0 件**。この状態を維持する。
- 一時的な `console.log` / デバッグ用コードは**コミット前に必ず除去**する（広告・SEO の本番サイトに出力を残さない）。
- 残骸（未使用変数・到達不能コード等）は `npm run lint` が検出する。warning も増やさない方針。

---

## 5. 修正の完了条件（Definition of Done ＝ 品質担保）

次を**すべて**満たして初めて「直った」とする。

- [ ] **再現していた手順で再現しなくなった**（dev／本番ビルド／日英／モバイルの該当条件で確認）
- [ ] `npm run lint` が **exit 0（0 errors）**、かつ **warning を新規に増やしていない**
- [ ] `npm run build` 成功（型チェック込み。必要なら `npx tsc --noEmit` 単体でも）
- [ ] **回帰確認**：修正が他ツール／他ページ／もう一方のロケールを壊していない
- [ ] **一時コード・`console.*` を残していない**
- [ ] 仕様・構成・規約に影響したら**対応ドキュメントを更新**（CLAUDE.md 保守ルール）

> 補足：原因が分かったら、再発防止としてルール化できないかを検討する（同じ踏み方を繰り返さない）。恒久的な学びは STYLEGUIDE §7 や本書に追記する。

[Rich Results Test]: https://search.google.com/test/rich-results
