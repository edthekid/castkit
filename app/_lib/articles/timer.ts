import type { ArticleInput } from './_types';

export const timer: ArticleInput = {
  slug: 'timer',
  toolHref: '/timer',
  date: '2026-07-05',
  tag: { ja: 'タイマー', en: 'Timer' },
  title: {
    ja: '無料オンラインタイマーの使い方｜カウントダウン・ストップウォッチ・ポモドーロ',
    en: 'How to Use a Free Online Timer: Countdown, Stopwatch, and Pomodoro',
  },
  description: {
    ja: '登録不要・無料のオンラインタイマーの使い方を解説。カウントダウン、ストップウォッチ、指定時刻までのカウントダウン、ポモドーロの4モードを1つに。配信の待機画面用の全画面表示や通知音にも対応します。',
    en: 'How to use a free, no-signup online timer — countdown, stopwatch, a countdown to a target time, and Pomodoro in one. With a fullscreen display for stream standby screens and an alarm sound.',
  },
  excerpt: {
    ja: 'カウントダウン・ストップウォッチ・指定時刻まで・ポモドーロの4モードを1つにした無料タイマー。配信の待機画面用の全画面表示や通知音まで、使い方と活用シーンを解説します。',
    en: 'A free timer with four modes — countdown, stopwatch, until-time, and Pomodoro. How to use it, plus fullscreen for stream standby and alarm notifications.',
  },
  body: {
    ja: `CastKitのタイマーは、登録不要・ブラウザだけで使える無料のタイマーツールです。カウントダウン、ストップウォッチ、指定時刻までのカウントダウン、ポモドーロの4モードをタブで切り替えて、1つのページで使えます。配信の待機画面に大きく映せる全画面表示や、0到達時の通知音・点滅にも対応。すべてブラウザ内で完結し、入力を外部に送信しません。

## タイマーが活躍する場面

- 配信の待機画面に「開始まであと◯分」を大きく表示する
- 企画・ミニゲームの制限時間を管理する
- 作業配信で、集中と休憩のリズムを作る（ポモドーロ）
- 「指定時刻まで」で、配信開始時刻までをカウントダウンする
- 勉強・家事・料理など、日常の時間管理に

## 4つのモード

- **カウントダウン**：時・分・秒で時間を設定して0までカウント。よく使う時間はプリセット（1分・3分・5分・10分・15分）でワンタップ
- **ストップウォッチ**：経過時間を計測。ラップ計測に対応し、1/100秒まで表示
- **指定時刻まで**：目標の日時までの残り時間をカウントダウン（端末のローカル時刻が基準）
- **ポモドーロ**：作業と休憩を自動でくり返し、集中と休息のリズムを作る

タブを切り替えても各モードのタイマーは動き続けるので、ストップウォッチを回しながらカウントダウンを設定する、といった使い方もできます。

## カウントダウンの使い方

- 時・分・秒を入力するか、プリセット（1分・3分・5分・10分・15分）を選ぶ
- 「開始」でスタート。「一時停止」「リセット」で操作する
- 0になると、通知音（オンのとき）と画面の点滅で知らせる
- 「全画面表示」を押すと大きく映せる。クリックまたはEscで元に戻る

## ストップウォッチ・指定時刻まで

ストップウォッチは「開始／一時停止／リセット」に加えてラップ計測に対応し、経過を1/100秒まで表示します。周回タイムやスピードランの計測に便利です。

「指定時刻まで」は、目標の日時を選ぶとそこまでの残り時間をカウントダウンします。端末のローカル時刻が基準なので、「配信開始まであと◯◯」を待機画面に出す用途にそのまま使えます。

## ポモドーロの使い方（1セットの流れ）

ポモドーロは、短い「作業」と「休憩」を自動でくり返して集中と休息のリズムを作るタイマーです。使い方はシンプルです。

- 「作業」「休憩」「長い休憩」の各分数と、「長い休憩までの作業回数」を設定する（初期設定は25分作業・5分休憩・4回ごとに長い休憩）
- 「開始」を押すと「作業」タイマーが始まる
- 「作業」→「休憩」を自動でくり返し、設定した回数の作業を終えると「長い休憩」に入る。ここまでで1セット完了
- 切替時は通知音（オン時）と点滅でお知らせ。「スキップ」で次のフェーズへ、「リセット」で最初に戻せる

作業・休憩の分数や間隔はブラウザに自動保存されるので、次に開いたときも同じ設定で始められます。

## 配信で使うときのコツ

- **全画面表示**：待機画面や作業配信の画面に大きく映せます。ブラウザのウィンドウキャプチャやブラウザソース（OBSなど）でそのまま取り込めます
- **通知音は既定でオフ**：右上のスイッチでオンにすると音量バーが出ます。音を出せない配信でも、画面の点滅による視覚的な通知は常に表示されます
- **フォント変更**：数字のフォントを選べます（スコアボードと同じ一覧・全画面にも反映）。配信画面の雰囲気に合わせて等幅などに変更できます
- **ズレにくい計時**：残り時間は実時刻を基準に算出しているので、タブを裏に回して戻ってきても正しい残り時間に補正されます

## 他のツールと組み合わせる

- チーム対戦の得点をリアルタイムに管理するなら [スコアボード](/scoreboard)
- 順番決めや罰ゲームのランダム抽選には [ルーレット](/roulette) や [サイコロ](/dice)

## あると便利な機材

- **[サブモニター・ディスプレイ](https://www.amazon.co.jp/s?k=モバイルモニター&tag=castkit-22)**：待機画面のタイマーを別画面に出しておくと、配信中も残り時間をひと目で確認できます。
- **[タブレット端末](https://www.amazon.co.jp/s?k=タブレット+端末&tag=castkit-22)**：作業机やゲーム卓に置いて、ポモドーロや制限時間の表示専用にすると便利です。
- **[デジタルタイマー](https://www.amazon.co.jp/s?k=デジタルタイマー&tag=castkit-22)**：画面を占有したくないときの、手元用の物理タイマーとして。

## まとめ

カウントダウンも、ストップウォッチも、指定時刻までのカウントも、ポモドーロも、CastKitのタイマーならブラウザだけで完結します。登録不要・無料で、配信の待機画面用の全画面表示や通知音にも対応。まずはカウントダウンで3分を計ってみて、作業配信ではポモドーロも使ってみてください。`,
    en: `CastKit's Timer is a free timer that needs no sign-up and runs entirely in your browser. Switch between four modes with tabs — countdown, stopwatch, a countdown to a target time, and Pomodoro — all on one page. It includes a fullscreen display for stream standby screens and an alarm sound with a flashing screen when time is up. Everything runs in your browser and nothing you enter is sent anywhere.

## Where an Online Timer Shines

- Showing "X minutes until we start" large on a stream standby screen
- Managing time limits for segments and mini-games
- Building a focus-and-break rhythm on work-along streams (Pomodoro)
- Counting down to your stream start time with "Until Time"
- Everyday time management: studying, chores, cooking

## The Four Modes

- **Countdown**: set hours/minutes/seconds and count down to zero. Common durations are one tap via presets (1, 3, 5, 10, 15 min)
- **Stopwatch**: measure elapsed time with lap timing, shown down to 1/100 second
- **Until Time**: count down to a target date and time (based on your device's local clock)
- **Pomodoro**: automatically alternate focus and break to build a rhythm of concentration and rest

Timers keep running even when you switch tabs, so you can run the stopwatch while setting up a countdown, for example.

## How to Use the Countdown

- Enter hours/minutes/seconds, or pick a preset (1, 3, 5, 10, 15 min)
- Press "Start" to begin; use "Pause" and "Reset" to control it
- At zero it alerts you with a sound (when on) and a flashing screen
- Press "Fullscreen" to show it large; click anywhere or press Esc to return

## Stopwatch and Until Time

The stopwatch offers Start / Pause / Reset plus lap timing, and shows elapsed time down to 1/100 second — handy for lap times and speedruns.

"Until Time" counts down to a target date and time you choose. Because it's based on your device's local clock, it works directly for putting "X until we start" on a standby screen.

## How to Use Pomodoro (One Full Set)

Pomodoro automatically alternates short "Focus" and "Break" periods to build a rhythm of concentration and rest. It's simple to use.

- Set the minutes for "Focus", "Break", and "Long break", plus "Long break every (n)" (defaults: 25 min focus, 5 min break, a long break every 4 sessions)
- Press "Start" to begin the "Focus" timer
- "Focus" → "Break" repeats automatically; after the set number of focus sessions a "Long break" begins — that completes one set
- On each switch it alerts you with a sound (when on) and a flash. Use "Skip" to move on and "Reset" to start over

Your focus/break minutes and interval are saved in your browser, so you start with the same settings next time.

## Tips for Streaming

- **Fullscreen**: display the timer large on a standby or work-along screen. Capture it with a window capture or browser source (OBS and similar)
- **Sound is off by default**: flipping the switch at the top right reveals a volume bar. Even when you can't play sound, the on-screen flash always shows
- **Font**: choose the digit font (the same list as the Scoreboard; it also applies in fullscreen) to match your stream's look — monospace, for example
- **Drift-resistant timing**: remaining time is computed from the real clock, so it corrects itself even after the tab was in the background

## Combine It With Other Tools

- To manage team scores in real time, use the [Scoreboard](/scoreboard)
- For random draws to decide turn order or forfeits, try the [Roulette](/roulette) or [Dice](/dice)

## Handy Gear

- **[Portable monitor](https://www.amazon.co.jp/s?k=portable+monitor&tag=castkit-22)**: Put the standby timer on a second screen to keep an eye on the remaining time while you stream.
- **[Tablet](https://www.amazon.co.jp/s?k=tablet&tag=castkit-22)**: Place it on your desk or game table as a dedicated Pomodoro or time-limit display.
- **[Digital timer](https://www.amazon.co.jp/s?k=digital+timer&tag=castkit-22)**: A physical timer for your hand when you'd rather not use screen space.

## Summary

Countdown, stopwatch, counting down to a set time, and Pomodoro — CastKit's Timer handles them all in the browser alone. It's free, needs no sign-up, and includes a fullscreen display and alarm for stream standby screens. Start by counting down three minutes, and try Pomodoro on your next work-along stream.`,
  },
};
