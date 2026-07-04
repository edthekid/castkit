// タイマーツールの定数・型。
// 4モード（カウントダウン／ストップウォッチ／指定時刻まで／ポモドーロ）を
// タブで切り替える。全モードともブラウザ内で完結し、経過時間は Date.now()
// 基準の実時刻で算出する（setInterval のドリフト・タブ非アクティブ時の
// スロットリングに影響されないため）。

export type TimerTab = 'countdown' | 'stopwatch' | 'until' | 'pomodoro';

export const TIMER_TABS: readonly TimerTab[] = ['countdown', 'stopwatch', 'until', 'pomodoro'];

/** 開始/一時停止/リセットで遷移する共通ステータス。 */
export type RunStatus = 'idle' | 'running' | 'paused' | 'done';

// ─── カウントダウン ─────────────────────────────────────
/** よく使うプリセット（ミリ秒）。ラベルは i18n キーで解決する。 */
export const COUNTDOWN_PRESETS: readonly { labelKey: string; ms: number }[] = [
  { labelKey: 'timer.preset.1m',  ms: 1 * 60_000 },
  { labelKey: 'timer.preset.3m',  ms: 3 * 60_000 },
  { labelKey: 'timer.preset.5m',  ms: 5 * 60_000 },
  { labelKey: 'timer.preset.10m', ms: 10 * 60_000 },
  { labelKey: 'timer.preset.break', ms: 15 * 60_000 },
];

export const COUNTDOWN_MAX_MS = 99 * 3600_000 + 59 * 60_000 + 59_000; // 99:59:59

// ─── ストップウォッチ ───────────────────────────────────
export interface Lap {
  /** ラップ番号（1始まり） */
  index: number;
  /** そのラップの所要時間（ms） */
  split: number;
  /** 開始からの累計（ms） */
  total: number;
}

export const MAX_LAPS = 100;

// ─── ポモドーロ ─────────────────────────────────────────
export type PomodoroPhase = 'work' | 'break' | 'longBreak';

export interface PomodoroConfig {
  /** 作業（分） */
  workMin: number;
  /** 短い休憩（分） */
  breakMin: number;
  /** 長い休憩（分） */
  longBreakMin: number;
  /** 何回の作業ごとに長い休憩を入れるか */
  longBreakEvery: number;
}

export const DEFAULT_POMODORO: PomodoroConfig = {
  workMin: 25,
  breakMin: 5,
  longBreakMin: 15,
  longBreakEvery: 4,
};

export const POMODORO_MIN = 1;
export const POMODORO_MAX = 90;
export const POMODORO_EVERY_MIN = 2;
export const POMODORO_EVERY_MAX = 12;

// ─── 通知音の音量 ───────────────────────────────────────
/** 通知音オン時の既定音量（0〜1）。控えめな既定にしている。 */
export const DEFAULT_VOLUME = 0.6;
/** 音量1.0のときのビープのピークゲイン（クリップを避けるため 0.4 に抑える）。 */
export const MAX_BEEP_GAIN = 0.4;

// ─── localStorage キー ──────────────────────────────────
export const STORAGE_TAB      = 'castkit.timer.tab.v1';
export const STORAGE_MUTED    = 'castkit.timer.muted.v1';
export const STORAGE_VOLUME   = 'castkit.timer.volume.v1';
export const STORAGE_COUNTDOWN = 'castkit.timer.countdown.v1';
export const STORAGE_POMODORO = 'castkit.timer.pomodoro.v1';

/** アラームの点滅を継続する時間（ms）。 */
export const FLASH_DURATION_MS = 8000;
