'use client';

import Link from 'next/link';
import { useTranslation } from '../_i18n/useTranslation';
import { IconBolt, IconTarget, IconLadder, IconChat, IconScales, IconTrophy, IconDice } from '../_components/icons';
import type { ComponentType, SVGProps } from 'react';

type Locale = 'ja' | 'en';

interface ToolContent {
  href: string;
  tag: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  name: string;
  summary: string;
  steps: string[];
  tips: string[];
  usecases: string[];
  related: string[]; // hrefs of related tools
}

const TOOLS: Record<Locale, ToolContent[]> = {
  ja: [
    {
      href: '/team-division',
      tag: 'Team Division',
      icon: IconBolt,
      name: 'チーム分け',
      summary: 'メンバーをランダムに均等チームへ振り分けるツールです。人数・チーム数・メンバー固定を自由に設定でき、全組み合わせパターンをまとめて生成します。',
      steps: [
        'メンバー名を1行1名で入力する（例：田中、鈴木、佐藤…）',
        'チーム数を選ぶ（2〜8チーム）',
        '「結果を見る」ボタンを押す',
        '生成されたパターンを確認。気に入ったものをコピーして共有する',
      ],
      tips: [
        '特定のメンバーを固定チームに入れたい場合は「メンバーのチーム固定」機能を使う',
        '複数パターンが生成されるので、過去に試した組み合わせを「試合した」に移しながら使える',
        'チームの名前は自由に変更できる（例：赤チーム、青チームなど）',
        'コピーボタンで全パターンをテキスト形式でクリップボードに保存できる',
      ],
      usecases: [
        '配信での視聴者参加型チーム戦（5人 vs 5人など）',
        '社内・学校でのゲームイベントやレクリエーション',
        'オフ会・合宿のチーム分け',
        'オンラインゲームでの毎回公平なチーム組み替え',
      ],
      related: ['/amida', '/roulette'],
    },
    {
      href: '/roulette',
      tag: 'Roulette',
      icon: IconTarget,
      name: 'ルーレット',
      summary: '名前や選択肢を入力してランダムに1つを選ぶ抽選ツールです。視覚的に盛り上がる「ルーレットモード」と、スピーディな「スロットモード」の2種類を切り替えて使えます。',
      steps: [
        '選択肢（名前など）を改行区切りで入力する',
        'ルーレット / スロット どちらかのモードを選ぶ',
        'スタートボタンを押して抽選する',
        '当選した選択肢が大きく表示される',
      ],
      tips: [
        '選択肢は最大20件まで入力できる',
        'ルーレットモードは配信映えする演出、スロットモードは速くてシンプル',
        '配信画面に映しながらリアルタイムで使える',
        '当選者を除外して次の抽選に進む「当選者リスト」機能あり',
      ],
      usecases: [
        '配信での視聴者コメント抽選・プレゼント当選者決め',
        '罰ゲームや次のゲームの内容をルーレットで決める',
        'お菓子や景品の当選者決定',
        '何でもランダムに決めたいときに',
      ],
      related: ['/team-division', '/amida'],
    },
    {
      href: '/amida',
      tag: 'Amida',
      icon: IconLadder,
      name: 'あみだくじ',
      summary: '参加者と結果を入力するだけで、自動であみだくじを生成して結果を割り当てるツールです。公平なランダム割り当てをリアルタイムで演出できます。',
      steps: [
        '参加者の名前を入力する（左列）',
        '結果（役割・景品・罰ゲームの内容など）を入力する（右列）',
        '「あみだを作る」ボタンを押す',
        'あみだくじが自動で引かれ、各参加者の結果が順番に表示される',
      ],
      tips: [
        '参加者数と結果の数は自動で合わせられる',
        '結果を再抽選したいときはもう一度スタートを押す',
        '画面をそのまま配信に映せる見やすいデザイン',
        '参加者が多い場合は結果の数を絞ると早く進む',
      ],
      usecases: [
        'ゲームの担当キャラ・ポジション・役職決め',
        '配信企画の順番・出番決め',
        '罰ゲームや景品の割り当て',
        '飲み会やイベントの席順・役割決め',
      ],
      related: ['/roulette', '/team-division'],
    },
    {
      href: '/topic',
      tag: 'Topic',
      icon: IconChat,
      name: 'お題ガチャ',
      summary: '雑談配信やゲームのトーク中に使えるお題をランダムに出すツールです。カテゴリ絞り込みやカスタムお題の追加にも対応しています。',
      steps: [
        'カテゴリを選ぶ（または全カテゴリを選択）',
        '「お題を決める」ボタンを押す',
        'お題が表示される',
        '気に入らなければもう一度押して引き直す',
      ],
      tips: [
        'カスタムお題を設定パネルから追加できる（自分で考えたお題を登録可能）',
        '「カスタムのみ」モードに切り替えると自分のお題だけを使える',
        '複数カテゴリを組み合わせて幅広いお題をガチャれる',
        'お題の履歴が残るので、過去に出たお題を確認できる',
      ],
      usecases: [
        '雑談配信のネタ切れ防止・話題の転換',
        'ゲーム待機中・ロード中のトーク補助',
        '友達グループやチームでの話題作り',
        'ディベート練習の前のウォーミングアップ',
      ],
      related: ['/debate', '/roulette'],
    },
    {
      href: '/debate',
      tag: 'Debate',
      icon: IconScales,
      name: 'ディベート',
      summary: 'ディベートのお題と賛成・反対の陣営をランダムに決めて、タイマー付きで進行するツールです。カスタムお題や時間設定にも対応しています。',
      steps: [
        '「スタート」ボタンでお題と陣営（賛成/反対）をランダム決定する',
        '気に入らなければ再シャッフルする',
        '「タイマースタート」で制限時間をカウントダウン開始',
        '制限時間内にディベートを行う',
      ],
      tips: [
        'タイマーの時間は設定から変更できる（1〜60分）',
        'カスタムお題を追加して自分たちだけのお題でディベートできる',
        'お題・陣営ともに固定して任意のものを使うこともできる',
        '配信画面に映しながら進行すると視聴者も楽しめる',
      ],
      usecases: [
        '配信での視聴者参加型ディベート企画',
        '友達・チームでの意見のすり合わせや盛り上がり',
        'ゲームの戦略・選択のディスカッション',
        '学校・会社でのアイスブレイクや研修',
      ],
      related: ['/topic', '/roulette'],
    },
    {
      href: '/scoreboard',
      tag: 'Scoreboard',
      icon: IconTrophy,
      name: 'スコアボード',
      summary: 'チームの得点をリアルタイムに管理する得点版ツールです。2〜10チームに対応し、+/- ボタンやカスタム加減算、順位表示、並べ替え、アンドゥで配信中もスムーズに点数を動かせます。',
      steps: [
        'チーム数を選び、チーム名とテーマカラーを設定する',
        '加減算する点数を入れて「＋」「−」で得点を動かす（数字をダブルクリックで直接入力も可）',
        '必要に応じて「点数順に並べ替え」や「順位表示」を使う',
        '「記録」で途中経過を保存、「試合結果をコピー」でDiscord等に貼り付け',
      ],
      tips: [
        '得点はブラウザに自動保存され、再読み込みしても消えない',
        '操作を間違えても各チームの「1つ戻る」で1手ずつ戻せる',
        'デザインは7セグ風・ミニマル・カードの3種類から選べる',
        'チームごとにテーマカラーを変えると配信画面で見分けやすい',
      ],
      usecases: [
        '配信での視聴者参加型ゲームの得点管理',
        '対戦ゲームのチーム戦スコア表示',
        'クイズ大会・大喜利などイベントの採点',
        '複数ラウンドの合計点トラッキング',
      ],
      related: ['/team-division', '/roulette'],
    },
    {
      href: '/dice',
      tag: 'Dice',
      icon: IconDice,
      name: 'サイコロ',
      summary: '3D物理演算でリアルに転がるサイコロツールです。1〜10個・面数自由（d4〜d20）に加え、TRPGでよく使うダイスセットやd100判定にも対応。ダイスの色を変えられ、出目の履歴はDiscord向けのフォーマットでコピーできます。',
      steps: [
        'サイコロの数（1〜10個）と面数（d4/d6/d8/d10/d12/d20 など）を選ぶ',
        'または「TRPGモード」でよく使うダイスセットをプリセットから選ぶ',
        '「振る」ボタンを押すと3Dサイコロが物理演算で転がる',
        '止まると各出目と合計が強調表示され、履歴に残る',
      ],
      tips: [
        'ダイスの色はカラーピッカーで自由に変更でき、プリセットも用意',
        '色やモードの設定はブラウザに自動保存され、次回も復元される',
        'd100モードは1〜100のパーセンタイル判定として振れる',
        '履歴の「コピー」で「🎲 2d6 -> [3, 5] = 8」形式のテキストを取得（Discord等に貼り付け）',
      ],
      usecases: [
        'TRPG（クトゥルフ・D&D など）のオンラインセッション',
        'ボードゲーム配信でのダイス代わり',
        '罰ゲームや順番決めのランダム抽選',
        'すごろく・ゲーム企画の目的別ダイス',
      ],
      related: ['/roulette', '/scoreboard'],
    },
  ],
  en: [
    {
      href: '/team-division',
      tag: 'Team Division',
      icon: IconBolt,
      name: 'Team Division',
      summary: 'A tool that randomly splits members into evenly balanced teams. Freely configure team count, member count, and fixed assignments — all possible combinations are generated at once.',
      steps: [
        'Enter member names, one per line (e.g. Alice, Bob, Carol…)',
        'Choose the number of teams (2–8)',
        'Press "Show Results"',
        'Browse the generated patterns and copy your favorite to share',
      ],
      tips: [
        'Use the "Fix Members to Teams" feature to lock specific members to a given team',
        'Multiple patterns are generated — mark combinations as "played" to keep track',
        'Team names can be freely renamed (e.g. Red Team, Blue Team)',
        'The copy button saves all patterns as plain text to your clipboard',
      ],
      usecases: [
        'Viewer-participation team battles on stream (5v5, etc.)',
        'Gaming events and recreation at work or school',
        'Team splitting for meetups or camps',
        'Fair team reshuffling every session in online games',
      ],
      related: ['/amida', '/roulette'],
    },
    {
      href: '/roulette',
      tag: 'Roulette',
      icon: IconTarget,
      name: 'Roulette',
      summary: 'A random selection tool. Enter names or options and spin to pick one at random. Choose between the visually exciting Wheel mode and the fast Slot mode.',
      steps: [
        'Enter your options (e.g. names), one per line',
        'Choose Wheel or Slot mode',
        'Press Start to spin',
        'The selected result is displayed prominently',
      ],
      tips: [
        'Up to 20 entries can be added',
        'Wheel mode is visually exciting for streams; Slot mode is fast and simple',
        'Works great displayed live on stream',
        'A winners list lets you remove past winners before the next draw',
      ],
      usecases: [
        'Viewer comment giveaway draws and prize winner selection on stream',
        'Deciding forfeit or next-game content by spin',
        'Candy or prize winner selection',
        'Deciding anything at random',
      ],
      related: ['/team-division', '/amida'],
    },
    {
      href: '/amida',
      tag: 'Amida',
      icon: IconLadder,
      name: 'Amida (Ladder Lottery)',
      summary: 'Enter participants and results — the tool automatically generates a ladder lottery and assigns outcomes in real time. Perfect for fair random assignment with dramatic effect.',
      steps: [
        'Enter participant names (left column)',
        'Enter results — roles, prizes, forfeits, etc. (right column)',
        'Press "Create"',
        'The ladder lottery runs automatically and each participant\'s result is revealed in turn',
      ],
      tips: [
        'Participant count and result count are matched automatically',
        'Press Start again to re-draw with a new lottery',
        'Clean, easy-to-read design that looks great on stream',
        'Fewer results mean faster reveals when there are many participants',
      ],
      usecases: [
        'Assigning characters, positions, or roles in a game',
        'Deciding the order or lineup of a stream segment',
        'Assigning forfeits or prizes',
        'Seating arrangements or role assignments at events',
      ],
      related: ['/roulette', '/team-division'],
    },
    {
      href: '/topic',
      tag: 'Topic',
      icon: IconChat,
      name: 'Topic Picker',
      summary: 'Randomly picks a conversation topic for casual streams or in-game chat. Supports category filtering and custom topic entries.',
      steps: [
        'Select a category (or leave all selected)',
        'Press "Draw a topic"',
        'A topic appears',
        'Not feeling it? Press again to redraw',
      ],
      tips: [
        'Add your own topics in the Settings panel',
        'Switch to "Custom Only" mode to draw only from your own topics',
        'Mix multiple categories for a wider variety',
        'Topic history is saved so you can see what came up before',
      ],
      usecases: [
        'Preventing dead air or filling conversation gaps on casual streams',
        'Filling time while waiting in a game lobby',
        'Starting conversations in a friend group or team',
        'Warm-up topics before a debate practice',
      ],
      related: ['/debate', '/roulette'],
    },
    {
      href: '/debate',
      tag: 'Debate',
      icon: IconScales,
      name: 'Debate',
      summary: 'Randomly assigns a debate topic and factions (for/against), then runs a countdown timer. Supports custom topics and custom time limits.',
      steps: [
        'Press "Start" to randomly assign a topic and factions (For / Against)',
        'Re-shuffle if you want different options',
        'Press "Start Timer" to begin the countdown',
        'Debate within the time limit',
      ],
      tips: [
        'Timer duration can be changed in Settings (1–60 minutes)',
        'Add your own topics to debate with custom content',
        'You can also manually fix the topic and factions',
        'Showing it on stream lets viewers follow along and join in',
      ],
      usecases: [
        'Viewer-participation debate segments on stream',
        'Aligning opinions or sparking discussion within a friend group or team',
        'Strategy and decision discussions in a game',
        'Icebreakers or training sessions at school or work',
      ],
      related: ['/topic', '/roulette'],
    },
    {
      href: '/scoreboard',
      tag: 'Scoreboard',
      icon: IconTrophy,
      name: 'Scoreboard',
      summary: 'A live scoreboard for tracking team scores in real time. Supports 2–10 teams with +/- buttons, custom increments, rank display, sorting, and undo — keeping scoring smooth even during a live stream.',
      steps: [
        'Choose the number of teams, then set each team name and theme color',
        'Enter the amount to add or subtract, then tap "+" / "−" (double-click a number to type it directly)',
        'Use "Sort by score" and "Show rank" as needed',
        'Press "Record" to save a snapshot, or "Copy match result" to paste into Discord and more',
      ],
      tips: [
        'Scores are auto-saved in your browser and survive a page reload',
        "Made a mistake? Each team's \"Undo\" steps back one change at a time",
        'Pick from three designs: 7-segment, minimal, or card style',
        'Give each team its own color to tell them apart on stream',
      ],
      usecases: [
        'Scorekeeping for viewer-participation games on stream',
        'Team battle scoreboards for competitive games',
        'Judging quiz shows, comedy bits, and other events',
        'Tracking cumulative points across multiple rounds',
      ],
      related: ['/team-division', '/roulette'],
    },
    {
      href: '/dice',
      tag: 'Dice',
      icon: IconDice,
      name: 'Dice Roller',
      summary: 'A dice roller with realistic 3D physics. Roll 1–10 dice with any number of sides (d4–d20), or use TRPG dice sets and d100 rolls. Customize the dice color and copy roll history in a Discord-friendly format.',
      steps: [
        'Choose the number of dice (1–10) and the number of sides (d4/d6/d8/d10/d12/d20, etc.)',
        'Or switch to "TRPG mode" and pick a preset dice set',
        'Press "Roll" and the 3D dice tumble with real physics',
        'Once they settle, each face and the total are highlighted and saved to history',
      ],
      tips: [
        'Change the dice color freely with the color picker, or use a preset',
        'Your color and mode settings are auto-saved in the browser and restored next time',
        'd100 mode rolls a 1–100 percentile result',
        'Use "Copy" on any history entry to get text like "🎲 2d6 -> [3, 5] = 8" (paste into Discord and more)',
      ],
      usecases: [
        'Online TRPG sessions (Call of Cthulhu, D&D, and more)',
        'A stand-in for physical dice in board game streams',
        'Random draws for forfeits or turn order',
        'Purpose-built dice for tabletop and game segments',
      ],
      related: ['/roulette', '/scoreboard'],
    },
  ],
};

