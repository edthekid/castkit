'use client';

import { useState, useEffect } from 'react';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';
import { TimerTabs } from './_components/TimerTabs';
import { MuteToggle } from './_components/MuteToggle';
import { CountdownMode } from './_components/CountdownMode';
import { StopwatchMode } from './_components/StopwatchMode';
import { UntilMode } from './_components/UntilMode';
import { PomodoroMode } from './_components/PomodoroMode';
import { type TimerTab, TIMER_TABS, STORAGE_TAB, STORAGE_MUTED } from './_constants';

export default function TimerPage() {
  const [tab, setTab]     = useState<TimerTab>('countdown');
  const [muted, setMuted] = useState(true); // 既定はミュート
  const [hydrated, setHydrated] = useState(false);

  // ─── 読み込み（マウント後） ─────────────────────────────
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const savedTab = localStorage.getItem(STORAGE_TAB);
      if (savedTab && (TIMER_TABS as readonly string[]).includes(savedTab)) setTab(savedTab as TimerTab);
      const savedMuted = localStorage.getItem(STORAGE_MUTED);
      if (savedMuted !== null) setMuted(savedMuted === '1');
    } catch { /* 破損データは無視 */ }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_TAB, tab);
      localStorage.setItem(STORAGE_MUTED, muted ? '1' : '0');
    } catch { /* 容量超過などは無視 */ }
  }, [hydrated, tab, muted]);

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader
        titleKey="timer.title"
        subtitleKey="timer.subtitle"
        action={<MuteToggle muted={muted} onToggle={() => setMuted((m) => !m)} />}
      />

      <div className="flex flex-col gap-5">
        <TimerTabs tab={tab} setTab={setTab} />

        {/* 各モードは常にマウントしたまま表示切替する（タブ切替で状態が壊れない）。 */}
        <div className={tab === 'countdown' ? '' : 'hidden'}><CountdownMode muted={muted} /></div>
        <div className={tab === 'stopwatch' ? '' : 'hidden'}><StopwatchMode /></div>
        <div className={tab === 'until' ? '' : 'hidden'}><UntilMode muted={muted} /></div>
        <div className={tab === 'pomodoro' ? '' : 'hidden'}><PomodoroMode muted={muted} /></div>
      </div>

      <ToolFooter />
    </div>
  );
}
