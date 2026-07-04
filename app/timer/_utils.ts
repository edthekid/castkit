// タイマーの時間フォーマットと通知音（Web Audio 合成）。
// 通知音は音声ファイルを持たず OscillatorNode で合成する（バックエンド無し・
// 依存最小・プライバシー安全の方針に沿う）。

import { DEFAULT_VOLUME, MAX_BEEP_GAIN } from './_constants';

/** ms を { h, m, s, cs } に分解（cs = 1/100秒）。負値は 0 に丸める。 */
export function breakdown(ms: number) {
  const clamped = Math.max(0, ms);
  const totalCs = Math.floor(clamped / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);
  return { h, m, s, cs };
}

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

/**
 * ms を時計表記へ。時が 0 なら MM:SS、それ以外は H:MM:SS。
 * 配信の待機表示でも読みやすいよう、分・秒は常に2桁で揃える。
 */
export function formatClock(ms: number): string {
  const { h, m, s } = breakdown(ms);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** ストップウォッチ用（MM:SS.cs、時があれば H:MM:SS.cs）。 */
export function formatStopwatch(ms: number): string {
  const { h, m, s, cs } = breakdown(ms);
  return h > 0
    ? `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`
    : `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

// ─── 通知音（Web Audio で合成） ─────────────────────────
type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext };

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    const Ctor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext;
    if (!Ctor) return null;
    sharedCtx = new Ctor();
  }
  return sharedCtx;
}

/**
 * 短いビープを times 回鳴らす。ユーザー操作（開始ボタン等）を起点に
 * 生成された AudioContext を再利用する。muted 判定は呼び出し側で行う。
 * volume（0〜1）でピークゲインをスケールする。
 */
export function playBeep(times = 3, volume = DEFAULT_VOLUME): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const peak = Math.max(0.0001, Math.min(1, volume) * MAX_BEEP_GAIN);
  const start = ctx.currentTime;
  const gap = 0.3;
  for (let i = 0; i < times; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    const t = start + i * gap;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }
}

/**
 * AudioContext を「解錠」する（初回のユーザー操作時に呼ぶ）。
 * これによりモバイル等の自動再生制限下でも後続のビープが鳴る。
 */
export function primeAudio(): void {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}
