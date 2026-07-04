'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { type Lap, MAX_LAPS } from '../_constants';

const TICK_MS = 33; // 1/100秒表示のため ~30fps で更新

type SwStatus = 'idle' | 'running' | 'paused';

/**
 * ストップウォッチ（1/100秒表示・ラップ計測）。
 * 経過時間は「累計 base + (現在時刻 - 再開時刻)」で算出するため、
 * 一時停止をまたいでもドリフトしない。
 */
export function useStopwatch() {
  const [status, setStatus]   = useState<SwStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps]       = useState<Lap[]>([]);

  const startedAtRef = useRef(0); // 直近の start/resume 時刻
  const baseRef      = useRef(0); // それ以前の累計

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      setElapsedMs(baseRef.current + (Date.now() - startedAtRef.current));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status]);

  const start = useCallback(() => {
    if (status === 'running') return;
    startedAtRef.current = Date.now();
    setStatus('running');
  }, [status]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    baseRef.current += Date.now() - startedAtRef.current;
    setElapsedMs(baseRef.current);
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    baseRef.current = 0;
    startedAtRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
    setStatus('idle');
  }, []);

  const lap = useCallback(() => {
    if (status !== 'running') return;
    const total = baseRef.current + (Date.now() - startedAtRef.current);
    setLaps((prev) => {
      const prevTotal = prev.length > 0 ? prev[0].total : 0;
      const entry: Lap = { index: prev.length + 1, split: total - prevTotal, total };
      return [entry, ...prev].slice(0, MAX_LAPS);
    });
  }, [status]);

  return { status, elapsedMs, laps, start, pause, reset, lap };
}