const TOOL_MAP: Record<string, { name: { ja: string; en: string } }> = {
  '/team-division': { name: { ja: 'チーム分け',   en: 'Team Division' } },
  '/roulette':      { name: { ja: 'ルーレット',   en: 'Roulette' } },
  '/amida':         { name: { ja: 'あみだくじ',   en: 'Amida' } },
  '/topic':         { name: { ja: 'お題ガチャ',   en: 'Topic Picker' } },
  '/debate':        { name: { ja: 'ディベート',   en: 'Debate' } },
  '/scoreboard':    { name: { ja: 'スコアボード', en: 'Scoreboard' } },
  '/dice':          { name: { ja: 'サイコロ',     en: 'Dice Roller' } },
};

const FAQ: Record<Locale, { q: string; a: string }[]> = {
  ja: [
    { q: 'CastKit は無料で使えますか？', a: 'はい、すべてのツールが完全無料・登録不要でご利用いただけます。ブラウザだけで今すぐ使えます。' },
    { q: 'スマートフォンでも使えますか？', a: 'はい、スマホ・タブレットのブラウザでもご利用いただけます。PC と同様にすべての機能が使えます。' },
    { q: 'データは保存されますか？', a: 'カスタムお題や言語設定など一部の設定はブラウザのローカルストレージに保存されます。サーバーへのデータ送信は行いません。' },
    { q: '配信に映して使えますか？', a: 'はい、配信画面にそのまま映して使うことを想定して設計されています。シンプルで見やすいデザインです。' },
    { q: 'ツールを複数同時に使えますか？', a: 'タブを複数開くことで同時に使えます。例：チーム分けで組み合わせを決めた後、ルーレットで順番を決めるといった使い方ができます。' },
  ],
  en: [
    { q: 'Is CastKit free to use?', a: 'Yes, all tools are completely free with no sign-up required. Open your browser and start right away.' },
    { q: 'Can I use it on mobile?', a: 'Yes, all tools work on smartphones and tablets. Every feature is available on mobile just like on desktop.' },
    { q: 'Is my data stored anywhere?', a: 'Some settings like custom topics and language preference are saved in your browser\'s local storage. No data is sent to any server.' },
    { q: 'Can I show it on stream?', a: 'Yes, the tools are designed to be displayed on a live stream. The clean layout is easy for viewers to read.' },
    { q: 'Can I use multiple tools at once?', a: 'Yes, you can open multiple browser tabs. For example: use Team Division to form groups, then Roulette to decide the order.' },
  ],
};

