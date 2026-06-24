export interface DebateTopic {
  id: string;
  theme: { ja: string; en: string };
  factionA: { ja: string; en: string };
  factionB: { ja: string; en: string };
}

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 'superpower',
    theme:    { ja: '超能力が手に入るなら', en: 'If you could have a superpower' },
    factionA: { ja: '瞬間移動',             en: 'Teleportation' },
    factionB: { ja: '透明人間',             en: 'Invisibility' },
  },
  {
    id: 'friendship',
    theme:    { ja: '男女の友情は',   en: 'Friendship between men and women' },
    factionA: { ja: '成立する',       en: 'It exists' },
    factionB: { ja: '成立しない',     en: "It doesn't exist" },
  },
  {
    id: 'city-vs-nature',
    theme:    { ja: '住むならどっち',               en: 'Where would you rather live' },
    factionA: { ja: '便利な都会',                   en: 'Convenient city' },
    factionB: { ja: '自然豊かな田舎',               en: 'Peaceful countryside' },
  },
  {
    id: 'pet',
    theme:    { ja: 'ペットにするなら', en: 'If you were to get a pet' },
    factionA: { ja: '犬',              en: 'Dog' },
    factionB: { ja: '猫',              en: 'Cat' },
  },
  {
    id: 'season',
    theme:    { ja: '好きな季節は', en: 'Favorite season' },
    factionA: { ja: '夏',          en: 'Summer' },
    factionB: { ja: '冬',          en: 'Winter' },
  },
  {
    id: 'chronotype',
    theme:    { ja: 'どちらの人間タイプ？', en: 'Which type of person are you' },
    factionA: { ja: '朝型人間',              en: 'Morning person' },
    factionB: { ja: '夜型人間',              en: 'Night owl' },
  },
  {
    id: 'travel',
    theme:    { ja: '旅行スタイルは',             en: 'Travel style' },
    factionA: { ja: 'しっかり計画を立てる',       en: 'Plan everything in advance' },
    factionB: { ja: '行き当たりばったり',         en: 'Go with the flow' },
  },
  {
    id: 'book',
    theme:    { ja: '本を読むなら',  en: 'Reading preference' },
    factionA: { ja: '紙の本',        en: 'Physical book' },
    factionB: { ja: '電子書籍',      en: 'E-book' },
  },
  {
    id: 'sns',
    theme:    { ja: 'SNSは現代社会に', en: 'Social media in modern society' },
    factionA: { ja: '必要',            en: 'Necessary' },
    factionB: { ja: '不要',            en: 'Unnecessary' },
  },
  {
    id: 'ai',
    theme:    { ja: 'AIは人類にとって', en: 'AI is for humanity' },
    factionA: { ja: '救世主',           en: 'A savior' },
    factionB: { ja: '脅威',             en: 'A threat' },
  },
  {
    id: 'game',
    theme:    { ja: 'ゲームは',          en: 'Video games are' },
    factionA: { ja: '人生を豊かにする',  en: 'Good for life' },
    factionB: { ja: '時間の無駄',        en: 'A waste of time' },
  },
  {
    id: 'lottery',
    theme:    { ja: '宝くじが当たったら', en: 'If you won the lottery' },
    factionA: { ja: '全部使う',           en: 'Spend it all' },
    factionB: { ja: '全部貯金する',       en: 'Save it all' },
  },
  {
    id: 'timemachine',
    theme:    { ja: 'タイムマシンがあったら', en: 'If you had a time machine' },
    factionA: { ja: '過去に戻る',             en: 'Go back to the past' },
    factionB: { ja: '未来に行く',             en: 'Travel to the future' },
  },
  {
    id: 'work-style',
    theme:    { ja: '仕事をするなら',   en: 'Work style preference' },
    factionA: { ja: 'リモートワーク',   en: 'Remote work' },
    factionB: { ja: 'オフィス出社',     en: 'In-office work' },
  },
  {
    id: 'movie',
    theme:    { ja: '映画を見るなら', en: 'Watching a movie' },
    factionA: { ja: '映画館で見る',   en: 'At the cinema' },
    factionB: { ja: '自宅で見る',     en: 'At home' },
  },
  {
    id: 'memory',
    theme:    { ja: '欲しい能力はどっち？',   en: 'Which ability would you rather have' },
    factionA: { ja: '完璧な記憶力',            en: 'Perfect memory' },
    factionB: { ja: '完璧な判断力',            en: 'Perfect judgment' },
  },
  {
    id: 'uniform',
    theme:    { ja: '学校の制服は',  en: 'School uniforms should' },
    factionA: { ja: 'あるべき',      en: 'Be required' },
    factionB: { ja: 'なくすべき',    en: 'Be abolished' },
  },
  {
    id: 'confession',
    theme:    { ja: '好きな人への告白は',  en: 'Confessing your feelings' },
    factionA: { ja: '自分からするべき',    en: 'You should confess first' },
    factionB: { ja: '相手がするべき',      en: 'Wait for the other person' },
  },
  {
    id: 'morning-routine',
    theme:    { ja: '朝ごはんは',    en: 'Breakfast' },
    factionA: { ja: '食べるべき',    en: 'Should be eaten' },
    factionB: { ja: '食べなくてもいい', en: 'Not necessary' },
  },
  {
    id: 'genius',
    theme:    { ja: '天才と努力家、なるなら', en: 'Would you rather be' },
    factionA: { ja: '才能あふれる天才',        en: 'A natural genius' },
    factionB: { ja: '努力の達人',              en: 'A hard worker who surpasses talent' },
  },
];
