'use client';

import { useState } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconPlay, IconRefresh, IconExpand } from '../../_components/icons';
import { useUntil } from '../_hooks/useUntil';
import { useAlarm } from '../_hooks/useAlarm';
import { formatClock } from '../_utils';
import { TimeDisplay } from './TimeDisplay';
import { ControlButton } from './ControlButton';
import { FullscreenOverlay } from './FullscreenOverlay';

/** 指定時刻まで：目標の日時までの残り時間をカウントダウン（ローカル時刻基準）。 */
export function UntilMode({ muted }: { muted: boolean }) {
  const { t } = useTranslation();
  const alarm = useAlarm(muted);
  const until = useUntil(alarm.trigger);
  const [full, setFull] = useState(false);

  const done = until.status === 'done';
  const running = until.status === 'running';
  const flashing = alarm.flashing || done;
  const clock = formatClock(until.remainingMs);
  const reached = until.remainingMs <= 0;

  const doReset = () => { until.reset(); alarm.stop(); };

  return (
    <div className="flex flex-col gap-5">
      <div className="ck-section flex flex-col items-center gap-4 py-8">
        <TimeDisplay value={clock} flashing={flashing} label={done ? t('timer.done') : t('timer.untilRemaining')} />
        <button
          type="button"
          onClick={() => setFull(true)}
          className="ck-btn h-9 px-3 text-xs font-black flex items-center gap-2"
          style={{ background: ck.bg.muted, color: ck.text.primary, border: `1.5px solid ${ck.border.default}` }}
        >
          <IconExpand size={15} aria-hidden="true" /> {t('timer.fullscreen')}
        </button>
      </div>

      {/* 目標日時 */}
      <div className="ck-section flex flex-col gap-3">
        <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: ck.text.secondary }} htmlFor="until-target">
          {t('timer.targetTime')}
        </label>
        <input
          id="until-target"
          type="datetime-local"
          value={until.value}
          disabled={running}
          onChange={(e) => until.setTarget(e.target.value)}
          className="ck-input h-11 text-base font-bold tabular-nums disabled:opacity-50"
        />
        <p className="text-xs" style={{ color: ck.text.muted }}>{t('timer.untilHint')}</p>
      </div>

      {/* 操作 */}
      <div className="flex justify-center gap-3">
        <ControlButton onClick={until.start} variant="primary" disabled={running || reached}>
          <IconPlay size={18} aria-hidden="true" /> {t('timer.startNotify')}
        </ControlButton>
        <ControlButton onClick={doReset} disabled={until.status === 'idle'}>
          <IconRefresh size={18} aria-hidden="true" /> {t('timer.reset')}
        </ControlButton>
      </div>

      <FullscreenOverlay
        open={full}
        onClose={() => setFull(false)}
        value={clock}
        label={done ? t('timer.done') : t('timer.tab.until')}
        flashing={flashing}
      />
    </div>
  );
}