const UI: Record<Locale, {
  badge: string;
  title: string;
  intro: string;
  features: string[];
  tocLabel: string;
  stepsLabel: string;
  usecasesLabel: string;
  tipsLabel: string;
  relatedLabel: string;
  openLabel: (name: string) => string;
  faqTitle: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
}> = {
  ja: {
    badge: 'GUIDE',
    title: '使い方ガイド',
    intro: 'CastKit は配信・ゲームイベントを盛り上げるための無料ツール集です。登録不要、ブラウザだけで今すぐ使えます。',
    features: ['完全無料・登録不要', 'スマホ・PC どちらでも動作', '配信画面に映してそのまま使える', 'カスタマイズ対応'],
    tocLabel: '目次',
    stepsLabel: '使い方',
    usecasesLabel: '活用シーン',
    tipsLabel: 'ポイント',
    relatedLabel: '一緒に使えるツール',
    openLabel: (name) => `${name}を使う →`,
    faqTitle: 'よくある質問',
    ctaTitle: 'すべて無料・登録不要',
    ctaDesc: 'ブラウザだけで今すぐ使えます',
    ctaButton: 'ツール一覧へ →',
  },
  en: {
    badge: 'GUIDE',
    title: 'How to Use',
    intro: 'CastKit is a free collection of tools for streaming and gaming events. No sign-up required — open in your browser and start right away.',
    features: ['Completely free, no sign-up', 'Works on smartphone and PC', 'Display live on stream', 'Customizable'],
    tocLabel: 'Contents',
    stepsLabel: 'How to use',
    usecasesLabel: 'Use cases',
    tipsLabel: 'Tips',
    relatedLabel: 'Pair with',
    openLabel: (name) => `Open ${name} →`,
    faqTitle: 'FAQ',
    ctaTitle: 'Free and No Sign-up Required',
    ctaDesc: 'Open in your browser and start right away',
    ctaButton: 'View all tools →',
  },
};

