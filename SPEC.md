# SPEC.md — CastKit 全体仕様

## 1. 目的・コンセプト

配信者・ゲームイベント主催者向けの**無料ユーティリティツール集**。

- **登録不要・ブラウザ完結**（インストール／ログイン不要）
- **配信画面に映してそのまま使える**シンプルなUI
- **目的**: SEOによる集客 ＋ 広告（AdSense）収入
- **収益モデル**: 広告（コンテンツ＝記事による検索流入 → 広告表示）

---

## 2. 機能（ツール）仕様

### 2.1 チーム分け `/team-division`
- メンバー名（改行区切り）を入力 → 2〜8チームに均等ランダム振り分け
- 全組み合わせパターンを生成し「未試合／試合した組み合わせ」で管理
- 特定メンバーのチーム固定、チーム名変更、結果コピーに対応

### 2.2 ルーレット `/roulette`
- 候補を入力してランダム抽選。**ルーレット（ホイール）** と **スロット** の2モード
- 当選者の自動除外（オートムーブ）で連続抽選

### 2.3 あみだくじ `/amida`
- 参加者と結果を入力 → あみだを自動生成、線をたどるアニメーションで結果発表
- タイトル編集、複数当選、参加者入れ替え・引き直しに対応

### 2.4 お題ガチャ `/topic`
- 雑談お題をランダム抽選。カテゴリ別絞り込み、カスタムお題（localStorage保存）
- 「デフォルト＋カスタム」「カスタムのみ」モード

### 2.5 ディベート `/debate`
- お題と賛成/反対の陣営をランダム決定、カウントダウンタイマー内蔵
- カスタムお題（`テーマ,陣営A,陣営B`）、タイマー時間設定

### 2.6 スコアボード `/scoreboard`
- 2〜10チームの得点をリアルタイム管理。カスタム加減算（デフォルト1点）・ダブルクリック直接入力
- チームごとの「1つ戻る」、順位表示トグル、並び替えトグル（点数順⇄デフォルト）、スコアリセット、すべてリセット（チーム名＋スコア）、試合結果コピー
- 記録（スナップショット）：得点の高い順に整列して一覧表示。各記録のコピー、個別削除、履歴全消去に対応
- 7セグ風（DSEGデジタルフォント・自己ホスト）／モダンミニマル／カードの3デザイン、チームごとのテーマカラー、得点変動アニメーション
- フォント選択（システムフォント10種・追加ダウンロードなし）。反映はミニマル/カードのみ、7セグは専用フォント固定で非活性
- 状態は **localStorage** にオートセーブ（再読み込み後も保持・サーバー送信なし）

### 共通仕様
- 各ツールページ上部に**編集可能タイトル**（`ToolHeader`）、下部に**記事リンク＋シェア＋関連ツール**（`ToolFooter`）
- カスタム設定は **localStorage** に保存（サーバー送信なし）

---

## 3. ページ / ルート一覧

| ルート | 種別 | 内容 |
|--------|------|------|
| `/` | 静的 | ホーム（全幅ランディング、ツールカード＋記事セクション） |
| `/team-division` `/roulette` `/amida` `/topic` `/debate` `/scoreboard` | 静的 | 各ツール |
| `/guide` | 静的 | 使い方ガイド（日英・FAQ付き） |
| `/articles` | 静的 | 記事一覧 |
| `/articles/[slug]` | SSG | 記事詳細（`generateStaticParams` で全件生成） |
| `/privacy` | 静的 | プライバシーポリシー（広告・解析のCookie開示） |
| `/contact` | 静的 | お問い合わせ（Googleフォームへのリンク） |
| `/sitemap.xml` `/robots.txt` `/manifest.webmanifest` | 生成 | SEO/PWA |
| `/opengraph-image` `/icon` `/manifest-icon-192` `/manifest-icon-512` | 静的 | 画像生成（`next/og`、Node.js ランタイムでビルド時に静的生成。manifest-icon は `dynamic = 'force-static'`） |

---

## 4. 多言語（i18n）仕様

- 対応言語：**日本語（既定）／英語**
- 方式：**同一URL＋クライアント側で表示言語を切替**（パスは分けない）
- 言語決定の優先順位：URLクエリ `?lang=` > localStorage > ブラウザ言語 > 既定(ja)
- SSRの初期HTMLは**日本語**（`<html lang="ja">`、メタは日本語主体）
- **制約**: 英語専用URLが無いため、英語圏の検索結果は日本語表記になりやすい（英語SEOを本格化する場合はパスベースi18nへの移行が必要）

---

## 5. SEO 仕様

- メタデータ（title テンプレート `%s | CastKit`、description は日英併記）
- **canonical / hreflang**: `pageAlternates()` で全ページに付与
- **OGP / Twitter Card**: 動的画像（`opengraph-image.tsx`、日英バイリンガル）
- **構造化データ（JSON-LD）**: WebSite / WebApplication（各ツール）/ BreadcrumbList / BlogPosting（各記事）
- **sitemap.xml**: 静的ページ＋記事（`ARTICLES` から自動生成）
- **robots.txt**: 全許可＋ sitemap 参照
- **PWA**: `manifest.webmanifest` ＋ 192/512 アイコン

---

## 6. コンテンツ（記事）仕様

- 記事は **Markdown データ**（`app/_lib/articles/<slug>.ts`）で管理
- ビルド時に `marked` でHTML化（クライアントにライブラリJSを送らない）
- 1記事追加 = データファイル作成 ＋ `articles.ts` に登録 → ページ・一覧・サイトマップ・JSON-LD が自動生成
- 詳細は `app/_lib/articles/README.md`

---

## 7. 規約・問い合わせ

- **プライバシーポリシー**: localStorage の取り扱い、Google AdSense・アクセス解析の Cookie 利用を開示（日英）
- **お問い合わせ**: Google フォームへのリンク（メール非公開）。URLは `app/_lib/site.ts` の `CONTACT_FORM_URL`

---

## 8. 非機能要件

- **バックエンド無し**（静的サイト＋クライアント処理）。サーバーに個人情報を保存しない
- **解析**: Vercel Analytics（Cookieレス）
- **ホスティング**: Vercel（Hobby）。DNS は Cloudflare、独自ドメイン `cast-kit.com`
- **環境変数**: `NEXT_PUBLIC_SITE_URL`（= `https://cast-kit.com`）。canonical/sitemap/OGP/シェアURL の基準

---

## 9. 収益化

- **Google AdSense**: 審査申請済み（2026-06-26）。`app/layout.tsx` の `<head>` に審査コード埋め込み済み。自動広告ON・アンカー広告のみ有効。
- **Amazonアソシエイト**: 登録済み（アソシエイトID: `castkit-22`）。各記事の末尾に関連機材のアフィリリンクを設置済み（検索URL形式: `https://www.amazon.co.jp/s?k=...&tag=castkit-22`）。

---

## 10. 今後の課題（バックログ）

- アクセス解析データに基づく記事の継続追加
- AdSense 審査通過後に広告配置の最適化（ツールページの除外設定など）
- PV増加後に A8.net / もしもアフィリエイト の追加を検討
- （必要なら）英語SEO強化＝パスベース i18n への移行
- `castkit-one.vercel.app` → `cast-kit.com` のリダイレクト整理
