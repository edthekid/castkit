/**
 * ツール共通メタデータの単一ソース。
 * 各ツールページに散らばっていた SNS シェア文言をここに集約し、
 * ToolFooter が現在のパスに応じて取り出して使う。
 */

export interface ToolShare {
  /** ツールのパス（例: /team-division） */
  href: string;
  /** X(Twitter) 投稿用テキスト */
  shareText: { ja: string; en: string };
}

export const TOOL_SHARE: ToolShare[] = [
  {
    href: '/team-division',
    shareText: {
      ja: '⚡ 無料のチーム分けツール「CastKit」メンバーを均等チームに自動振り分け #CastKit',
      en: '⚡ Free team balancer — auto-split members into fair teams #CastKit',
    },
  },
  {
    href: '/roulette',
    shareText: {
      ja: '🎰 無料のルーレット抽選ツール「CastKit」配信・ゲームイベントで使えます #CastKit',
      en: '🎰 Free roulette and random picker tool — perfect for streams and gaming events #CastKit',
    },
  },
  {
    href: '/amida',
    shareText: {
      ja: '🪜 無料のあみだくじツール「CastKit」参加者と結果を入力するだけで自動生成 #CastKit',
      en: '🪜 Free ladder lottery (Amida) tool — auto-generates results instantly #CastKit',
    },
  },
  {
    href: '/topic',
    shareText: {
      ja: '💬 雑談お題を自動生成「CastKit お題ガチャ」配信・ゲーム待機中に使えます #CastKit',
      en: '💬 Free random topic picker for streams and gaming — CastKit Topic Picker #CastKit',
    },
  },
  {
    href: '/debate',
    shareText: {
      ja: '⚖️ お題と陣営をランダム決定「CastKit ディベート」配信・グループゲームで使えます #CastKit',
      en: '⚖️ Random debate topic and faction picker with timer — CastKit Debate #CastKit',
    },
  },
  {
    href: '/scoreboard',
    shareText: {
      ja: '🏆 チームの得点をリアルタイム管理「CastKit スコアボード」配信・ゲームイベントで使えます #CastKit',
      en: '🏆 Live team scoreboard for streams and gaming events — CastKit Scoreboard #CastKit',
    },
  },
];

/** パスから対応するシェア文言を取得 */
export const getToolShare = (href: string): ToolShare | undefined =>
  TOOL_SHARE.find((t) => t.href === href);
