'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { primeAudio } from '../_utils';

const TICK_MS = 250;

type UntilStatus = 'idle' | 'running' | 'done';

/** Date → datetime-local input 用の 'YYYY-MM-DDTHH:MM'（ローカル時刻）。 */
function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * 指定時刻（当日 or 日時）までの残り時間。端末のローカル時刻基準。
 * value（datetime-local 文字列）が有効な間は常時プレビュー表示し、
 * 「開始」で通知を armする。0 到達時、running のときだけ onDone を1回呼ぶ。
 */
export function useUntil(onDone: () => void) {
  const [value, setValue]     = useState('');
  const [status, setStatus]   = useState<UntilStatus>('idle');
  const [remainingMs, setRemainingMs] = useState(0);

  const statusRef = useRef<UntilStatus>('idle');
  const onDoneRef = useRef(onDone);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // 既定値は「今から1時間後」。SSR と一致させるためマウント後に設定する。
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(toLocalInput(new Date(Date.now() + 3600_000)));
  }, []);

  // 常時ティック：残りをプレビュー更新。onDone は running のときのみ発火。
  useEffect(() => {
    const compute = () => {
      const t = value ? new Date(value).getTime() : NaN;
      if (!Number.isFinite(t)) { setRemainingMs(0); return; }
      const rem = Math.max(0, t - Date.now());
      setRemainingMs(rem);
      if (rem <= 0 && statusRef.current === 'running') {
        setStatus('done');
        onDoneRef.current();
      }
    };
    const id = setInterval(compute, TICK_MS);
    return () => clearInterval(id);
  }, [value]);

  const setTarget = useCallback((v: string) => {
    setValue(v);
    setStatus('idle');
  }, []);

  const start = useCallback(() => {
    const t = value ? new Date(value).getTime() : NaN;
    if (!Number.isFinite(t) || t - Date.now() <= 0) return;
    primeAudio();
    setStatus('running');
  }, [value]);

  const reset = useCallback(() => {
    setStatus('idle');
  }, []);

  return { value, status, remainingMs, setTarget, start, reset };
}
