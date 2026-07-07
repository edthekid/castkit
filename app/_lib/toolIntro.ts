/**
 * 各ツールページ下部に表示する「概要＋使い方＋活用シーン」の単一ソース。
 * ToolIntro コンポーネントが現在のパスに応じて取り出して描画する。
 *
 * ねらい：ツールページ単体に読み物としての本文を持たせ、
 * 検索エンジン・広告審査に対して各URLの独自価値を明確にする。
 * ※ /articles/<slug> の解説記事とは重複しないよう、短く要点のみを書く。
 */

export interface ToolIntro {
  /** ツールのパス（例: /team-division） */
  href: string;
  /** 概要（1〜2文） */
  overview: { ja: string; en: string };
  /** 使い方（手順。順番に意味がある） */
  steps: { ja: string[]; en: string[] };
  /** 活用シーン（箇条書き） */
  useCases: { ja: string[]; en: string[] };
}

export const TOOL_INTRO: ToolIntro[] = [
  {
    href: '/team-division',
    overview: {
      ja: 'メンバー名を入力するだけで、人数の偏りがないバランスの取れたチームへ自動で振り分ける無料ツールです。登録不要・ブラウザ内で完結し、入力した名前はサーバーに送信されません。',
      en: 'A free tool that auto-splits a list of members into balanced, evenly sized teams. No sign-up, runs entirely in your browser, and the names you enter are never sent to a server.',
    },
    steps: {
      ja: [
        'メンバーの名前を1行ずつ入力する',
        '分けたいチーム数を選ぶ',
        '「振り分け」を押すと均等なチームが即座に表示される',
        '結果が偏っていると感じたら、もう一度押して引き直せる',
      ],
      en: [
        'Enter member names, one per line',
        'Choose how many teams you want',
        'Press "Split" to instantly get balanced teams',
        'Not happy with the result? Press again to reshuffle',
      ],
    },
    useCases: {
      ja: [
        'ゲーム配信での視聴者参加型チーム戦',
        'スポーツ・ボードゲームの対戦チーム決め',
        'グループワーク・班分け',
        '飲み会やイベントの席・グループ決め',
      ],
      en: [
        'Viewer-participation team battles on game streams',
        'Forming match teams for sports or board games',
        'Splitting a class or group into working teams',
        'Assigning seats or groups at parties and events',
      ],
    },
  },
  {
    href: '/roulette',
    overview: {
      ja: '候補を入力して回すだけで、当たりを1つランダムに選ぶ無料の抽選ツールです。ホイール（円盤）とスロットの2デザインを切り替えられ、当選者を候補から自動で外す連続抽選にも対応します。',
      en: 'A free random picker: enter your options, spin, and one winner is chosen at random. Switch between a Wheel and a Slot design, and optionally remove winners automatically for back-to-back draws.',
    },
    steps: {
      ja: [
        '候補（名前・項目）を1行ずつ入力する',
        'ホイールかスロットのデザインを選ぶ',
        '「回す」を押して抽選し、当たりを1つ決める',
        '連続で選びたいときは当選者を自動で外す設定にする',
      ],
      en: [
        'Enter your options, one per line',
        'Pick the Wheel or Slot design',
        'Press "Spin" to draw a single winner',
        'Turn on auto-remove to keep drawing without repeats',
      ],
    },
    useCases: {
      ja: [
        '配信でのプレゼント・視聴者抽選',
        '順番決め・罰ゲーム・当番決め',
        'ランチや行き先など迷ったときの決定',
        'ゲームイベントでのお題・マップ抽選',
      ],
      en: [
        'Giveaways and viewer raffles on stream',
        'Deciding turn order, forfeits, or who is on duty',
        'Settling "where to eat / where to go" debates',
        'Drawing topics or maps for gaming events',
      ],
    },
  },
  {
    href: '/amida',
    overview: {
      ja: '参加者と結果を入力するだけで、あみだくじ（ラダーくじ）を自動生成する無料ツールです。線をたどるアニメーションで結果を1人ずつ確認でき、登録不要・ブラウザ内で完結します。',
      en: 'A free ladder lottery (Amida) tool: enter the participants and the outcomes, and the ladder is generated automatically. Trace each line with an animation to reveal results one by one — no sign-up, all in your browser.',
    },
    steps: {
      ja: [
        '参加者の名前を入力する',
        '割り当てたい結果（当たり・役割など）を入力する',
        'あみだくじが自動生成される',
        '各参加者の線をたどって結果を確認する',
      ],
      en: [
        'Enter the participants',
        'Enter the outcomes to assign (prizes, roles, etc.)',
        'The ladder lottery is generated automatically',
        'Trace each line to reveal who gets what',
      ],
    },
    useCases: {
      ja: [
        '役割・担当のランダム割り当て',
        'プレゼントや景品の割り振り',
        'ゲームの担当ポジション・順番決め',
        'イベントの余興・グループ内抽選',
      ],
      en: [
        'Randomly assigning roles or duties',
        'Handing out prizes or gifts',
        'Deciding in-game positions or turn order',
        'Party games and small-group draws',
      ],
    },
  },
  {
    href: '/topic',
    overview: {
      ja: '雑談のきっかけになるお題をランダムに出す無料の「お題ガチャ」です。配信の待機中やゲームの合間に、会話が途切れたときのネタ出しに使えます。登録不要・ブラウザだけで動きます。',
      en: 'A free random topic picker ("Topic Gacha") that serves up conversation starters at random. Great for filling waiting time on stream or gaps between games when the chat goes quiet. No sign-up, browser only.',
    },
    steps: {
      ja: [
        'ボタンを押すとお題がランダムに1つ表示される',
        '気に入らなければもう一度押して引き直す',
        '出たお題をきっかけに雑談・トークを広げる',
      ],
      en: [
        'Press the button to draw one random topic',
        'Not feeling it? Press again for another',
        'Use the topic to spark conversation',
      ],
    },
    useCases: {
      ja: [
        '配信の開始前・待機中のトークネタ',
        'ゲームのロード中・合間の間つなぎ',
        '通話・オフ会でのアイスブレイク',
        'コラボ配信での話題づくり',
      ],
      en: [
        'Talking points before or during stream standby',
        'Filling loading screens and gaps between games',
        'Ice-breakers on calls and meetups',
        'Sparking topics for collab streams',
      ],
    },
  },
  {
    href: '/debate',
    overview: {
      ja: 'お題と賛成・反対の陣営をランダムに決め、制限時間も測れる無料のディベート用ツールです。配信やグループゲームで、手軽にミニ討論を始められます。登録不要・ブラウザ内で完結します。',
      en: 'A free debate tool that randomly assigns a topic and the pro/con sides, with a built-in timer. Kick off a quick mini-debate on stream or in group games — no sign-up, all in your browser.',
    },
    steps: {
      ja: [
        'お題をランダムに決める',
        '参加者を賛成・反対の陣営に振り分ける',
        'タイマーを開始して持ち時間内で主張する',
        '時間が来たら次のお題・陣営を引き直す',
      ],
      en: [
        'Draw a random debate topic',
        'Assign participants to the pro or con side',
        'Start the timer and argue within the time limit',
        'When time is up, draw a new topic and sides',
      ],
    },
    useCases: {
      ja: [
        '配信での視聴者巻き込み型ミニディベート',
        'グループ通話での議論ゲーム',
        '研修・授業でのディベート練習',
        'コラボ企画の盛り上げネタ',
      ],
      en: [
        'Viewer-driven mini-debates on stream',
        'Discussion games on group calls',
        'Debate practice for classes or training',
        'A lively segment for collab shows',
      ],
    },
  },
  {
    href: '/scoreboard',
    overview: {
      ja: 'チームや個人の得点をリアルタイムに管理できる無料のスコアボードです。加点・減点をワンタップで反映でき、配信画面に映してそのまま使えます。登録不要・ブラウザ内で完結します。',
      en: 'A free scoreboard for tracking team or individual points in real time. Add or subtract points with a tap, and show it right on your stream. No sign-up, all in your browser.',
    },
    steps: {
      ja: [
        'チーム名・プレイヤー名を登録する',
        '試合の進行に合わせて加点・減点する',
        'スコアはリアルタイムに更新・表示される',
        '配信画面に映して観戦者と共有する',
      ],
      en: [
        'Add team or player names',
        'Add or subtract points as the game unfolds',
        'Scores update and display in real time',
        'Put it on your stream to share with viewers',
      ],
    },
    useCases: {
      ja: [
        'ゲーム大会・対戦イベントの得点管理',
        '配信での視聴者参加型企画のスコア表示',
        'ボードゲーム・クイズの点数付け',
        'スポーツ観戦・練習試合のスコア',
      ],
      en: [
        'Keeping score at gaming tournaments',
        'Displaying scores for viewer-participation events',
        'Tallying points in board games and quizzes',
        'Tracking scores at sports and practice matches',
      ],
    },
  },
  {
    href: '/dice',
    overview: {
      ja: '登録不要・ブラウザだけで使える無料のサイコロツールです。基本モード（d6を1〜10個）・TRPGモード（d4〜d100のダイスセット）・チンチロに対応し、出目はDiscordに貼りやすい形式でコピーできます。',
      en: 'A free dice roller that runs in your browser with no sign-up. Roll 1–10 d6 in Basic mode, pick TRPG dice sets (d4–d100), or play Chinchiro — and copy results in a Discord-friendly format.',
    },
    steps: {
      ja: [
        'モードを選ぶ（基本／TRPG／チンチロ）',
        '基本はサイコロの数、TRPGはダイスセットをプリセットから選ぶ',
        '「振る」を押すと3Dで転がり、合計と出目が表示される',
        '履歴の「コピー」でDiscord向けテキストを取得できる',
      ],
      en: [
        'Choose a mode (Basic, TRPG, or Chinchiro)',
        'Pick the number of dice, or a TRPG dice-set preset',
        'Press "Roll" — dice tumble in 3D and show the total',
        'Use "Copy" on any history entry for Discord-ready text',
      ],
    },
    useCases: {
      ja: [
        'TRPG（クトゥルフ・D&Dなど）の判定',
        'ボードゲーム・すごろくの物理サイコロ代わり',
        '順番決め・罰ゲームなどのランダム決め',
        'チンチロなどサイコロを使った遊び',
      ],
      en: [
        'Checks in TRPGs like Call of Cthulhu or D&D',
        'A stand-in for physical dice in board games',
        'Random decisions like turn order or forfeits',
        'Classic dice games such as Chinchiro',
      ],
    },
  },
  {
    href: '/timer',
    overview: {
      ja: 'カウントダウン・ストップウォッチ・ポモドーロに対応した無料のタイマーです。全画面表示で配信や作業に映しやすく、登録不要・ブラウザだけで動きます。',
      en: 'A free timer with countdown, stopwatch, and Pomodoro modes. A fullscreen display makes it easy to show on stream or while you work — no sign-up, browser only.',
    },
    steps: {
      ja: [
        'モードを選ぶ（カウントダウン／ストップウォッチ／ポモドーロ）',
        '時間を設定して開始する',
        '必要なら全画面表示に切り替える',
        '終了時の通知で時間切れがわかる',
      ],
      en: [
        'Choose a mode (Countdown, Stopwatch, or Pomodoro)',
        'Set the time and start',
        'Switch to fullscreen display if needed',
        'A notification tells you when time is up',
      ],
    },
    useCases: {
      ja: [
        '配信・イベントの残り時間表示',
        'ポモドーロでの作業・勉強の集中管理',
        'ゲームの制限時間・ターン管理',
        '料理・運動などの時間計測',
      ],
      en: [
        'Showing remaining time on streams and events',
        'Focused work or study with the Pomodoro technique',
        'Managing game time limits and turns',
        'Timing cooking, workouts, and more',
      ],
    },
  },
];

/** パスから対応する概要データを取得 */
export const getToolIntro = (href: string): ToolIntro | undefined =>
  TOOL_INTRO.find((t) => t.href === href);
