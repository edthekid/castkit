import type { Team } from './_constants';

/** 順位に応じたメダル絵文字（コピー用テキストのみ。画面の色はトークンを使う）。 */
function medal(rank: number): string {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return `${rank + 1}.`;
}

/**
 * 名前と得点の配列から、Discord 等に貼り付けやすいプレーンテキストを生成する。
 * 得点の高い順に並べ、メダル/順位を付ける。
 */
export function formatScores(rows: { name: string; score: number }[], heading: string): string {
  const ranked = [...rows].sort((a, b) => b.score - a.score);
  const lines = ranked.map((r, rank) => `${medal(rank)} ${r.name}: ${r.score}`);
  return [heading, ...lines].join('\n');
}

/** 現在のチーム配列からコピー用テキストを生成する。 */
export function buildCopyText(
  teams: Team[],
  resolveName: (team: Team) => string,
  heading: string,
): string {
  return formatScores(teams.map((team) => ({ name: resolveName(team), score: team.score })), heading);
}
