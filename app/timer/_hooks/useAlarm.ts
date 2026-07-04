'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { playBeep } from '../_utils';
import { FLASH_DURATION_MS, DEFAULT_VOLUME } from '../_constants';

/**
 * 通知（音＋点滅）をまとめて扱うフック。各モードごとに1つ持つ。
 * - trigger(): muted でなければ volume でビープを鳴らし、一定時間 flashing=true にする。
 * - flashing: 表示側の点滅演出に使う。
 * - stop(): 点滅を止める（リセット時など）。
 *
 * muted / volume は最新値を ref で参照し、鳴動時点の設定を反映する。
 */
export function useAlarm(muted: boolean, volume: number = DEFAULT_VOLUME) {
  const [flashing, setFlashing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutedRef = useRef(muted);
  const volumeRef = useRef(volume);

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const trigger = useCallback((beeps = 3) => {
    if (!mutedRef.current) playBeep(beeps, volumeRef.current);
    setFlashing(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setFlashing(false), FLASH_DURATION_MS);
  }, []);

  const stop = useCallback(() => {
    setFlashing(false);
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  return { flashing, trigger, stop };
}
