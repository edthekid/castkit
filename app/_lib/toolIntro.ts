/**
 * 各ツールページ下部に表示する「概要＋使い方＋活用シーン」の単一ソース。
 * ToolIntro コンポーネントが現在のパスに応じて取り出して描画する。
 *
 * ねらい：ツールページ単体に読み物としての本文を持たせ、
 * 検索エンジン・広告審査に対して各URLの独自価値を明確にする。
 * ※ /articles/<slug> の解説記事とは重複しないよう、短く要点のみを書く。
 */

export interface ToolFaqItem {
  /** 質問 */
  q: { ja: string; en: string };
  /** 回答（2〜3文。ツール固有の仕様に基づいて書く） */
  a: { ja: string; en: string };
}

export interface ToolIntro {
  /** ツールのパス（例: /team-division） */
  href: string;
  /** 概要（1〜2文） */
  overview: { ja: string; en: string };
  /** 使い方（手順。順番に意味がある） */
  steps: { ja: string[]; en: string[] };
  /** 活用シーン（箇条書き） */
  useCases: { ja: string[]; en: string[] };
  /** よくある質問（FAQPage JSON-LD にも使われる） */
  faq: ToolFaqItem[];
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
    faq: [
      {
        q: { ja: '人数がチーム数で割り切れないときはどうなりますか？', en: 'What happens when members don’t divide evenly into teams?' },
        a: {
          ja: '端数は自動で調整され、チーム間の人数差が最大でも1人になるように振り分けられます。「5人を2チーム」なら3人と2人に分かれるイメージで、特定のチームだけ極端に多くなることはありません。',
          en: 'The remainder is handled automatically so that team sizes differ by at most one person. Splitting 5 people into 2 teams gives you 3 and 2 — no team ever ends up disproportionately large.',
        },
      },
      {
        q: { ja: '特定のメンバーを同じチームに固定できますか？', en: 'Can I lock specific members to a team?' },
        a: {
          ja: 'できます。メンバーごとにチームを固定してから振り分けると、固定したメンバーはそのチームに残り、残りのメンバーだけがランダムに振り分けられます。ホスト役や初心者の配置を決めておきたいときに便利です。',
          en: 'Yes. Pin a member to a team before splitting and they stay there while everyone else is shuffled randomly — handy for placing hosts or beginners first.',
        },
      },
      {
        q: { ja: '前回と同じ組み合わせを避けることはできますか？', en: 'Can I avoid repeating the same matchups?' },
        a: {
          ja: 'このツールは全チームの対戦組み合わせを「未試合／試合済み」で管理できます。総当たり戦のように全組み合わせを消化したいイベントで、どの組み合わせがまだ残っているかを一目で確認できます。',
          en: 'The tool tracks every team pairing as played or not yet played, so in round-robin style events you can see at a glance which matchups remain.',
        },
      },
      {
        q: { ja: '入力した名前はどこかに保存・送信されますか？', en: 'Are the names I enter stored or sent anywhere?' },
        a: {
          ja: 'いいえ。振り分け処理はすべてお使いのブラウザの中だけで実行され、名前がサーバーへ送信されることはありません。ページを閉じれば入力内容は消えるので、本名を扱うイベントでも安心して使えます。',
          en: 'No. The entire split runs inside your browser and names are never sent to a server. Closing the page clears your input, so it’s safe even for events using real names.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: '抽選結果に偏りはありませんか？', en: 'Is the draw biased in any way?' },
        a: {
          ja: '当たりはコンピュータの乱数で毎回その場で決まり、特定の候補が選ばれやすくなる仕組みはありません。候補の並び順や入力した順番も結果には影響しません。',
          en: 'Each spin picks the winner with a fresh random number — no option is favored, and the order you entered candidates in has no effect on the result.',
        },
      },
      {
        q: { ja: '同じ人が連続で当たらないようにできますか？', en: 'Can I prevent the same person from winning twice?' },
        a: {
          ja: 'できます。オートムーブ（自動除外）をオンにすると、当選した候補は自動でリストから外れ、残りの候補だけで次の抽選ができます。当選者の一覧も表示されるので、複数名を選ぶプレゼント企画に向いています。',
          en: 'Yes. Turn on auto-remove and each winner drops out of the list automatically, so the next spin only includes the rest. A winners list is kept too — ideal for multi-winner giveaways.',
        },
      },
      {
        q: { ja: 'ルーレットとスロットはどう使い分ければいいですか？', en: 'When should I use Wheel mode vs. Slot mode?' },
        a: {
          ja: 'ルーレット（ホイール）は円盤が徐々に減速する様子が見えるため、結果発表をじっくり盛り上げたい場面向きです。スロットはコンパクトで演出時間も短いため、テンポよく何度も抽選したいときや、配信画面の隅に重ねたいときに向いています。',
          en: 'The Wheel shows the disc slowly losing speed, which is great for building suspense before a reveal. The Slot is compact and quick, better for rapid back-to-back draws or tucking into a corner of your stream layout.',
        },
      },
      {
        q: { ja: '配信画面に映して使っても問題ありませんか？', en: 'Can I show this on my live stream?' },
        a: {
          ja: 'はい、配信画面に映してそのまま使えます。OBSなどのウィンドウキャプチャやブラウザソースで取り込めば、視聴者と一緒に抽選の瞬間を共有できます。利用にあたって登録やクレジット表記は不要です。',
          en: 'Absolutely — it’s designed for that. Capture the browser with OBS (window capture or browser source) and your viewers can watch the draw live. No sign-up or credit line required.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: 'あみだくじの結果は本当にランダムですか？', en: 'Is the ladder result truly random?' },
        a: {
          ja: 'はい。横線の位置と本数は生成のたびにランダムに決まるため、どの縦線がどの結果につながるかは事前に分かりません。納得がいかなければ引き直し（再生成）もできます。',
          en: 'Yes. The position and number of rungs are randomized on every generation, so there’s no way to know in advance which line leads where. You can also regenerate the ladder if you want a fresh draw.',
        },
      },
      {
        q: { ja: '「当たり」を複数入れることはできますか？', en: 'Can I include more than one winning slot?' },
        a: {
          ja: 'できます。結果の欄に当たりを複数入力すれば、複数人が当選するくじになります。「大当たり1・当たり2・はずれ残り」のように、景品のランクを分けた設定も可能です。',
          en: 'Yes. Enter multiple winning outcomes and the ladder will have several winners. You can even tier the prizes — one grand prize, two runner-ups, and the rest blanks.',
        },
      },
      {
        q: { ja: '結果はどうやって発表されますか？', en: 'How are the results revealed?' },
        a: {
          ja: '参加者を選ぶと、その人の線をたどるアニメーションが再生され、ゴールの結果が表示されます。1人ずつ順番に発表できるので、配信やイベントで「誰が当たりか」の緊張感を演出できます。',
          en: 'Pick a participant and an animation traces their line down to the goal. Because you reveal one person at a time, it builds real suspense on stream or at an event.',
        },
      },
      {
        q: { ja: '参加者の位置を入れ替えたり、途中でやり直したりできますか？', en: 'Can I swap participants or redo the draw?' },
        a: {
          ja: 'できます。スタート位置の入れ替えや、あみだ全体の引き直しに対応しています。紙のあみだくじと違って書き直しの手間がなく、何度でも作り直せるのがオンライン版の利点です。',
          en: 'Yes — you can swap starting positions or regenerate the whole ladder. Unlike a paper ladder there’s nothing to redraw by hand, so you can redo it as many times as you like.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: '自分で考えたお題を追加できますか？', en: 'Can I add my own topics?' },
        a: {
          ja: 'できます。カスタムお題を登録すると、デフォルトのお題に混ぜて抽選する「デフォルト＋カスタム」と、自分のお題だけで回す「カスタムのみ」の2つのモードで使えます。企画専用のお題リストを作りたいときに便利です。',
          en: 'Yes. Register custom topics and use them in two modes: mixed in with the default pool, or drawing from your custom list alone — perfect for building a topic list for a specific show.',
        },
      },
      {
        q: { ja: '登録したカスタムお題は消えてしまいますか？', en: 'Will my custom topics disappear?' },
        a: {
          ja: 'カスタムお題はお使いのブラウザ（localStorage）に保存されるため、ページを閉じたり再読み込みしたりしても残ります。ただし別の端末やブラウザには引き継がれず、ブラウザの履歴データを消去すると削除されます。',
          en: 'Custom topics are saved in your browser (localStorage), so they survive reloads and closing the page. They don’t sync to other devices or browsers, and clearing your browser data removes them.',
        },
      },
      {
        q: { ja: 'お題はどんなジャンルがありますか？', en: 'What kinds of topics are included?' },
        a: {
          ja: '日常・趣味・ゲーム・「もしも」系など、雑談配信や通話で話を広げやすいジャンルを収録しています。カテゴリで絞り込めるので、その場の空気に合ったお題だけを出すこともできます。',
          en: 'The pool covers everyday life, hobbies, gaming, hypothetical “what if” questions, and more — all chosen to be easy to riff on. You can filter by category to match the mood.',
        },
      },
      {
        q: { ja: '同じお題ばかり出ることはありませんか？', en: 'Won’t I keep getting the same topics?' },
        a: {
          ja: 'お題は毎回ランダムに抽選されます。合わないお題が出たらもう一度ボタンを押すだけで引き直せるので、テンポを崩さずに次の話題へ進めます。',
          en: 'Topics are drawn at random each time, and if one doesn’t land you just press the button again — you can move on to the next topic without breaking your flow.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: '自分たちで考えたお題でディベートできますか？', en: 'Can we debate our own topics?' },
        a: {
          ja: 'できます。「テーマ,陣営A,陣営B」の形式でカスタムお題を登録すれば、内輪ネタや配信企画に合わせたお題で討論できます。もちろん内蔵のお題だけでもすぐに始められます。',
          en: 'Yes. Add custom topics in the format “theme, side A, side B” to debate inside jokes or show-specific themes. The built-in topics work out of the box too.',
        },
      },
      {
        q: { ja: '賛成・反対の割り当ては公平ですか？', en: 'Is the side assignment fair?' },
        a: {
          ja: 'はい。どちらの陣営になるかはランダムに決まるため、「言いたい側」を選べない緊張感が生まれます。本来の自分の意見と逆の立場を弁護することになるのも、ディベートゲームの面白さです。',
          en: 'Yes — sides are assigned at random, so you can’t pick the position you actually agree with. Defending the opposite of your real opinion is half the fun.',
        },
      },
      {
        q: { ja: '持ち時間はどのくらいに設定すればいいですか？', en: 'How long should each round be?' },
        a: {
          ja: 'タイマーの時間は自由に変更できます。配信や飲み会の余興なら1〜3分の短時間で往復させるとテンポよく盛り上がり、研修や授業なら5分以上にして論点を掘り下げるのがおすすめです。',
          en: 'The timer is fully adjustable. For streams and parties, quick 1–3 minute rounds keep the energy up; for classes or training, 5+ minutes lets arguments develop.',
        },
      },
      {
        q: { ja: '2人だけでも使えますか？', en: 'Does it work with just two people?' },
        a: {
          ja: '使えます。1対1の即興ディベートはもちろん、複数人をチームに分けての討論にも対応します。視聴者にコメントでジャッジしてもらうと、配信企画としてさらに盛り上がります。',
          en: 'Yes — it works for 1-on-1 improv debates as well as team battles. On stream, letting viewers judge the winner in chat makes it even livelier.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: 'ページを再読み込みするとスコアは消えますか？', en: 'Do I lose the scores if I reload the page?' },
        a: {
          ja: '消えません。チーム名・スコア・設定はお使いのブラウザ（localStorage）に自動保存されるため、誤ってページを閉じたり再読み込みしたりしても続きから再開できます。データはブラウザ内にのみ保存され、サーバーには送信されません。',
          en: 'No — team names, scores, and settings auto-save to your browser (localStorage), so an accidental reload or closed tab won’t lose the game. The data stays in your browser and is never sent to a server.',
        },
      },
      {
        q: { ja: '点数を間違えて入力してしまったら戻せますか？', en: 'Can I undo a scoring mistake?' },
        a: {
          ja: '戻せます。チームごとに「1つ戻る」で直前の得点操作を取り消せるほか、スコアの数字をダブルクリックすれば任意の値を直接入力できます。加減算の幅も1点から自由に変更できます。',
          en: 'Yes. Each team has a one-step undo for the last change, and double-clicking a score lets you type in any value directly. The increment amount is adjustable too.',
        },
      },
      {
        q: { ja: '試合ごとの結果を記録として残せますか？', en: 'Can I keep a record of each game’s result?' },
        a: {
          ja: '残せます。「記録」機能でその時点のスコアをスナップショットとして保存でき、得点の高い順に整列された一覧で見返せます。各記録はテキストとしてコピーできるので、DiscordやXへの結果報告にも便利です。',
          en: 'Yes — snapshot the current standings with the record feature and review them later, sorted by score. Each record can be copied as text for posting results to Discord or X.',
        },
      },
      {
        q: { ja: '配信画面に合うデザインはありますか？', en: 'Will it look good on my stream overlay?' },
        a: {
          ja: '7セグ風デジタル・モダンミニマル・カードの3デザインから選べ、チームごとにテーマカラーも設定できます。得点が動いたときのアニメーションもあり、配信画面に映したときの見栄えを重視して作られています。',
          en: 'Pick from three designs — 7-segment digital, modern minimal, and cards — with per-team theme colors and scoring animations. It’s built to look good on stream.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: '出目は本物のサイコロと同じように公平ですか？', en: 'Are the rolls as fair as real dice?' },
        a: {
          ja: 'はい。3D物理演算で実際に転がした結果を出目として採用しているため、特定の目が出やすくなる仕組みはありません。d4・d8・d10・d12・d20 も見た目だけでなく実際の多面体として転がります。',
          en: 'Yes — results come from an actual 3D physics simulation of the dice tumbling, with no bias toward any face. The d4, d8, d10, d12, and d20 are simulated as true polyhedra, not just visuals.',
        },
      },
      {
        q: { ja: 'TRPGの1d100（パーセンテージロール）はどう振られますか？', en: 'How does the 1d100 (percentile) roll work?' },
        a: {
          ja: '本物のTRPGと同じ2つのd10方式です。十の位（00〜90）と一の位（0〜9）のダイスを振って合計し、「00」と「0」が出たときは100として扱います。クトゥルフ神話TRPGなどの技能判定にそのまま使えます。',
          en: 'The same two-d10 method as at a real table: a tens die (00–90) plus a units die (0–9), with 00 + 0 counting as 100. Ready to use for skill checks in Call of Cthulhu and similar systems.',
        },
      },
      {
        q: { ja: '出目をDiscordのセッションに共有できますか？', en: 'Can I share rolls with my Discord session?' },
        a: {
          ja: 'できます。出目と合計は履歴に残り、「🎲 2d6 -> [3, 5] = 8」のようなDiscordに貼りやすい形式でコピーできます。オンラインセッションでダイスボットの代わりに使うときに便利です。',
          en: 'Yes — every roll is kept in a history and can be copied in a Discord-friendly format like “🎲 2d6 -> [3, 5] = 8”, handy as a dice-bot substitute in online sessions.',
        },
      },
      {
        q: { ja: 'チンチロの役判定には対応していますか？', en: 'Does it score Chinchiro hands?' },
        a: {
          ja: '対応しています。チンチロモードでは3個のサイコロを振ると、ピンゾロ・ゾロ目・シゴロ・通常役・ヒフミ・目なしを自動で判定し、倍率も表示します。目なしのときは1ターンに最大3回まで振り直せる本場ルールです。',
          en: 'Yes. Chinchiro mode rolls three dice and automatically scores the hand — triple 1s, triples, 4-5-6, point rolls, 1-2-3, and no-hand — with multipliers shown. No-hand rolls allow up to three attempts per turn, per standard rules.',
        },
      },
    ],
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
    faq: [
      {
        q: { ja: '別のタブを開いているとタイマーが遅れませんか？', en: 'Will the timer drift if I switch to another tab?' },
        a: {
          ja: '遅れません。経過時間は端末の実時刻を基準に計算しているため、タブを切り替えたりブラウザが省電力モードになったりしても、戻ってきた時点で正しい残り時間に自動補正されます。配信中に裏でゲームを操作していても安心です。',
          en: 'No — elapsed time is calculated from your device’s real clock, so even if the tab is backgrounded or throttled, the display corrects itself the moment you return. Safe to run behind your game while streaming.',
        },
      },
      {
        q: { ja: '時間になったら音で知らせてくれますか？', en: 'Does it play a sound when time is up?' },
        a: {
          ja: '通知音のスイッチをオンにすると、終了時に音と画面の点滅で知らせます（既定ではオフ）。通知音は音声ファイルではなくブラウザ内で合成しているため、外部への通信は発生しません。',
          en: 'Turn on the sound switch and you’ll get a tone plus a flashing display at zero (off by default). The tone is synthesized right in your browser — no audio file is fetched from anywhere.',
        },
      },
      {
        q: { ja: '配信の待機画面として使えますか？', en: 'Can I use it as a stream starting-soon screen?' },
        a: {
          ja: '使えます。カウントダウンは全画面表示に対応しており、「指定時刻まで」モードなら配信開始時刻を設定して「開始まであと◯分」の表示ができます。OBSでブラウザを取り込めばそのまま待機画面になります。',
          en: 'Yes. Countdown supports a fullscreen display, and the “until a set time” mode counts down to your scheduled start. Capture the browser in OBS and it becomes your waiting screen.',
        },
      },
      {
        q: { ja: 'ポモドーロの作業時間や休憩時間は変更できますか？', en: 'Can I customize the Pomodoro work and break lengths?' },
        a: {
          ja: '変更できます。既定は「25分作業＋5分休憩」ですが、作業・休憩・長い休憩の分数と長い休憩を入れる間隔を自由に設定でき、設定はブラウザに保存されて次回も引き継がれます。完了したサイクル数も表示されます。',
          en: 'Yes. The default is 25 minutes work + 5 minutes break, but every duration and the long-break interval are adjustable, and your settings persist in the browser. Completed cycles are counted for you.',
        },
      },
    ],
  },
];

/** パスから対応する概要データを取得 */
export const getToolIntro = (href: string): ToolIntro | undefined =>
  TOOL_INTRO.find((t) => t.href === href);
