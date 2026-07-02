// ─────────────────────────────────────────────────────────────
// チンチロリン判定エンジン（3つのサイコロ 1〜6）
//
// 役と倍率／強さスコアはルール定義に従う。強さスコアは勝敗比較用の
// 単調な整数で、値が大きいほど強い（ピンゾロが最強）。
//
// 強さ（弱い→強い）：ヒフミ ＜ 目なし ＜ ○の目(1→6) ＜ シゴロ ＜ ゾロ目 ＜ ピンゾロ
//   ヒフミ   : 倍率-2 / 強さ0   （最弱・2倍払い）
//   目なし   : 倍率0  / 強さ1   （勝敗なし・倍率表記なし）
//   通常役   : 倍率1  / 強さ=1+目  （倍率は同額固定。目1〜6は強さ＝順位だけを決める）
//   シゴロ   : 倍率2  / 強さ10
//   ゾロ目   : 倍率3  / 強さ20+ゾロの数 （222→22 … 666→26）
//   ピンゾロ : 倍率3  / 強さ30  （111・最強）
// ─────────────────────────────────────────────────────────────

export type ChinchiroRole =
  | 'pinzoro'  // 111
  | 'zorome'   // 222〜666
  | 'shigoro'  // 4-5-6
  | 'normal'   // 2つ同じ＋残り1つが「目」
  | 'hifumi'   // 1-2-3
  | 'menashi'; // 役なし

export interface ChinchiroResult {
  /** 役の種別キー（表示は i18n 側で解決） */
  role: ChinchiroRole;
  /** 役名（日本語のデフォルト表示名） */
  name: string;
  /** 倍率 */
  multiplier: number;
  /** 強さスコア（勝敗比較用。大きいほど強い） */
  strength: number;
  /** 通常役の「目」／ゾロ目・ピンゾロの数字（表示用）。役に数字が無ければ null */
  value: number | null;
  /** 敗北扱いか（ヒフミ・目なし） */
  isLoss: boolean;
}

/** ゾロ目の強さの底上げ（222→22 … 666→26）。 */
const ZOROME_STRENGTH_BASE = 20;
/** ピンゾロの強さ（どのゾロ目より強い最強値）。 */
const PINZORO_STRENGTH = 30;
/** シゴロの強さ（通常役の最大 目6=7 より強く、ゾロ目より弱い）。 */
const SHIGORO_STRENGTH = 10;

/**
 * 3つのサイコロの出目からチンチロリンの役を判定する。
 * @param dice 長さ3の配列（各 1〜6）。順不同で可。
 */
export function judgeChinchiro(dice: readonly number[]): ChinchiroResult {
  if (dice.length !== 3) {
    throw new Error(`judgeChinchiro expects exactly 3 dice, got ${dice.length}`);
  }
  // 昇順に並べて判定を簡単にする。
  const [a, b, c] = [...dice].sort((x, y) => x - y);

  // ゾロ目（3つ同じ）。1のゾロ目＝ピンゾロは最強として別扱い。
  if (a === b && b === c) {
    if (a === 1) {
      return { role: 'pinzoro', name: 'ピンゾロ', multiplier: 3, strength: PINZORO_STRENGTH, value: 1, isLoss: false };
    }
    return { role: 'zorome', name: 'ゾロ目', multiplier: 3, strength: ZOROME_STRENGTH_BASE + a, value: a, isLoss: false };
  }

  // シゴロ（4-5-6）
  if (a === 4 && b === 5 && c === 6) {
    return { role: 'shigoro', name: 'シゴロ', multiplier: 2, strength: SHIGORO_STRENGTH, value: null, isLoss: false };
  }

  // ヒフミ（1-2-3）＝最弱の敗北役（2倍払い）
  if (a === 1 && b === 2 && c === 3) {
    return { role: 'hifumi', name: 'ヒフミ', multiplier: -2, strength: 0, value: null, isLoss: true };
  }

  // 通常役：2つ同じ＋残り1つが「目」。昇順なので、対にならない側が「目」。
  let pip: number | null = null;
  if (a === b) pip = c;          // 例: [3,3,5] → 目=5
  else if (b === c) pip = a;     // 例: [2,5,5] → 目=2
  if (pip !== null) {
    // 通常役の倍率は 1（同額）。目の数は強さ（順位）だけを決める。
    return { role: 'normal', name: `${pip}の目`, multiplier: 1, strength: 1 + pip, value: pip, isLoss: false };
  }

  // どれにも当てはまらない＝目なし（ヒフミより上・倍率なし）
  return { role: 'menashi', name: '目なし', multiplier: 0, strength: 1, value: null, isLoss: true };
}

// ─────────────────────────────────────────────────────────────
// ターン管理（1ターン最大3投、目なしなら振り直し）
//
// 使い方（ステート設計案）:
//   const [turn, setTurn] = useState(initialChinchiroTurn());
//   // 出目が確定したら:
//   setTurn((prev) => applyChinchiroRoll(prev, dice));
//   // 「振れる」判定:  canRollChinchiro(turn)
//   // 次のターンへ:    振り直し不要になった（decided）ら initialChinchiroTurn() に戻す
// ─────────────────────────────────────────────────────────────

export const CHINCHIRO_MAX_ROLLS = 3;

export interface ChinchiroTurn {
  /** このターンで投げた回数（0〜3） */
  rollsUsed: number;
  /** 直近の出目（未投なら null） */
  dice: number[] | null;
  /** 直近の判定結果（未投なら null） */
  result: ChinchiroResult | null;
  /**
   * このターンが確定したか。
   * 役が成立（目なし以外）した、または3投を使い切ったら true。
   * false のうちは目なしで振り直し可能。
   */
  decided: boolean;
}

export function initialChinchiroTurn(): ChinchiroTurn {
  return { rollsUsed: 0, dice: null, result: null, decided: false };
}

/** このターンでまだ振れるか（未確定かつ投数が残っている）。 */
export function canRollChinchiro(turn: ChinchiroTurn): boolean {
  return !turn.decided && turn.rollsUsed < CHINCHIRO_MAX_ROLLS;
}

/**
 * 出目が確定したときにターン状態を進める純関数。
 * - 目なし かつ 投数が残っていれば「未確定（振り直せる）」
 * - 役が成立、または3投目なら「確定」
 */
export function applyChinchiroRoll(turn: ChinchiroTurn, dice: number[]): ChinchiroTurn {
  const result = judgeChinchiro(dice);
  const rollsUsed = turn.rollsUsed + 1;
  const decided = result.role !== 'menashi' || rollsUsed >= CHINCHIRO_MAX_ROLLS;
  return { rollsUsed, dice, result, decided };
}
