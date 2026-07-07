# STYLEGUIDE.md — コーディング規約

## 1. 基本方針

- **デザイントークンを使い、色をハードコードしない**（描画用途を除く）。
- **ユーザー向け文言は必ず日英両対応**。
- **共通化を優先**（同じUI/ロジックを再実装しない）。
- 変更後は **`npm run build`** が通ることを確認。

---

## 2. デザイントークン（色）

色は3つの参照方法があり、**いずれも単一ソース（`globals.css` の `:root`）に解決**される。

| 文脈 | 使い方 | 例 |
|------|--------|-----|
| Tailwind クラス | `text-ck-*` / `bg-ck-*` / `border-ck-*` | `text-ck-muted`, `bg-ck-card`, `border-ck-line` |
| CSS / インライン文字列 | `var(--ck-*)` | `border: '1px solid var(--ck-border)'` |
| JSのインライン style | `ck.*`（`_theme/colors.ts`） | `style={{ color: ck.text.primary }}` |
| 半透明（影・グリッド等） | `rgba(var(--ck-ink-rgb), N)` | `rgba(var(--ck-ink-rgb), 0.05)` |

### 主なトークン
- テキスト: `ck-ink`(#18181b) / `ck-body`(#52525b) / `ck-subtle`(#71717a) / `ck-muted`(#a1a1aa)
- 面/枠: `ck-card`(#fafafa) / `ck-surface`(#f4f4f5) / `ck-line`(#e4e4e7) / `ck-line-bold`(#d4d4d8)
- エラー: `ck-danger`(#c0392b) — バリデーション警告など。モノクロ設計内で使う唯一の意味色（乱用しない）
- グレースケール: `--ck-gray-50` 〜 `--ck-gray-950`
- シリーズ色（プレイヤー判別用）: `--ck-series-0..11`

> ⚠️ **`_theme/colors.ts`（ck）と `globals.css`（:root）は同じ値を保つこと**（手動同期）。
> ⚠️ 色を変えるときは **`:root` を1箇所直す**だけで全体に反映される。

### ハードコードを許容する例外（描画用途）
- ルーレット盤面・スロット・あみだ線などの **SVG/Canvas 描画色**
- OGP画像・favicon・PWAアイコン（`next/og`・`ImageResponse` は CSS変数を使えない）
- `colors.ts` / `globals.css`（トークン定義元）

---

## 3. 共通ユーティリティクラス（globals.css）

| クラス | 用途 |
|--------|------|
| `.ck-btn` / `.ck-btn-primary` / `.ck-btn-ghost` | ボタン（角ばり・ハードオフセット影 `4px 4px 0`） |
| `.ck-tool-card` | **ツール導線カード専用のシグネチャー**（角ばり＋ハードオフセット影 `4px 4px 0`＋対角hover）。`ToolCard` が使用。汎用の `.ck-card` とは別扱いにして「シグネチャーを一点に集中」させる |
| `.ck-eyebrow` | **装飾ラベル**（キッカー/タグ/小見出し）の規格（`10px` / 字間 `0.2em` / uppercase / `ck-muted`）。回遊カードや記事タグ等に使う |
| `.ck-label` | **機能ラベル**（フォーム/操作パネルの見出し）の規格（`10px` / 字間 `0.15em` / uppercase / `ck-subtle`＝可読性優先）。入力欄・設定パネルのラベルに使う |
| `.ck-section` | セクションカード |
| `.ck-card` / `.ck-card-interactive` | 汎用カード（枠＋淡背景＋控えめ影、hoverで浮く）。一覧・記事カード等の“静かな”面に使う |
| `.ck-input` / `.ck-textarea` | 入力欄 |
| `.ck-badge` / `.ck-chip` | バッジ・チップ（どちらも角ばり `radius:0`） |
| `.ck-gradient-text` | グラデーションテキスト |
| `.ck-nav-link` | サイドバーのナビリンク |
| `.article-body` | 記事/静的ページ本文のタイポグラフィ（可読性優先: 本文15.2px・行間広め）。h2/h3/p/ul/ol/li/strong/a/blockquote/code/hr を整備 |
| `.ck-slide-up` / `.ck-fade-in` | アニメーション |

---

## 4. デザインの世界観

- **モノクロ基調**（インク #18181b ＋ グレースケール）。**有彩色は使わない**（唯一の意味色は `--ck-danger`）。
- **角ばり**（`border-radius: 0`）を徹底。**丸めてよいのはステータス/箇条書きの円ドット（正円）だけ**。ピル・丸角ボタンは作らない。
- **ハードオフセット影**（`4px 4px 0`、hoverで伸びる）がシグネチャー。最重要の操作対象＝ツール導線カード（`.ck-tool-card`）に集中させ、汎用カードは静かに保つ。
- **フォーカス可視化**：リンク/ボタン/カード等は `:focus-visible` で角ばりのインクアウトライン（`globals.css` で共通適用）。
- **タイプ階層**：Display（ホームHero専用）＞ ツールタイトル（`EditableTitle` `3xl/5xl` tracking-widest）＞ コンテンツタイトル（記事・固定 `2xl/3xl`）。ラベルは `.ck-eyebrow` に統一。
- フォント: Space Grotesk（Latin）＋ Noto Sans JP。**個別に別フォント（Inter 等）を指定しない**（body 継承に任せる）。

---

## 5. 多言語（i18n）の書き方

- **共通文言**は `app/_i18n/translations.ts` にキーを追加（ja/en 両方）→ `t('key')` で参照。
- **コンポーネント固有の短い文言**は `locale === 'ja' ? '…' : '…'` でも可。
- **英語表記の `&`** は接続詞では使わず `and` に統一（項目の並列のみ `&` 可）。
- `t` / `locale` は `useTranslation()` から取得。

---

## 6. ファイル/命名規約

- **非公開モジュール** は `_` プレフィックス（`_components`, `_lib`, `_hooks`, `_data`, `_constants`, `_utils`, `_types.ts`, `_content.ts`）。
- フックは `useXxx`、コンポーネントは PascalCase。
- ツールページは `ToolHeader` → 本体 → `ToolFooter` を基本構成にする。

---

## 7. SSR / ハイドレーション注意

- **`window` / `Math.random()` / 日付ロケール** をレンダリング中に使わない（effect か、決定論的な手段に寄せる）。
  - シェアURLは `window.location` ではなく `SITE_URL + usePathname()`。
- **setState の updater 内で副作用（toast 等）を呼ばない**（Strict Mode で二重実行される）。
- 初期 locale は `ja` 固定（SSRと一致させる）。

---

## 8. 検証

```bash
npm run lint       # ESLint（React 19 hooks ルール含む）
npx tsc --noEmit   # 型チェック
npm run build      # 本番ビルド（型チェック込み）
```
- `lint` と `build` の両方が通ること（CLAUDE.md ルール2）。
- 新しい Tailwind トークンクラスを使ったら、生成CSSに出ているか（＝`@theme` に定義済みか）を意識する。
- 不具合の切り分け・修正の完了条件は `docs/DEBUGGING.md` を参照。
