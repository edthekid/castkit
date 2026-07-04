'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { type RunStatus, STORAGE_COUNTDOWN } from '../_constants';
import { primeAudio } from '../_utils';

const TICK_MS = 100;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Math.floor(n) || 0));

interface Persisted { h: number; m: number; s: number; }

/**
 * カウントダウン。残り時間は endsAt（実時刻）との差で毎ティック算出するため、
 * ドリフトやタブ非アクティブ時のスロットリングに強い（復帰時に自動補正）。
 * onDone は 0 到達時に1回だけ呼ぶ（通知音・点滅のトリガ）。
 */
export function useCountdown(onDone: () => void) {
  const [hours, setHours]     = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus]   = useState<RunStatus>('idle');
  const [remainingMs, setRemainingMs] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const endsAtRef  = useRef(0);
  const onDoneRef  = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  const totalMs = ((hours * 3600) + (minutes * 60) + seconds) * 1000;
  // idle のときは設定値をそのまま表示。走行中/一時停止/完了は remainingMs。
  const displayMs = status === 'idle' ? totalMs : remainingMs;

  // ─── 読み込み・保存（設定の h/m/s のみ） ───────────────
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_COUNTDOWN);
      if (raw) {
        const s = JSON.parse(raw) as Partial<Persisted>;
        if (typeof s.h === 'number') setHours(clamp(s.h, 0, 99));
        if (typeof s.m === 'number') setMinutes(clamp(s.m, 0, 59));
        if (typeof s.s === 'number') setSeconds(clamp(s.s, 0, 59));
      }
    } catch { /* 破損データは無視 */ }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_COUNTDOWN, JSON.stringify({ h: hours, m: minutes, s: seconds } satisfies Persisted));
    } catch { /* 容量超過などは無視 */ }
  }, [hydrated, hours, minutes, seconds]);

  // ─── ティック（走行中のみ） ─────────────────────────────
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const rem = Math.max(0, endsAtRef.current - Date.now());
      setRemainingMs(rem);
      if (rem <= 0) {
        clearInterval(id);
        setStatus('done');
        onDoneRef.current();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status]);

  // ─── 操作 ───────────────────────────────────────────────
  // 設定の変更は idle に戻す（走行中の値には影響させない）。
  const editHours   = useCallback((n: number) => { setStatus('idle'); setHours(clamp(n, 0, 99)); }, []);
  const editMinutes = useCallback((n: number) => { setStatus('idle'); setMinutes(clamp(n, 0, 59)); }, []);
  const editSeconds = useCallback((n: number) => { setStatus('idle'); setSeconds(clamp(n, 0, 59)); }, []);

  const applyPreset = useCallback((ms: number) => {
    setStatus('idle');
    setHours(Math.floor(ms / 3600000));
    setMinutes(Math.floor((ms % 3600000) / 60000));
    setSeconds(Math.floor((ms % 60000) / 1000));
  }, []);

  const start = useCallback(() => {
    const base = status === 'paused' ? remainingMs : totalMs;
    if (base <= 0) return;
    primeAudio();
    endsAtRef.current = Date.now() + base;
    setRemainingMs(base);
    setStatus('running');
  }, [status, remainingMs, totalMs]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    setRemainingMs(Math.max(0, endsAtRef.current - Date.now()));
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setRemainingMs(0);
  }, []);

  return {
    hours, minutes, seconds,
    status, displayMs, totalMs,
    editHours, editMinutes, editSeconds, applyPreset,
    start, pause, reset,
  };
}
