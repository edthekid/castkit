import { MAX_RESULTS, TEAM_COLORS } from './_constants';

/**
 * 全組み合わせを生成する（最大MAX_RESULTS件）。
 *
 * 生成方針:
 * ランダムシャッフルにより、固定メンバーを除いた残りのメンバーを
 * チームサイズ通りに割り振る試行を繰り返す。
 *
 * 重複判定について:
 * 「個々のチーム構成（メンバーの組み合わせ）」がパターンをまたいで
 * 一度でも登場したら、そのチーム構成は再び使わない。
 * 例えば、あるパターンで「葛葉・叶」という2人チームが生成されたら、
 * 以降の採用パターンでは「葛葉・叶」という組み合わせのチームは
 * （他の誰かと組み替わらない限り）二度と登場しない。
 *
 * 生成したパターンの中に、過去に登場済みのチーム構成が1つでも
 * 含まれていた場合は、そのパターン全体を不採用にして再試行する
 * （パターン全体の完全一致だけでなく、構成要素であるチーム単位でも
 * 重複を禁止することで、より多様な組み合わせを保証する）。
 *
 * メンバーが分散するよう、シャッフルの試行回数を多めに確保し、
 * 規定回数試行しても新しいパターンが見つからなくなった時点で打ち切る。
 */
export function generateAllCombinations(
  members: string[],
  teamCount: number,
  fixedMap: Record<string, number>,
): string[][][] {
  const baseSize   = Math.floor(members.length / teamCount);
  const extraSpecs = members.length % teamCount;
  const teamSizes  = Array.from({ length: teamCount }, (_, i) =>
    baseSize + (i < extraSpecs ? 1 : 0),
  ).sort((a, b) => b - a);

  // 固定メンバーと自由枠メンバーに分ける
  const fixedMembers = members.filter((m) => m in fixedMap);
  const freeMembers  = members.filter((m) => !(m in fixedMap));

  /** Fisher-Yatesシャッフル */
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /** 1回分のランダムなチーム分けを生成する */
  const buildOneCombination = (): string[][] => {
    const teams: string[][] = Array.from({ length: teamCount }, () => []);

    // 固定メンバーを先に配置
    fixedMembers.forEach((m) => {
      teams[fixedMap[m]].push(m);
    });

    // 残りの空き枠をシャッフルして自由枠メンバーを割り振る
    const slots: number[] = [];
    teams.forEach((team, idx) => {
      const remaining = teamSizes[idx] - team.length;
      for (let k = 0; k < remaining; k++) slots.push(idx);
    });
    const shuffledSlots = shuffle(slots);
    const shuffledFree  = shuffle(freeMembers);

    shuffledFree.forEach((member, i) => {
      teams[shuffledSlots[i]].push(member);
    });

    return teams.map((t) => [...t].sort());
  };

  /** チーム1つ分の構成を一意なキーに変換する（メンバー集合のみで判定、チーム番号は無視） */
  const teamKeyOf = (team: string[]): string => team.join(',');

  const results: string[][][] = [];
  // パターンをまたいで「過去に登場した個々のチーム構成」を記録する
  const usedTeamKeys = new Set<string>();

  // 試行回数の上限。MAX_RESULTSに対して十分な余裕を持たせつつ、
  // 無限ループを避けるため上限を設ける。
  // チーム単位の判定は条件が厳しくなりやすいため、パターン全体一致のみの
  // 判定時より試行回数を増やしておく。
  const MAX_ATTEMPTS = Math.max(MAX_RESULTS * 60, 1000);
  // 「これ以上新しいパターンが見つからなさそう」と判断するための、
  // 連続して不採用が続いた場合の打ち切り閾値。
  const STALE_LIMIT = Math.max(MAX_RESULTS * 10, 200);

  let attempts = 0;
  let staleStreak = 0;

  while (
    results.length < MAX_RESULTS &&
    attempts < MAX_ATTEMPTS &&
    staleStreak < STALE_LIMIT
  ) {
    attempts++;
    const teams = buildOneCombination();
    const teamKeys = teams.map(teamKeyOf);

    // このパターンに含まれるチームのうち、1つでも既出のものがあれば不採用
    const hasUsedTeam = teamKeys.some((k) => usedTeamKeys.has(k));
    if (hasUsedTeam) {
      staleStreak++;
      continue;
    }

    teamKeys.forEach((k) => usedTeamKeys.add(k));
    results.push(teams);
    staleStreak = 0;
  }

  return results;
}

/**
 * チームサイズ配列を返す（大きい順）
 */
export function calcTeamSizes(memberCount: number, teamCount: number): number[] {
  const base  = Math.floor(memberCount / teamCount);
  const extra = memberCount % teamCount;
  return Array.from({ length: teamCount }, (_, i) =>
    base + (i < extra ? 1 : 0),
  ).sort((a, b) => b - a);
}

/** チームアクセントカラー(HEX)を返す */
export function getTeamColor(teamIdx: number): string {
  return TEAM_COLORS[teamIdx % TEAM_COLORS.length];
}

/** チームメンバーをソート（固定メンバー優先 → 五十音順） */
export function sortTeamMembers(
  members: string[],
  teamIndex: number,
  fixedMembers: Record<string, number>,
): string[] {
  return [...members].sort((a, b) => {
    const aFixed = fixedMembers[a] === teamIndex;
    const bFixed = fixedMembers[b] === teamIndex;
    if (aFixed && !bFixed) return -1;
    if (!aFixed && bFixed) return 1;
    return a.localeCompare(b, 'ja');
  });
}

/**
 * クリップボード用テキスト生成。
 * headerFormat には "{pattern}" "{team}" を含む見出しフォーマットを渡す。
 * 例: '【{pattern}：{team}】' / '[{pattern}: {team}]'
 */
export function buildCopyText(
  patternName: string,
  teams: string[][],
  getTeamName: (i: number) => string,
  fixedMembers: Record<string, number>,
  headerFormat: string,
): string {
  return teams
    .map((teamMembers, teamIndex) => {
      const sorted = sortTeamMembers(teamMembers, teamIndex, fixedMembers);
      const header = headerFormat
        .replace('{pattern}', patternName)
        .replace('{team}', getTeamName(teamIndex));
      return `${header}\n${sorted.join('\n')}`;
    })
    .join('\n\n');
}
