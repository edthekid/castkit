'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  type PomodoroPhase,
  type PomodoroConfig,
  type RunStatus,
  DEFAULT_POMODORO,
  POMODORO_MIN,
  POMODORO_MAX,
  POMODORO_EVERY_MIN,
  POMODORO_EVERY_MAX,
  STORAGE_POMODORO,
} from '../_constants';
import { primeAudio } from '../_utils';

const TICK_MS = 200;
const clampMin   = (n: number) => Math.max(POMODORO_MIN, Math.min(POMODORO_MAX, Math.floor(n) || POMODORO_MIN));
const clampEvery = (n: number) => Math.max(POMODORO_EVERY_MIN, Math.min(POMODORO_EVERY_MAX, Math.floor(n) || POMODORO_EVERY_MIN));

/**
 * ポモドーロ（作業/休憩ループ）。作業を longBreakEvery 回終えるごとに長い休憩。
 * フェーズ切替時に onSwitch を呼ぶ（通知音・点滅のトリガ）。設定は localStorage 保持。
 */
export function usePomodoro(onSwitch: (phase: PomodoroPhase) => void) {
  const [config, setConfig]   = useState<PomodoroConfig>(DEFAULT_POMODORO);
  const [status, setStatus]   = useState<RunStatus>('idle');
  const [phase, setPhase]     = useState<PomodoroPhase>('work');
  const [remainingMs, setRemainingMs] = useState(DEFAULT_POMODORO.workMin * 60_000);
  const [completedWork, setCompletedWork] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const endsAtRef    = useRef(0);
  const phaseRef     = useRef<PomodoroPhase>('work');
  const completedRef = useRef(0);
  const configRef    = useRef(config);
  const onSwitchRef  = useRef(onSwitch);
  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { onSwitchRef.current = onSwitch; }, [onSwitch]);

  const phaseMs = useCallback((p: PomodoroPhase, c: PomodoroConfig) => {
    const min = p === 'work' ? c.workMin : p === 'break' ? c.breakMin : c.longBreakMin;
    return min * 60_000;
  }, []);

  // ─── 読み込み・保存（設定のみ） ─────────────────────────
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_POMODORO);
      if (raw) {
        const s = JSON.parse(raw) as Partial<PomodoroConfig>;
        const next: PomodoroConfig = {
          workMin:        clampMin(s.workMin ?? DEFAULT_POMODORO.workMin),
          breakMin:       clampMin(s.breakMin ?? DEFAULT_POMODORO.breakMin),
          longBreakMin:   clampMin(s.longBreakMin ?? DEFAULT_POMODORO.longBreakMin),
          longBreakEvery: clampEvery(s.longBreakEvery ?? DEFAULT_POMODORO.longBreakEvery),
        };
        setConfig(next);
        setRemainingMs(next.workMin * 60_000);
      }
    } catch { /* 破損データは無視 */ }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_POMODORO, JSON.stringify(config)); } catch { /* 無視 */ }
  }, [hydrated, config]);

  // ─── ティック（走行中のみ・フェーズ自動切替） ──────────
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const rem = endsAtRef.current - Date.now();
      if (rem > 0) { setRemainingMs(rem); return; }

      // フェーズ終了 → 次のフェーズへ
      const c = configRef.current;
      const cur = phaseRef.current;
      let nextPhase: PomodoroPhase;
      let nextCompleted = completedRef.current;
      if (cur === 'work') {
        nextCompleted += 1;
        nextPhase = nextCompleted % c.longBreakEvery === 0 ? 'longBreak' : 'break';
      } else {
        nextPhase = 'work';
      }
      const dur = phaseMs(nextPhase, c);
      phaseRef.current = nextPhase;
      completedRef.current = nextCompleted;
      endsAtRef.current = Date.now() + dur;
      setPhase(nextPhase);
      setCompletedWork(nextCompleted);
      setRemainingMs(dur);
      onSwitchRef.current(nextPhase);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status, phaseMs]);

  // ─── 設定変更（idle のときのみ許可し、残りを作業時間に戻す） ──
  const updateConfig = useCallback((patch: Partial<PomodoroConfig>) => {
    setConfig((cur) => {
      const next: PomodoroConfig = {
        workMin:        patch.workMin        !== undefined ? clampMin(patch.workMin)        : cur.workMin,
        breakMin:       patch.breakMin       !== undefined ? clampMin(patch.breakMin)       : cur.breakMin,
        longBreakMin:   patch.longBreakMin   !== undefined ? clampMin(patch.longBreakMin)   : cur.longBreakMin,
        longBreakEvery: patch.longBreakEvery !== undefined ? clampEvery(patch.longBreakEvery) : cur.longBreakEvery,
      };
      return next;
    });
    // idle のときだけ表示中の残りを新しい作業時間へ更新する。
    if (status === 'idle' && phase === 'work') {
      const w = patch.workMin !== undefined ? clampMin(patch.workMin) : configRef.current.workMin;
      setRemainingMs(w * 60_000);
    }
  }, [status, phase]);

  const start = useCallback(() => {
    if (status === 'running') return;
    primeAudio();
    if (status === 'paused') {
      endsAtRef.current = Date.now() + remainingMs;
    } else {
      // idle からは作業フェーズで開始
      phaseRef.current = 'work';
      completedRef.current = 0;
      setPhase('work');
      setCompletedWork(0);
      const dur = config.workMin * 60_000;
      endsAtRef.current = Date.now() + dur;
      setRemainingMs(dur);
    }
    setStatus('running');
  }, [status, remainingMs, config.workMin]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    setRemainingMs(Math.max(0, endsAtRef.current - Date.now()));
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    phaseRef.current = 'work';
    completedRef.current = 0;
    setPhase('work');
    setCompletedWork(0);
    setRemainingMs(config.workMin * 60_000);
    setStatus('idle');
  }, [config.workMin]);

  // 手動で次フェーズへ（通知は鳴らさない）。
  const skip = useCallback(() => {
    const c = configRef.current;
    const cur = phaseRef.current;
    let nextPhase: PomodoroPhase;
    let nextCompleted = completedRef.current;
    if (cur === 'work') {
      nextCompleted += 1;
      nextPhase = nextCompleted % c.longBreakEvery === 0 ? 'longBreak' : 'break';
    } else {
      nextPhase = 'work';
    }
    const dur = phaseMs(nextPhase, c);
    phaseRef.current = nextPhase;
    completedRef.current = nextCompleted;
    setPhase(nextPhase);
    setCompletedWork(nextCompleted);
    setRemainingMs(dur);
    if (status === 'running') endsAtRef.current = Date.now() + dur;
  }, [status, phaseMs]);

  return {
    config, status, phase, remainingMs, completedWork,
    updateConfig, start, pause, reset, skip,
  };
}
