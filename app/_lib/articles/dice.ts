import type { ArticleInput } from './_types';

export const dice: ArticleInput = {
  slug: 'dice',
  toolHref: '/dice',
  date: '2026-07-04',
  tag: { ja: 'サイコロ', en: 'Dice' },
  title: {
    ja: '無料オンラインサイコロツールの使い方｜TRPG・チンチロにも対応',
    en: 'How to Use a Free Online Dice Roller: TRPG and Chinchiro Ready',
  },
  description: {
    ja: '登録不要・無料のオンラインサイコロツールの使い方を解説。基本はd6を1〜10個、TRPGはd4〜d100のダイスセット（1d100は2つのd10方式）、3つのサイコロで役を競うチンチロにも対応。出目はDiscordにコピーできます。',
    en: 'How to use a free, no-signup online dice roller — 1–10 d6 in Basic, TRPG dice sets (d4–d100, with a true two-d10 percentile), and a Chinchiro mode. Copy results to Discord.',
  },
  excerpt: {
    ja: '基本はd6を1〜10個、TRPGはダイスセット（d4〜d100）、チンチロにも対応した無料サイコロツール。使い方と活用シーン、チンチロの役と倍率まで解説します。',
    en: 'A free dice roller: 1–10 d6 in Basic, TRPG dice sets (d4–d100), and a Chinchiro mode. How to use it, plus Chinchiro hands and multipliers.',
  },
  body: {
    ja: `CastKitのサイコロは、登録不要・ブラウザだけで使える無料のサイコロツールです。基本モードはd6を1〜10個、TRPGモードはd4〜d100のダイスセットをワンタップで振れて、3つのサイコロで役を競う「チンチロ」にも対応。出目の履歴はDiscordに貼りやすい形式でコピーできます。

## サイコロツールが活躍する場面

- TRPG（クトゥルフ・D&Dなど）のオンラインセッションでの判定
- ボードゲーム・すごろくの物理サイコロの代わり
- 罰ゲーム・順番決め・席替えなどのランダム決め
- 配信での視聴者参加型の運試し企画
- チンチロなど、サイコロを使った昔ながらの遊び

## CastKitサイコロの特徴

- **1〜10個**のサイコロを同時に振れる（基本モード）
- **TRPGのダイスセット**：d4/d6/d8/d10/d12/d20、d100（パーセンタイル）までプリセットでワンタップ
- **3つのモード**：基本（d6を個数だけ選ぶ）／TRPG（ダイスセット）／チンチロ
- **本物の多面体ダイス**：d4（四面体）・d8（八面体）・d10／d%（五角二重錐）・d12（十二面体）・d20（二十面体）は、実際の多面体の形で3D表示・物理演算。d6はオーソドックスなドット目、それ以外の面数は数字入りのサイコロで表示
- **合計・出目の履歴**：振った結果を一覧で確認でき、Discord向け形式でコピーできる
- **ブラウザ内で完結**：設定はブラウザに保存され、サーバーに送信しない

## 使い方（基本モード）

- 基本モードは6面（d6）で、サイコロの数（1〜10）だけを選ぶ
- 「振る」を押すとサイコロが転がって出目が決まる
- 合計がポップアップで表示され、履歴に残る
- 履歴の「コピー」で「🎲 2d6 -> [3, 5] = 8」形式のテキストを取得できる

## TRPGモード：ダイスセットをワンタップ

TRPGモードでは、1d4・2d6・3d6・4d6・1d8・1d10・2d10・1d12・1d20・2d20・1d100 といったよく使うダイスセットを、整ったグリッドのプリセットからワンタップで選べます。**1d100（パーセンタイル）は本物と同じ2つのd10方式**で、十の位（00〜90）と一の位（0〜9）の2つを振って合計し、1〜100を出します（00と0で100）。クトゥルフ神話TRPGの技能判定などにそのまま使えます。d4・d8・d10・d12・d20 は本物の多面体の形で転がるので、実物のダイスに近い感覚で遊べます。

## チンチロモード：3つのサイコロで役を競う

チンチロは、3つのサイコロを振って出た「役」の強さで勝負する、昔ながらのサイコロ遊びです。CastKitのチンチロモードでは、役と倍率を自動で判定します。

役の強さ（強い順）と倍率：

- **ピンゾロ（1・1・1）**：3倍（最強）
- **ゾロ目（2〜6のゾロ）**：3倍
- **シゴロ（4・5・6）**：2倍
- **○の目（2つ同じ＋1つ／例：4・4・2 → 2の目）**：1倍。目の数が大きいほど強い
- **目なし**：勝敗なし
- **ヒフミ（1・2・3）**：-2倍（最弱）

「目なし」なら、1ターンにつき最大3回まで振り直せます。役が決まると自動で判定して履歴に残るので、ルールをうろ覚えでも遊べます。

## 他のツールと組み合わせる

- 当たりを1つだけ選びたいときは [ルーレット](/roulette) が便利
- チーム対戦の得点をリアルタイム管理するなら [スコアボード](/scoreboard)
- 参加者に役割や結果をランダムに割り当てるなら [あみだくじ](/amida)

## あると便利な機材

- **[多面体ダイスセット（TRPG用）](https://www.amazon.co.jp/s?k=ダイス+多面体+TRPG&tag=castkit-22)**：オフラインのセッションや、実物のダイスも併用したいときに。
- **[タブレット端末](https://www.amazon.co.jp/s?k=タブレット+端末&tag=castkit-22)**：卓の全員から見える位置に出目を映しておくと、進行がスムーズになります。
- **[ボードゲーム](https://www.amazon.co.jp/s?k=ボードゲーム&tag=castkit-22)**：サイコロを使うゲームのお供に。

## まとめ

サイコロを1個振るのも、TRPGの複雑な判定も、チンチロの役決めも、CastKitのサイコロならブラウザだけで完結します。登録不要・無料で、出目はDiscordにそのまま共有可能。まずは2d6を振ってみて、TRPGやチンチロにも使ってみてください。`,
    en: `CastKit's Dice is a free dice roller that needs no sign-up and runs entirely in your browser. Roll 1–10 six-sided dice in Basic mode, pick TRPG dice sets from d4 to d100 with one tap, or play Chinchiro — a classic three-dice game — and copy every result in a Discord-friendly format.

## Where an Online Dice Roller Shines

- Checks in online TRPG sessions (Call of Cthulhu, D&D, and more)
- A stand-in for physical dice in board games and sugoroku
- Random decisions: forfeits, turn order, seating
- Viewer-participation luck games on stream
- Classic dice games like Chinchiro

## What Makes CastKit's Dice Useful

- Roll **1–10 dice** at once (Basic mode)
- **TRPG dice sets**: d4/d6/d8/d10/d12/d20 and d100 (percentile), one tap from presets
- **Three modes**: Basic (pick how many d6), TRPG (dice sets), and Chinchiro
- **Real polyhedral dice**: d4 (tetrahedron), d8 (octahedron), d10/d% (pentagonal trapezohedron), d12 (dodecahedron), and d20 (icosahedron) roll as true 3D polyhedra. The d6 uses classic pips; other side counts show numbers
- **Totals and roll history**: review your results and copy them in a Discord-friendly format
- **Runs in your browser**: settings are saved locally and never sent to a server

## How to Use It (Basic Mode)

- Basic mode uses six-sided dice (d6); just choose how many (1–10)
- Press "Roll" and the dice tumble and settle on a result
- The total pops up and the roll is saved to history
- Use "Copy" on any history entry to get text like "🎲 2d6 -> [3, 5] = 8"

## TRPG Mode: Dice Sets in One Tap

TRPG mode lets you pick common dice sets — 1d4, 2d6, 3d6, 4d6, 1d8, 1d10, 2d10, 1d12, 1d20, 2d20, 1d100 — from a tidy grid of presets. **1d100 (percentile) uses the real two-d10 method**: a tens die (00–90) and a ones die (0–9) are rolled and summed to give 1–100 (00 and 0 make 100), so it works directly for skill checks in Call of Cthulhu and similar systems. The d4, d8, d10, d12, and d20 tumble as true polyhedra, so it feels close to rolling physical dice.

## Chinchiro Mode: Compete on Hand Strength With Three Dice

Chinchiro is a classic dice game where three dice are rolled and hands compete by strength. CastKit's Chinchiro mode judges the hand and multiplier automatically.

Hands from strongest to weakest, with multipliers:

- **Pinzoro (1-1-1)**: ×3 (strongest)
- **Triple (2-2-2 … 6-6-6)**: ×3
- **Shigoro (4-5-6)**: ×2
- **Pip hand (a pair + one die, e.g. 4-4-2 → pip 2)**: ×1 — a higher pip is stronger
- **No hand**: no win or loss
- **Hifumi (1-2-3)**: ×-2 (weakest)

On a "no hand" result you may re-roll, up to three times per turn. The hand and multiplier are judged and logged automatically, so you can play even if you don't remember the rules.

## Combine It With Other Tools

- To pick just one winner, try the [Roulette](/roulette)
- To manage team scores in real time, use the [Scoreboard](/scoreboard)
- To randomly assign roles or results to people, use the [Amida (ladder lottery)](/amida)

## Handy Gear

- **[Polyhedral dice set (for TRPG)](https://www.amazon.co.jp/s?k=polyhedral+dice+set+TRPG&tag=castkit-22)**: For offline sessions or when you want physical dice alongside the app.
- **[Tablet](https://www.amazon.co.jp/s?k=tablet&tag=castkit-22)**: Show the roll where everyone at the table can see it to keep play moving.
- **[Board games](https://www.amazon.co.jp/s?k=board+game&tag=castkit-22)**: A companion for games that use dice.

## Summary

Whether you roll a single die, make a complex TRPG check, or settle a round of Chinchiro, CastKit's Dice handles it in the browser alone — free, no sign-up, and results share straight to Discord. Roll a quick 2d6 to start, then put it to work for TRPG and Chinchiro.`,
  },
};
