# DEPLOY.md — デプロイ手順

本番: **https://cast-kit.com**（Vercel ホスティング / Cloudflare DNS / GitHub `edthekid/castkit`）

---

## 1. 日常の更新（公開後）

コードを変更したら、これだけで本番に反映される（Vercelが `main` への push を自動デプロイ）。

```bash
git add .
git commit -m "変更内容のメモ"
git push
```

> 反映に2〜3分。Vercel ダッシュボードの Deployments で状況を確認できる。

---

## 2. 初回セットアップ（参考・再現用）

### 2-1. ローカル → GitHub
```bash
git init
git config --global user.name "名前"
git config --global user.email "メール"
git add .
git commit -m "Initial commit: CastKit"
git branch -M main
git remote add origin https://github.com/edthekid/castkit.git
git push -u origin main
```
- `.gitignore` 済みなので `node_modules` / `.next` は含まれない。

### 2-2. Vercel
1. vercel.com に GitHub でログイン（**Hobby＝無料**）
2. Add New → Project → `castkit` を Import
3. Framework は Next.js が自動検出 → Deploy

### 2-3. 環境変数（重要）
Vercel → Settings → Environments → Production →
- **Key**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://cast-kit.com` （**末尾スラッシュなし** / `https`）
- **Sensitive はオフ**（公開URLのため）
- 保存後に **Redeploy**（`NEXT_PUBLIC_*` はビルド時に埋め込まれるため）

> このURLが canonical / sitemap / OGP / シェアURL の基準になる。

### 2-4. 独自ドメイン
1. ドメイン取得（Cloudflare 等）
2. Vercel → Settings → Domains → ドメイン入力 → 表示される DNS を業者側に設定
3. つながったら `NEXT_PUBLIC_SITE_URL` をそのドメインに更新 → Redeploy

### 2-5. Search Console
1. search.google.com/search-console → プロパティ追加（**ドメイン**）→ `cast-kit.com`
2. 所有権を確認（DNS TXT。Cloudflare DNS にレコード追加）
3. サイトマップに `sitemap.xml` を送信

> **現状（2026-06-29 時点）**：以下まで完了済み。
> - プロパティ登録（**ドメインプロパティ** `cast-kit.com`、2026-06-24 追加）・**所有権確認済み**
> - **`sitemap.xml` 送信済み**（robots.txt は「すべてのファイルが有効」、Google のクロールも稼働中）
> - 全ページの**インデックス登録リクエスト済み**（`/about` 含む URL 検査から申請）
>
> 以降、新ページ・新記事は `sitemap.xml` が自動更新されるため**再送信は不要**。急ぎたいページのみ「URL 検査 → インデックス登録をリクエスト」する（§6 参照）。

---

## 3. 反映確認

```
https://cast-kit.com/sitemap.xml
```
- `<loc>` が `https://cast-kit.com/...` になっていれば環境変数が効いている。

---

## 4. 記事を追加する（デプロイ前の作業）

1. `app/_lib/articles/_template.ts` をコピーして `app/_lib/articles/<slug>.ts` を作成
   - `slug` がURL（`/articles/<slug>`）。本文は **Markdown**（日英）
2. `app/_lib/articles.ts` で import して `ARTICLES` 配列に追加
3. `npm run build` で確認 → `git push`

→ ページ・記事一覧・ホームの記事枠・サイトマップ・JSON-LD が自動生成される。
詳細は `app/_lib/articles/README.md`。

---

## 5. よくあるトラブル

| 症状 | 対処 |
|------|------|
| シェア/サイトマップのURLが違う | `NEXT_PUBLIC_SITE_URL` を確認（末尾スラッシュ・https）→ Redeploy |
| 環境変数を変えたのに反映されない | `NEXT_PUBLIC_*` はビルド時埋め込み → **Redeploy** が必要 |
| push でエラー | git の `user.name` / `user.email` 未設定、または認証（初回 push 時にブラウザ認証） |
| ビルド失敗 | ローカルで `npm run build` を実行してエラーを特定（Vercelと同じ） |

---

## 6. 公開後にやること

1. **Search Console** … インデックス状況・サイトマップのステータスを確認
2. **Vercel Analytics** … Analytics タブで流入を確認（コード組み込み済み）
3. **AdSense** … 申請済み（2026-06-26・`app/layout.tsx` に審査コード埋め込み済み）。審査通過後に広告配置を最適化（SPEC.md §9 参照）
4. **記事を継続追加** … Search Console のデータを見ながら

### SEO（canonical / hreflang / 構造化データ）を修正してデプロイしたら

`pageAlternates`・JSON-LD・メタデータなど**検索シグナルに関わる修正**をデプロイしたら、Google に再クロールを促す：

1. **本番反映を確認** … 該当ページの HTML に正しい `<link rel="canonical">` が出ているか（`curl` か DevTools）。
2. **URL検査 → 公開URLをテスト** … 「ユーザー指定の canonical」が意図どおりか確認。
3. **インデックス登録をリクエスト** … 修正した主要URLを個別に申請（手動は1日あたり上限あり。1ページ1回で十分）。
4. **サイトマップを再送信** … 全体の再クロール促進（`sitemap.xml`）。
5. **数日〜数週後に経過確認** … 「ページ（インデックス作成）」レポートで *重複・Googleが別の正規ページを選択* が解消へ向かうか。

> 反映は Google 次第で数日〜数週かかる。連打しても早くならない。
