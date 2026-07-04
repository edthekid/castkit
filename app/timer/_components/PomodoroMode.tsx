'use client';

import { useState } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import type { TranslationKey } from '../../_i18n/translations';
import { ck } from '../../_theme/colors';
import { IconPlay, IconPause, IconRefresh, IconExpand, IconPlay as IconSkip } from '../../_components/icons';
import { usePomodoro } from '../_hooks/usePomodoro';
import { useAlarm } from '../_hooks/useAlarm';
import {
  type PomodoroPhase,
  POMODORO_MIN, POMODORO_MAX, POMODORO_EVERY_MIN, POMODORO_EVERY_MAX,
} from '../_constants';
import { formatClock } from '../_utils';
import { TimeDisplay } from './TimeDisplay';
import { NumberStepper } from './NumberStepper';
import { ControlButton } from './ControlButton';
import { FullscreenOverlay } from './FullscreenOverlay';

const PHASE_LABEL: Record<PomodoroPhase, TranslationKey> = {
  work: 'timer.phase.work',
  break: 'timer.phase.break',
  longBreak: 'timer.phase.longBreak',
};

/** ポモドーロ：作業/休憩ループ・サイクル数表示・設定は localStorage 保持。 */
export function PomodoroMode({ muted }: { muted: boolean }) {
  const { t } = useTranslation();
  const alarm = useAlarm(muted);
  // フェーズ切替ごとに通知（phase は使わないので破棄）。
  const pomo = usePomodoro(() => alarm.trigger());
  const [full, setFull] = useState(false);

  const running = pomo.status === 'running';
  const editable = pomo.status === 'idle';
  const clock = formatClock(pomo.remainingMs);
  const phaseLabel = t(PHASE_LABEL[pomo.phase]);

  const toggle = () => { if (running) pomo.pause(); else pomo.start(); };
  const doReset = () => { pomo.reset(); alarm.stop(); };

  const CONFIG_FIELDS = [
    ['timer.pomo.work',      pomo.config.workMin,        (n: number) => pomo.updateConfig({ workMin: n }),        POMODORO_MIN, POMODORO_MAX] as const,
    ['timer.pomo.break',     pomo.config.breakMin,       (n: number) => pomo.updateConfig({ breakMin: n }),       POMODORO_MIN, POMODORO_MAX] as const,
    ['timer.pomo.longBreak', pomo.config.longBreakMin,   (n: number) => pomo.updateConfig({ longBreakMin: n }),   POMODORO_MIN, POMODORO_MAX] as const,
    ['timer.pomo.every',     pomo.config.longBreakEvery, (n: number) => pomo.updateConfig({ longBreakEvery: n }), POMODORO_EVERY_MIN, POMODORO_EVERY_MAX] as const,
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="ck-section flex flex-col items-center gap-4 py-8">
        <TimeDisplay value={clock} flashing={alarm.flashing} label={phaseLabel} />
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tabular-nums" style={{ color: ck.text.secondary }}>
            {t('timer.pomo.completed', { n: pomo.completedWork })}
          </span>
          <button
            type="button"
            onClick={() => setFull(true)}
            className="ck-btn h-9 px-3 text-xs font-black flex items-center gap-2"
            style={{ background: ck.bg.muted, color: ck.text.primary, border: `1.5px solid ${ck.border.default}` }}
          >
            <IconExpand size={15} aria-hidden="true" /> {t('timer.fullscreen')}
          </button>
        </div>
      </div>

      {/* 設定（idle のときのみ操作可） */}
      <div className="ck-section flex flex-col gap-3">
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('timer.pomo.settings')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CONFIG_FIELDS.map(([labelKey, value, onChange, min, max]) => (
            <div key={labelKey} className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold" style={{ color: ck.text.secondary }}>{t(labelKey as TranslationKey)}</span>
              <NumberStepper
                value={value}
                min={min}
                max={max}
                onChange={onChange}
                disabled={!editable}
                ariaLabel={t(labelKey as TranslationKey)}
                ariaDec={t('timer.decrease')}
                ariaInc={t('timer.increase')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 操作 */}
      <div className="flex justify-center gap-3 flex-wrap">
        <ControlButton onClick={toggle} variant="primary">
          {running ? <IconPause size={18} aria-hidden="true" /> : <IconPlay size={18} aria-hidden="true" />}
          {running ? t('timer.pause') : pomo.status === 'paused' ? t('timer.resume') : t('timer.start')}
        </ControlButton>
        <ControlButton onClick={pomo.skip} disabled={pomo.status === 'idle'}>
          <IconSkip size={18} aria-hidden="true" /> {t('timer.skip')}
        </ControlButton>
        <ControlButton onClick={doReset} disabled={pomo.status === 'idle'}>
          <IconRefresh size={18} aria-hidden="true" /> {t('timer.reset')}
        </ControlButton>
      </div>

      <FullscreenOverlay
        open={full}
        onClose={() => setFull(false)}
        value={clock}
        label={phaseLabel}
        flashing={alarm.flashing}
      />
    </div>
  );
}
