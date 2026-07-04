'use client';

import { useState } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconPlay, IconPause, IconRefresh, IconExpand } from '../../_components/icons';
import { useCountdown } from '../_hooks/useCountdown';
import { useAlarm } from '../_hooks/useAlarm';
import { COUNTDOWN_PRESETS } from '../_constants';
import type { TranslationKey } from '../../_i18n/translations';
import { formatClock } from '../_utils';
import { TimeDisplay } from './TimeDisplay';
import { NumberStepper } from './NumberStepper';
import { ControlButton } from './ControlButton';
import { FullscreenOverlay } from './FullscreenOverlay';

/** カウントダウン：時/分/秒設定・プリセット・開始/一時停止/リセット・全画面。 */
export function CountdownMode({ muted }: { muted: boolean }) {
  const { t } = useTranslation();
  const alarm = useAlarm(muted);
  const cd = useCountdown(alarm.trigger);
  const [full, setFull] = useState(false);

  const running = cd.status === 'running';
  const done = cd.status === 'done';
  const editable = cd.status === 'idle';
  const clock = formatClock(cd.displayMs);
  const flashing = alarm.flashing || done;

  const toggle = () => { if (running) cd.pause(); else cd.start(); };
  const doReset = () => { cd.reset(); alarm.stop(); };

  return (
    <div className="flex flex-col gap-5">
      {/* 大型表示 */}
      <div className="ck-section flex flex-col items-center gap-4 py-8">
        <TimeDisplay value={clock} flashing={flashing} label={done ? t('timer.done') : undefined} />
        <button
          type="button"
          onClick={() => setFull(true)}
          className="ck-btn h-9 px-3 text-xs font-black flex items-center gap-2"
          style={{ background: ck.bg.muted, color: ck.text.primary, border: `1.5px solid ${ck.border.default}` }}
        >
          <IconExpand size={15} aria-hidden="true" /> {t('timer.fullscreen')}
        </button>
      </div>

      {/* 時間設定（idle のときのみ操作可） */}
      <div className="ck-section flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-center gap-4">
          {([
            ['timer.hours',   cd.hours,   cd.editHours,   99] as const,
            ['timer.minutes', cd.minutes, cd.editMinutes, 59] as const,
            ['timer.seconds', cd.seconds, cd.editSeconds, 59] as const,
          ]).map(([labelKey, value, onChange, max]) => (
            <div key={labelKey} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
                {t(labelKey as TranslationKey)}
              </span>
              <NumberStepper
                value={value}
                min={0}
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

        {/* プリセット */}
        <div className="flex flex-wrap justify-center gap-2">
          {COUNTDOWN_PRESETS.map((p) => (
            <button
              key={p.labelKey}
              type="button"
              onClick={() => cd.applyPreset(p.ms)}
              className="ck-btn text-xs font-black px-3 py-1.5"
              style={{ background: ck.bg.muted, color: ck.text.primary, border: `1.5px solid ${ck.border.default}` }}
            >
              {t(p.labelKey as TranslationKey)}
            </button>
          ))}
        </div>
      </div>

      {/* 操作 */}
      <div className="flex justify-center gap-3">
        <ControlButton onClick={toggle} variant="primary" disabled={cd.displayMs <= 0 && !running}>
          {running ? <IconPause size={18} aria-hidden="true" /> : <IconPlay size={18} aria-hidden="true" />}
          {running ? t('timer.pause') : cd.status === 'paused' ? t('timer.resume') : t('timer.start')}
        </ControlButton>
        <ControlButton onClick={doReset} disabled={cd.status === 'idle'}>
          <IconRefresh size={18} aria-hidden="true" /> {t('timer.reset')}
        </ControlButton>
      </div>

      <FullscreenOverlay
        open={full}
        onClose={() => setFull(false)}
        value={clock}
        label={done ? t('timer.done') : t('timer.tab.countdown')}
        flashing={flashing}
      />
    </div>
  );
}
