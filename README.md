# CastKit

配信・ゲームイベントをスムーズにするための**無料ツール集**。登録不要、ブラウザだけで使えます。

🔗 **本番サイト**: https://cast-kit.com

---

## ツール一覧

| ツール | パス | 概要 |
|--------|------|------|
| チーム分け | `/team-division` | メンバーを均等チームに自動振り分け（固定メンバー対応・全パターン生成） |
| ルーレット | `/roulette` | ランダム抽選（ルーレット／スロットの2モード） |
| あみだくじ | `/amida` | 参加者と結果を入力して自動生成・アニメーション表示 |
| お題ガチャ | `/topic` | 雑談お題をランダム抽選（カテゴリ絞り込み・カスタムお題） |
| ディベート | `/debate` | お題と陣営をランダム決定・カウントダウンタイマー付き |
| スコアボード | `/scoreboard` | チームの得点をリアルタイム管理（2〜10チーム・順位/並べ替え・アンドゥ・3デザイン） |
| サイコロ | `/dice` | 3D物理演算で転がるサイコロ（1〜10個・面数自由・TRPGモード・ドット目・履歴コピー） |

その他のページ：使い方ガイド（`/guide`）、記事（`/articles`）、プライバシーポリシー（`/privacy`）、お問い合わせ（`/contact`）。

---

## 技術スタック

- **フレームワーク**: Next.js 16（App Router・Turbopack）
- **言語**: TypeScript / React 19
- **スタイル**: Tailwind CSS v4（`@theme` トークン）+ daisyUI + 自作デザイントークン（`globals.css` / `_theme/colors.ts`）
- **トースト**: sonner
- **Markdown**: marked（記事本文をビルド時にHTML化）
- **解析**: Vercel Analytics
- **多言語**: 日本語・英語（同一URLでクライアント側切替）
- **ホスティング**: Vercel（DNS は Cloudflare）

---

## 開発

```bash
npm install        # 依存をインストール
npm run dev        # 開発サーバー（http://localhost:3000）
npm run build      # 本番ビルド（型チェック込み）
npm run start      # 本番ビルドをローカル起動
npm run lint       # ESLint
```

> 変更を加えたら **`npm run build`** が通ることを必ず確認してください。

---

## ディレクトリ概要

```
app/
├─ layout.tsx, page.tsx          # ルートレイアウト / ホーム
├─ globals.css                   # デザイントークン・共通スタイル
├─ sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.tsx
├─ _components/                  # 共通UIコンポーネント
├─ _lib/                         # データ・ヘルパー（seo / articles / tools / site）
├─ _i18n/                        # 翻訳・言語コンテキスト
├─ _theme/colors.ts              # JS用カラートークン（ck）
├─ <tool>/                       # 各ツール（page・layout・_hooks・_components・_data）
├─ articles/                     # 記事（一覧 + 動的ルート [slug]）
├─ guide/, privacy/, contact/    # コンテンツ・規約ページ
```

詳細は `docs/ARCHITECTURE.md` を参照。

---

## ドキュメント

- [CLAUDE.md](./CLAUDE.md) — AI開発ルール
- [SPEC.md](./SPEC.md) — 全体仕様
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — システム構成
- [docs/COMPONENTS.md](./docs/COMPONENTS.md) — UIコンポーネント一覧
- [docs/STYLEGUIDE.md](./docs/STYLEGUIDE.md) — コーディング規約
- [docs/DEPLOY.md](./docs/DEPLOY.md) — デプロイ手順・記事追加手順
- [docs/NEW_TOOL.md](./docs/NEW_TOOL.md) — 新ツール追加チェックリスト
- [docs/DEBUGGING.md](./docs/DEBUGGING.md) — デバッグ手順・修正の完了条件
- [docs/UPGRADING.md](./docs/UPGRADING.md) — Next.js メジャー/マイナーアップグレード手順
