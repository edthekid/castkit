'use client';

import { useState, useEffect } from 'react';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';
import { TimerTabs } from './_components/TimerTabs';
import { SoundControls } from './_components/SoundControls';
import { CountdownMode } from './_components/CountdownMode';
import { StopwatchMode } from './_components/StopwatchMode';
import { UntilMode } from './_components/UntilMode';
import { PomodoroMode } from './_components/PomodoroMode';
import { primeAudio, playBeep } from './_utils';
import { type TimerTab, TIMER_TABS, STORAGE_TAB, STORAGE_MUTED, STORAGE_VOLUME, DEFAULT_VOLUME } from './_constants';

export default function TimerPage() {
  const [tab, setTab]       = useState<TimerTab>('countdown');
  const [muted, setMuted]   = useState(true); // 既定はミュート
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [hydrated, setHydrated] = useState(false);

  // ─── 読み込み（マウント後） ─────────────────────────────
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const savedTab = localStorage.getItem(STORAGE_TAB);
      if (savedTab && (TIMER_TABS as readonly string[]).includes(savedTab)) setTab(savedTab as TimerTab);
      const savedMuted = localStorage.getItem(STORAGE_MUTED);
      if (savedMuted !== null) setMuted(savedMuted === '1');
      const savedVol = localStorage.getItem(STORAGE_VOLUME);
      if (savedVol !== null) {
        const v = Number(savedVol);
        if (Number.isFinite(v)) setVolume(Math.max(0, Math.min(1, v)));
      }
    } catch { /* 破損データは無視 */ }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_TAB, tab);
      localStorage.setItem(STORAGE_MUTED, muted ? '1' : '0');
      localStorage.setItem(STORAGE_VOLUME, String(volume));
    } catch { /* 容量超過などは無視 */ }
  }, [hydrated, tab, muted, volume]);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader
        titleKey="timer.title"
        subtitleKey="timer.subtitle"
        action={
          <SoundControls
            muted={muted}
            volume={volume}
            onToggleMute={() => setMuted((m) => !m)}
            onVolumeChange={setVolume}
            onPreview={() => { primeAudio(); playBeep(1, volume); }}
          />
        }
      />

      <div className="flex flex-col gap-5">
        <TimerTabs tab={tab} setTab={setTab} />

        {/* 各モードは常にマウントしたまま表示切替する（タブ切替で状態が壊れない）。 */}
        <div className={tab === 'countdown' ? '' : 'hidden'}><CountdownMode muted={muted} volume={volume} /></div>
        <div className={tab === 'stopwatch' ? '' : 'hidden'}><StopwatchMode /></div>
        <div className={tab === 'until' ? '' : 'hidden'}><UntilMode muted={muted} volume={volume} /></div>
        <div className={tab === 'pomodoro' ? '' : 'hidden'}><PomodoroMode muted={muted} volume={volume} /></div>
      </div>

      <ToolFooter />
    </div>
  );
}
