export type Locale = 'ja' | 'en';

export const LOCALES: Locale[] = ['ja', 'en'];
export const DEFAULT_LOCALE: Locale = 'ja';

/**
 * 翻訳辞書。
 * キーは `画面.要素` 形式のドット区切りで管理する。
 */
export const translations = {
  ja: {
    // ─── 共通 ─────────────────────────────────────────
    'common.castkit':        'CastKit',
    'common.utilityToolkit':  'UTILITY TOOLKIT',
    'common.copyright':       '© 2026 CastKit',
    'common.editTitle':       'タイトルを編集',
    'footer.privacy':         'プライバシーポリシー',
    'footer.contact':         'お問い合わせ',

    // ─── ナビゲーション ───────────────────────────────
    'nav.home':         'ホーム',
    'nav.teamDivision': 'チーム分け',
    'nav.roulette':     'ルーレット',
    'nav.amida':        'あみだくじ',
    'nav.topic':        'お題',
    'nav.debate':       'ディベート',
    'nav.guide':        '使い方ガイド',
    'nav.articles':     '記事',

    // ─── ホーム ───────────────────────────────────────
    'home.badge':       '配信・ゲームイベント支援ツール',
    'home.subtitleLine1': '配信、対戦ゲーム、イベント進行を',
    'home.subtitleLine2': 'スムーズにするための便利ツール集',
    'home.teamDivision.title':       'チーム分け',
    'home.teamDivision.description': 'メンバーを指定チーム数に均等振り分け。固定メンバー設定にも対応。',
    'home.roulette.title':       'ルーレット',
    'home.roulette.description': 'ランダム抽選ツール。ルーレット＆スロットの2モード搭載。',
    'home.amida.title':       'あみだくじ',
    'home.amida.description': 'あみだくじで参加者に結果をランダム割り当て。',
    'home.topic.title':       'お題ガチャ',
    'home.topic.description': '雑談で使えるお題をランダム抽選。カテゴリ別の絞り込みにも対応。',
    'home.debate.title':       'ディベート',
    'home.debate.description': 'お題と陣営をランダム決定。タイマー付きで熱いディベートを楽しもう。',
    'home.cardOpen': '開く',
    'home.guideLink': '使い方ガイド →',

    // ─── チーム分け ───────────────────────────────────
    'teamDivision.badge':    'Team Division',
    'teamDivision.title':    'チーム分け',
    'teamDivision.subtitle': 'メンバーを入力して、ベストな組み合わせを見つけよう',
    'teamDivision.patternName': 'パターン {n}',

    'memberInput.title':  'メンバー入力',
    'memberInput.count':  '現在 {count} 人',
    'memberInput.placeholder': '改行区切りで入力してください',

    'teamSettings.countTitle': 'チーム数',
    'teamSettings.namesTitle': 'チームの名前を変更',
    'teamSettings.namePlaceholder': 'チーム {n}',

    'memberFix.title':    'メンバーのチーム固定',
    'memberFix.subtitle': '名前の枠をクリックすると所属チームが切り替わります',
    'memberFix.colorGuide': '配色：',
    'memberFix.noFix':    '固定なし',
    'memberFix.tag':      'T{n}',

    'divideButton': '結果を見る',

    'patternList.unplayed':  '未試合 ({count})',
    'patternList.played':    '試合した組み合わせ ({count})',
    'patternList.emptyPlayed':   '試合した組み合わせはまだありません',
    'patternList.emptyUnplayed': 'すべての組み合わせが試合済みです！',

    'patternCard.copy':       'コピー',
    'patternCard.markPlayed': '試合した',
    'patternCard.markUnplayed': '未試合に戻す',
    'patternCard.memberCount': '{count}人',
    'patternCard.defaultTeamName': 'チーム {n}',

    // toast
    'toast.errorEmptyMembers':   'メンバーの名前を入力してください。',
    'toast.errorTooFewMembers':  'メンバー数がチーム数より少ないです。',
    'toast.errorFixedTooMany':   '{team} に固定された人数が多すぎます。',
    'toast.errorTooMany':        'メンバー数が多いため、最初の{max}件のみを表示します。',
    'toast.errorNoCombination':  '固定条件を満たす組み合わせが見つかりませんでした。',
    'toast.fewPatternsNote':     '同じペアが重ならないように絞り込んだ結果、{count}パターンのみ生成されました。',
    'toast.copiedPattern':       '{pattern} をコピーしました',
    'toast.markedUnplayed':      '{pattern} を未試合に戻しました',
    'toast.markedPlayed':        '{pattern} を「試合した組み合わせ」に移動しました',
    'toast.copyHeader':          '【{pattern}：{team}】',
    'toast.errorCopyFailed':     'コピーに失敗しました',

    // ─── ルーレット ───────────────────────────────────
    'roulette.badge':    'Roulette',
    'roulette.title':    'ルーレット',
    'roulette.subtitle': '候補者を入力してランダム抽選しよう',
    'roulette.tabWheel': 'ルーレット',
    'roulette.tabSlot':  'スロット',
    'roulette.start':    'Start',
    'roulette.emptyError': '候補者がいません',

    'candidatePanel.title':   '候補者リスト',
    'candidatePanel.count':   '{count} 人',
    'candidatePanel.autoMove':'当選者移動',
    'candidatePanel.placeholder': '改行区切りで入力してください',

    'winnersPanel.title':     '当選者',
    'winnersPanel.count':     '{count} 人',
    'winnersPanel.returnAll': '全部戻す',
    'winnersPanel.empty':     '当選者はまだいません',

    // ─── あみだくじ ───────────────────────────────────
    'amida.badge':    'Amida',
    'amida.title':    'あみだくじ',
    'amida.subtitle': '参加者と結果を入力してくじを作ろう',
    'amida.editTitle': 'タイトルを編集',

    'amidaInput.players':       '参加者',
    'amidaInput.playersCount':  '{count} 人',
    'amidaInput.playersPlaceholder': 'Aさん\nBさん\nCさん',
    'amidaInput.results':       '結果',
    'amidaInput.resultsPlaceholder': '当たり\nはずれ\nはずれ',
    'amidaInput.winCount':      '当たりの数',
    'amidaInput.errorCountMismatch': '参加者数（{playerCount}人）と結果数（{resultCount}件）を合わせてください',
    'amidaInput.errorMinPlayers':    '参加者は2人以上入力してください',
    'amidaInput.generate':      'あみだを作る',

    'amidaCanvas.back':       '入力に戻る',
    'amidaCanvas.regenerate': '引き直す',
    'amidaCanvas.start':      'スタート',

    'amidaResult.title': '結果',
    'amidaResult.copy':   'コピー',
    'amidaResult.copied': 'コピーしました！',

    // ─── お題ガチャ ─────────────────────────────────────
    'topic.title':    'お題ガチャ',
    'topic.subtitle': '雑談で使えるお題をランダムに決めよう',

    'topic.categoryTitle':    'カテゴリ',
    'topic.clearFilter':      'すべて選択に戻す',
    'topic.allCategoriesNote':  '未選択時は全カテゴリからランダムに抽選します',
    'topic.filteredNote':       '選択したカテゴリの中からランダムに抽選します',

    'topic.idleMessage': 'ボタンを押してお題を決めよう',
    'topic.drawButton':  'お題を決める',
    'topic.drawing':     '抽選中...',
    'topic.noTopics':             '対象のお題がありません',
    'topic.noTopicsCustomOnlyHint': '設定からカスタムお題を追加してください',

    'topic.historyTitle': '履歴',
    'topic.historyCount': '{count} 件',
    'topic.historyEmpty': 'まだお題を決めていません',
    'topic.clearHistory': '履歴を消す',

    'topic.category.recent': '最近の話',
    'topic.category.hobby':  '趣味',
    'topic.category.food':   '食べ物',
    'topic.category.travel': '旅行',
    'topic.category.work':   '仕事・将来',
    'topic.category.fun':    'もしも・盛り上がる話',
    'topic.category.lifestyle': '暮らし',
    'topic.category.deep':      '深い話',
    'topic.category.school':    '学生時代',
    'topic.category.tech':      'ガジェット・IT',
    'topic.category.season':    '季節・イベント',
    'topic.category.romance':   '恋愛',
    'topic.category.relationship':   '人間関係',

    // お題設定
    'topic.settings':             '設定',
    'topic.settingsTitle':        'お題設定',
    'topic.customTopicLabel':     'カスタムお題',
    'topic.customTopicHint':      '1行ごとにお題を入力',
    'topic.customTopicPlaceholder': '好きな食べ物は？\n最近ハマっていること',
    'topic.topicModeLabel':       'お題の範囲',
    'topic.modeAll':              'デフォルト＋カスタム',
    'topic.modeCustomOnly':       'カスタムのみ',
    'topic.customTopicCount':     'カスタムお題: {count}件',
    'topic.settingsClose':        '設定を閉じる',

    // ─── ディベート ──────────────────────────────────────
    'debate.title':       'ディベート',
    'debate.subtitle':    'お題と陣営がランダムに決まる！チームで討論しよう',
    'debate.startButton': 'スタート',
    'debate.idleMessage': 'スタートを押してお題と陣営を決めよう',
    'debate.topicLabel':  'お題',
    'debate.timerLabel':  'タイマー',
    'debate.min':         '分',
    'debate.timerStart':  'タイマースタート',
    'debate.timeUp':      '終了',
    'debate.restart':     '終了',
    'debate.resetTimer':  'タイマーリセット',
    'debate.redraw':      'お題を引き直す',
    'debate.settings':        '設定',
    'debate.settingsTitle':   'ディベート設定',
    'debate.customTopicLabel':   'カスタムお題',
    'debate.customTopicHint':    '1行ごとに入力：テーマ,陣営A,陣営B',
    'debate.customTopicPlaceholder': '宇宙旅行するなら,月,火星\n無人島に持っていくなら,スマホ,ナイフ',
    'debate.topicModeLabel':  'お題の範囲',
    'debate.modeAll':         'デフォルト＋カスタム',
    'debate.modeCustomOnly':  'カスタムのみ',
    'debate.customTimerLabel': 'タイマー設定（分）',
    'debate.customTimerPlaceholder': '例：10',
    'debate.settingsClose':   '閉じる',
    'debate.customTopicCount': '{count}件のカスタムお題',
  },

  en: {
    // ─── Common ───────────────────────────────────────
    'common.castkit':        'CastKit',
    'common.utilityToolkit':  'UTILITY TOOLKIT',
    'common.copyright':       '© 2026 CastKit',
    'common.editTitle':       'Edit title',
    'footer.privacy':         'Privacy Policy',
    'footer.contact':         'Contact',

    // ─── Navigation ───────────────────────────────────
    'nav.home':         'Home',
    'nav.teamDivision': 'Team Division',
    'nav.roulette':     'Roulette',
    'nav.amida':        'Amida',
    'nav.topic':        'Topic',
    'nav.debate':       'Debate',
    'nav.guide':        'Guide',
    'nav.articles':     'Articles',

    // ─── Home ─────────────────────────────────────────
    'home.badge':       'Streaming and Gaming Event Toolkit',
    'home.subtitleLine1': 'A collection of handy tools to make streaming,',
    'home.subtitleLine2': 'competitive games, and events run smoothly',
    'home.teamDivision.title':       'Team Division',
    'home.teamDivision.description': 'Evenly split members into a set number of teams. Supports fixed member assignments.',
    'home.roulette.title':       'Roulette',
    'home.roulette.description': 'Random selection tool. Wheel and Slot modes available.',
    'home.amida.title':       'Amida (Ladder Lottery)',
    'home.amida.description': 'Randomly assign results to participants using a ladder lottery.',
    'home.topic.title':       'Topic Picker',
    'home.topic.description': 'Randomly draw chat topics for streams. Filter by category.',
    'home.debate.title':       'Debate',
    'home.debate.description': 'Randomly assign the topic and sides. Debate with a built-in timer.',
    'home.cardOpen': 'Open',
    'home.guideLink': 'How to Use →',

    // ─── Team Division ────────────────────────────────
    'teamDivision.badge':    'Team Division',
    'teamDivision.title':    'Team Division',
    'teamDivision.subtitle': 'Enter members and find the best combination',
    'teamDivision.patternName': 'Pattern {n}',

    'memberInput.title':  'Members',
    'memberInput.count':  '{count} members',
    'memberInput.placeholder': 'Enter one name per line',

    'teamSettings.countTitle': 'Number of Teams',
    'teamSettings.namesTitle': 'Rename Teams',
    'teamSettings.namePlaceholder': 'Team {n}',

    'memberFix.title':    'Fix Members to Teams',
    'memberFix.subtitle': 'Click a name to cycle through team assignments',
    'memberFix.colorGuide': 'Colors:',
    'memberFix.noFix':    'Unassigned',
    'memberFix.tag':      'T{n}',

    'divideButton': 'Show Results',

    'patternList.unplayed':  'Unplayed ({count})',
    'patternList.played':    'Played ({count})',
    'patternList.emptyPlayed':   'No played combinations yet',
    'patternList.emptyUnplayed': 'All combinations have been played!',

    'patternCard.copy':       'Copy',
    'patternCard.markPlayed': 'Played',
    'patternCard.markUnplayed': 'Mark as Unplayed',
    'patternCard.memberCount': '{count}',
    'patternCard.defaultTeamName': 'Team {n}',

    // toast
    'toast.errorEmptyMembers':   'Please enter member names.',
    'toast.errorTooFewMembers':  'There are fewer members than teams.',
    'toast.errorFixedTooMany':   '{team} has too many fixed members.',
    'toast.errorTooMany':        'Too many members — showing only the first {max} combinations.',
    'toast.errorNoCombination':  'No combination matches the fixed conditions.',
    'toast.fewPatternsNote':     'Only {count} pattern(s) were generated to avoid repeating the same pairs.',
    'toast.copiedPattern':       'Copied {pattern}',
    'toast.markedUnplayed':      'Marked {pattern} as unplayed',
    'toast.markedPlayed':        'Moved {pattern} to played combinations',
    'toast.copyHeader':          '[{pattern}: {team}]',
    'toast.errorCopyFailed':     'Copy failed',

    // ─── Roulette ─────────────────────────────────────
    'roulette.badge':    'Roulette',
    'roulette.title':    'Roulette',
    'roulette.subtitle': 'Enter candidates and spin for a random pick',
    'roulette.tabWheel': 'Wheel',
    'roulette.tabSlot':  'Slot',
    'roulette.start':    'Start',
    'roulette.emptyError': 'No candidates',

    'candidatePanel.title':   'Candidates',
    'candidatePanel.count':   '{count}',
    'candidatePanel.autoMove':'Move winners',
    'candidatePanel.placeholder': 'Enter one entry per line',

    'winnersPanel.title':     'Winners',
    'winnersPanel.count':     '{count}',
    'winnersPanel.returnAll': 'Return All',
    'winnersPanel.empty':     'No winners yet',

    // ─── Amida ────────────────────────────────────────
    'amida.badge':    'Amida',
    'amida.title':    'Amida',
    'amida.subtitle': 'Enter participants and results to create a ladder lottery',
    'amida.editTitle': 'Edit title',

    'amidaInput.players':       'Participants',
    'amidaInput.playersCount':  '{count}',
    'amidaInput.playersPlaceholder': 'Alice\nBob\nCharlie',
    'amidaInput.results':       'Results',
    'amidaInput.resultsPlaceholder': 'Win\nLose\nLose',
    'amidaInput.winCount':      'Number of wins',
    'amidaInput.errorCountMismatch': 'Number of participants ({playerCount}) and results ({resultCount}) must match',
    'amidaInput.errorMinPlayers':    'Please enter at least 2 participants',
    'amidaInput.generate':      'Create',

    'amidaCanvas.back':       'Back to input',
    'amidaCanvas.regenerate': 'Reshuffle',
    'amidaCanvas.start':      'Start',

    'amidaResult.title': 'Results',
    'amidaResult.copy':   'Copy',
    'amidaResult.copied': 'Copied!',

    // ─── Topic Picker ───────────────────────────────────
    'topic.title':    'Topic Picker',
    'topic.subtitle': 'Randomly pick a topic for your chat',

    'topic.categoryTitle':    'Categories',
    'topic.clearFilter':      'Reset to all',
    'topic.allCategoriesNote':  'No category selected — drawing from all categories',
    'topic.filteredNote':       'Drawing only from the selected categories',

    'topic.idleMessage': 'Press the button to pick a topic',
    'topic.drawButton':  'Draw a topic',
    'topic.drawing':     'Drawing...',
    'topic.noTopics':             'No topics available',
    'topic.noTopicsCustomOnlyHint': 'Add custom topics in Settings',

    'topic.historyTitle': 'History',
    'topic.historyCount': '{count}',
    'topic.historyEmpty': 'No topics drawn yet',
    'topic.clearHistory': 'Clear history',

    'topic.category.recent': 'Recent',
    'topic.category.hobby':  'Hobbies',
    'topic.category.food':   'Food',
    'topic.category.travel': 'Travel',
    'topic.category.work':   'Work and Future',
    'topic.category.fun':    'Fun and Hypotheticals',
    'topic.category.lifestyle': 'Lifestyle',
    'topic.category.deep':      'Deep Talk',
    'topic.category.school':    'School Days',
    'topic.category.tech':      'Tech and Gadgets',
    'topic.category.season':    'Seasons and Events',
    'topic.category.romance':         'Love and Relationships',
    'topic.category.relationship':    'Human Relationships',

    // Topic settings
    'topic.settings':             'Settings',
    'topic.settingsTitle':        'Topic Settings',
    'topic.customTopicLabel':     'Custom Topics',
    'topic.customTopicHint':      'Enter one topic per line',
    'topic.customTopicPlaceholder': 'e.g. Favorite food?\nSomething you\'ve been into lately',
    'topic.topicModeLabel':       'Topic Pool',
    'topic.modeAll':              'Default + Custom',
    'topic.modeCustomOnly':       'Custom Only',
    'topic.customTopicCount':     'Custom topics: {count}',
    'topic.settingsClose':        'Close Settings',

    // ─── Debate ──────────────────────────────────────────
    'debate.title':       'Debate',
    'debate.subtitle':    'Random topic and sides — debate it out!',
    'debate.startButton': 'Start',
    'debate.idleMessage': 'Press start to decide the topic and factions',
    'debate.topicLabel':  'Topic',
    'debate.timerLabel':  'Timer',
    'debate.min':         'min',
    'debate.timerStart':  'Start Timer',
    'debate.timeUp':      'Time Up',
    'debate.restart':     'End',
    'debate.resetTimer':  'Reset Timer',
    'debate.redraw':      'Redraw Topic',
    'debate.settings':        'Settings',
    'debate.settingsTitle':   'Debate Settings',
    'debate.customTopicLabel':   'Custom Topics',
    'debate.customTopicHint':    'One per line: Theme,Faction A,Faction B',
    'debate.customTopicPlaceholder': 'Space travel,Moon,Mars\nDesert island,Smartphone,Knife',
    'debate.topicModeLabel':  'Topic Source',
    'debate.modeAll':         'Default + Custom',
    'debate.modeCustomOnly':  'Custom Only',
    'debate.customTimerLabel': 'Timer Setting (min)',
    'debate.customTimerPlaceholder': 'e.g. 10',
    'debate.settingsClose':   'Close',
    'debate.customTopicCount': '{count} custom topic(s)',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof translations['ja'];
