import type { ArticleInput } from './_types';

export const scoreboard: ArticleInput = {
  slug: 'scoreboard',
  toolHref: '/scoreboard',
  date: '2026-06-28',
  tag: { ja: 'スコアボード', en: 'Scoreboard' },
  title: {
    ja: 'スコアボードで配信・イベントを盛り上げる｜チーム対戦の得点をリアルタイム管理する方法',
    en: 'Hype Up Streams and Events With a Live Scoreboard: Real-Time Team Score Management',
  },
  description: {
    ja: '配信やゲームイベントでチームの得点をリアルタイム表示する方法を解説。無料スコアボードツールの使い方、3デザインの選び方、配信で見やすくするコツを紹介します。',
    en: 'How to show team scores in real time on streams and gaming events with a free scoreboard tool — usage, design tips, and visibility tricks.',
  },
  excerpt: {
    ja: 'チーム対戦の得点をリアルタイムに表示すると、配信もイベントも一気に盛り上がります。無料スコアボードツールの使い方と見やすく魅せるコツを解説します。',
    en: 'Showing team scores in real time instantly lifts the energy of a stream or event. Here is how to use a free scoreboard tool and make it look great.',
  },
  body: {
    ja: `チーム対戦やクイズ大会で「今どっちが勝っているのか」がひと目で分かると、配信もイベントも一気に盛り上がります。CastKitのスコアボードは、2〜10チームの得点をリアルタイムに管理できる無料ツール。登録不要・ブラウザだけで使え、得点はブラウザに自動保存されるので、配信中の不意の再読み込みでも安心です。

## スコアボードが活躍する場面

- 配信での視聴者参加型ゲーム（紅組 vs 白組など）の得点表示
- 対戦ゲームのチーム戦スコアを画面に常時表示
- クイズ大会・大喜利・ボードゲーム会の採点
- 複数ラウンドの合計点トラッキング
- オフ会・社内イベント・学校レクの得点係

## CastKitスコアボードの特徴

- **2〜10チーム**に対応。チーム名とテーマカラーを自由に設定
- **カスタム加算・減算**：増減値を入力して一括で動かせる（デフォルトは1）
- **増減値の一括設定**：全チームの増減値をまとめて変更できる
- **ダブルクリックで直接入力**：得点を直接打ち込んで素早く修正
- **チームごとの「1つ戻る」**：操作ミスを1手ずつ取り消し
- **順位表示・並べ替え**：点数順とデフォルト順をワンタップで切替
- **記録（スナップショット）**：途中経過を保存して後から見返せる
- **試合結果コピー**：Discord等に貼り付けやすい形式でコピー

## スコアボードの使い方

- チーム数を選び、チーム名とテーマカラーを設定する
- 「＋」「−」または増減値を入れて得点を動かす（数字をダブルクリックで直接入力も可）
- 必要に応じて「順位表示」をオンにし、「点数順に並べ替え」で順位を整える
- 区切りのいいところで「スコアを記録」して途中経過を残す
- 試合後は「試合結果をコピー」してSNSやコミュニティに共有する

## 3つのデザインから選ぶ

- **7セグ**：電光掲示板風のデジタル表示。スポーツ中継のような臨場感が出る
- **ミニマル**：フラットで見やすい大きな数字。どんな配信レイアウトにもなじむ
- **カード**：チームカラーを背景に敷いたカード型。色で陣営を強調できる

ミニマル・カードでは**フォントを20種類から選択**でき、配信の世界観に合わせて雰囲気を変えられます（7セグは専用フォント固定）。

## 配信で見やすくするコツ

- **チームごとに色を分ける**——テーマカラーを変えると視聴者が瞬時に判別できます
- **順位表示をオンにする**——競っている緊張感が伝わりやすくなります
- **得点が動いたら声に出す**——「○○チーム、追加点！」の実況が盛り上げの鍵
- **区切りで記録を残す**——ラウンドごとにスナップショットを取れば振り返りが簡単
- **大きく映す**——配信画面の一角に常時表示しておくと視聴者が状況を追いやすい

## 得点管理を快適にする機材

スコアボードを別画面に表示したり、手元で操作したりできると、配信や進行がぐっとスムーズになります。

- **[モバイルモニター（サブディスプレイ）](https://www.amazon.co.jp/s?k=モバイルモニター+サブディスプレイ&tag=castkit-22)**：配信画面とは別にスコアボードを映しておけば、参加者全員が得点を確認しながらプレイできます。
- **[タブレット端末](https://www.amazon.co.jp/s?k=タブレット+端末&tag=castkit-22)**：手元のタッチ操作で得点を加減算。司会・進行をしながらでも素早く点数を動かせます。
- **[ゲーム配信用キャプチャーボード](https://www.amazon.co.jp/s?k=キャプチャーボード+ゲーム+配信&tag=castkit-22)**：ゲーム画面とスコアボードをまとめて配信に取り込み、見やすいレイアウトを作れます。

## まとめ

得点をリアルタイムに見せるだけで、チーム対戦やクイズ企画の熱量は大きく変わります。CastKitのスコアボードなら、チーム設定から得点管理・記録・共有までブラウザだけで完結。まずは2チームで試して、配信やイベントの定番演出にしてみてください。`,
    en: `When everyone can see "who's winning right now" at a glance, a team battle or quiz event instantly gets more exciting. CastKit's Scoreboard is a free tool for managing 2–10 team scores in real time. No sign-up, works in your browser, and scores auto-save — so an accidental page reload mid-stream won't lose your progress.

## Where a Scoreboard Shines

- Score display for viewer-participation games (Red vs White, etc.)
- Always-on team scores for competitive games
- Judging quiz shows, comedy bits, and board-game nights
- Tracking cumulative points across multiple rounds
- Scorekeeping at meetups, company events, and school activities

## What Makes CastKit's Scoreboard Useful

- Supports **2–10 teams**, each with a custom name and theme color
- **Custom add/subtract**: enter a step and move scores in bulk (default 1)
- **Bulk step setting**: change every team's step at once
- **Double-click to type**: enter a score directly for quick fixes
- **Per-team "Undo"**: roll back mistakes one step at a time
- **Rank display and sorting**: toggle between score order and default order
- **Records (snapshots)**: save progress to review later
- **Copy match result**: copy in a format that pastes neatly into Discord

## How to Use the Scoreboard

- Choose the number of teams, then set each name and theme color
- Move scores with "+"/"−" or a custom step (double-click a number to type it directly)
- Turn on "Show rank" and use "Sort by score" to order the standings
- At natural breaks, press "Record score" to save the progress
- After the match, "Copy match result" to share on social media or your community

## Pick From Three Designs

- **7-Seg**: a digital, scoreboard-display look that brings broadcast-style energy
- **Minimal**: large, flat, easy-to-read numbers that fit any stream layout
- **Card**: a card style with the team color as the background to emphasize sides

In Minimal and Card you can **choose from 20 fonts** to match your stream's vibe (7-Seg uses its own fixed font).

## Tips to Keep It Readable on Stream

- **Give each team a color** — distinct theme colors let viewers tell sides apart instantly
- **Turn on rank display** — it conveys the tension of a close match
- **Call out score changes** — "Team A scores!" play-by-play drives the hype
- **Save records at breaks** — a snapshot per round makes recaps easy
- **Show it large** — keeping it in a corner of the stream helps viewers follow along

## Gear to Make Scorekeeping Smoother

Showing the scoreboard on a separate screen or operating it at hand makes streaming and hosting far smoother.

- **[Portable monitor (second display)](https://www.amazon.co.jp/s?k=portable+monitor+second+display&tag=castkit-22)**: Keep the scoreboard on a dedicated screen so every participant can check the score while playing.
- **[Tablet](https://www.amazon.co.jp/s?k=tablet&tag=castkit-22)**: Add and subtract points with touch — move scores quickly even while hosting.
- **[Capture card for game streaming](https://www.amazon.co.jp/s?k=capture+card+game+streaming&tag=castkit-22)**: Bring both the game and the scoreboard into your stream for a clean, readable layout.

## Summary

Just showing scores in real time transforms the energy of team battles and quiz segments. With CastKit's Scoreboard, everything from team setup to scoring, recording, and sharing happens in the browser. Start with two teams and make it a staple of your streams and events.`,
  },
};