export default function GuidePage() {
  const { locale } = useTranslation();
  const tools = TOOLS[locale];
  const ui = UI[locale];
  const faq = FAQ[locale];

  return (
    <div className="max-w-3xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-10 pt-4">
        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1 text-xs font-bold"
          style={{ background: 'rgba(var(--ck-ink-rgb),0.06)', border: '1px solid rgba(var(--ck-ink-rgb),0.15)', color: 'var(--ck-gray-600)' }}
        >
          {ui.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ck-ink mb-3">{ui.title}</h1>
        <p className="text-sm text-ck-subtle leading-relaxed mb-5">{ui.intro}</p>

        {/* フィーチャーバッジ */}
        <div className="flex flex-wrap gap-2">
          {ui.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold"
              style={{ background: 'var(--ck-bg-card-muted)', border: '1px solid var(--ck-border)', color: 'var(--ck-gray-600)' }}
            >
              <span aria-hidden="true">✓</span> {f}
            </span>
          ))}
        </div>
      </div>

      {/* 目次 */}
      <nav className="mb-12 p-5" style={{ border: '1px solid var(--ck-border)', background: 'var(--ck-bg-card)' }} aria-label={ui.tocLabel}>
        <p className="text-xs font-bold text-ck-subtle mb-3 tracking-widest uppercase">{ui.tocLabel}</p>
        <ol className="flex flex-col gap-2">
          {tools.map((tool, i) => (
            <li key={tool.href}>
              <a
                href={`#${tool.tag.toLowerCase()}`}
                className="text-sm font-bold text-ck-ink hover:text-ck-body transition-colors"
              >
                {i + 1}. {tool.name}
              </a>
            </li>
          ))}
          <li>
            <a href="#faq" className="text-sm font-bold text-ck-ink hover:text-ck-body transition-colors">
              {tools.length + 1}. {ui.faqTitle}
            </a>
          </li>
        </ol>
      </nav>

      {/* 各ツールセクション */}
      <div className="flex flex-col gap-16">
        {tools.map((tool, i) => (
          <section key={tool.href} id={tool.tag.toLowerCase()}>
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '2px solid var(--ck-text-primary)' }}>
              <span className="text-xs font-black text-ck-muted tracking-widest shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <tool.icon size={20} aria-hidden="true" strokeWidth={1.8} />
              <h2 className="text-2xl font-black text-ck-ink">{tool.name}</h2>
              <span className="text-xs font-bold text-ck-muted tracking-widest uppercase hidden sm:inline">{tool.tag}</span>
            </div>

            <p className="text-sm text-ck-body leading-relaxed mb-6">{tool.summary}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4" style={{ border: '1px solid var(--ck-border)', background: 'var(--ck-bg)' }}>
                <p className="text-xs font-black tracking-widest text-ck-ink mb-3 uppercase">{ui.stepsLabel}</p>
                <ol className="flex flex-col gap-2">
                  {tool.steps.map((step, si) => (
                    <li key={si} className="flex gap-2 text-xs text-ck-body leading-relaxed">
                      <span className="font-black text-ck-muted shrink-0 tabular-nums">{si + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4" style={{ border: '1px solid var(--ck-border)', background: 'var(--ck-bg)' }}>
                <p className="text-xs font-black tracking-widest text-ck-ink mb-3 uppercase">{ui.usecasesLabel}</p>
                <ul className="flex flex-col gap-2">
                  {tool.usecases.map((uc, j) => (
                    <li key={j} className="flex gap-2 text-xs text-ck-body leading-relaxed">
                      <span className="text-ck-muted shrink-0">—</span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 mb-5" style={{ background: 'rgba(var(--ck-ink-rgb),0.03)', border: '1px solid rgba(var(--ck-ink-rgb),0.08)' }}>
              <p className="text-xs font-black tracking-widest text-ck-ink mb-2 uppercase">{ui.tipsLabel}</p>
              <ul className="flex flex-col gap-1.5">
                {tool.tips.map((tip, ti) => (
                  <li key={ti} className="text-xs text-ck-body leading-relaxed flex gap-2">
                    <span className="text-ck-muted shrink-0" aria-hidden="true">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* アクション + 関連ツール */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                href={tool.href}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-white transition-opacity hover:opacity-80"
                style={{ background: 'var(--ck-text-primary)' }}
              >
                {ui.openLabel(tool.name)}
              </Link>

              {tool.related.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-ck-muted">{ui.relatedLabel}:</span>
                  {tool.related.map((href) => {
                    const info = TOOL_MAP[href];
                    return (
                      <Link
                        key={href}
                        href={href}
                        className="text-xs font-bold px-2 py-1 transition-colors hover:text-ck-ink"
                        style={{ border: '1px solid var(--ck-border)', color: 'var(--ck-gray-600)', background: 'var(--ck-bg-card)' }}
                      >
                        {info.name[locale]}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* FAQ */}
        <section id="faq">
          <div className="flex items-baseline gap-3 mb-6 pb-3" style={{ borderBottom: '2px solid var(--ck-text-primary)' }}>
            <span className="text-xs font-black text-ck-muted tracking-widest">{String(tools.length + 1).padStart(2, '0')}</span>
            <h2 className="text-2xl font-black text-ck-ink">{ui.faqTitle}</h2>
          </div>
          <dl className="flex flex-col gap-5">
            {faq.map((item, i) => (
              <div key={i} className="p-4" style={{ border: '1px solid var(--ck-border)', background: 'var(--ck-bg)' }}>
                <dt className="text-sm font-black text-ck-ink mb-2 flex gap-2">
                  <span className="text-ck-muted shrink-0 font-black">Q.</span>
                  {item.q}
                </dt>
                <dd className="text-xs text-ck-body leading-relaxed flex gap-2">
                  <span className="text-ck-muted shrink-0 font-black">A.</span>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* フッターCTA */}
      <div className="mt-16 mb-8 p-8 text-center" style={{ border: '1px solid var(--ck-border)', background: 'var(--ck-bg-card)' }}>
        <p className="text-lg font-black text-ck-ink mb-2">{ui.ctaTitle}</p>
        <p className="text-xs text-ck-subtle mb-4">{ui.ctaDesc}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black text-white transition-opacity hover:opacity-80"
          style={{ background: 'var(--ck-text-primary)' }}
        >
          {ui.ctaButton}
        </Link>
      </div>
    </div>
  );
}
