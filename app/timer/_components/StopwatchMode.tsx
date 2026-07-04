'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconPlay, IconPause, IconRefresh, IconFlag } from '../../_components/icons';
import { useStopwatch } from '../_hooks/useStopwatch';
import { formatStopwatch } from '../_utils';
import { TimeDisplay } from './TimeDisplay';
import { ControlButton } from './ControlButton';

/** ストップウォッチ：開始/一時停止/リセット・ラップ計測（1/100秒表示）。 */
export function StopwatchMode({ fontFamily }: { fontFamily?: string }) {
  const { t } = useTranslation();
  const sw = useStopwatch();
  const running = sw.status === 'running';

  const toggle = () => { if (running) sw.pause(); else sw.start(); };

  return (
    <div className="flex flex-col gap-5">
      <div className="ck-section flex flex-col items-center gap-4 py-8">
        <TimeDisplay value={formatStopwatch(sw.elapsedMs)} fontFamily={fontFamily} />
      </div>

      {/* 操作 */}
      <div className="flex justify-center gap-3">
        <ControlButton onClick={toggle} variant="primary">
          {running ? <IconPause size={18} aria-hidden="true" /> : <IconPlay size={18} aria-hidden="true" />}
          {running ? t('timer.pause') : sw.status === 'paused' ? t('timer.resume') : t('timer.start')}
        </ControlButton>
        <ControlButton onClick={sw.lap} disabled={!running}>
          <IconFlag size={18} aria-hidden="true" /> {t('timer.lap')}
        </ControlButton>
        <ControlButton onClick={sw.reset} disabled={sw.status === 'idle'}>
          <IconRefresh size={18} aria-hidden="true" /> {t('timer.reset')}
        </ControlButton>
      </div>

      {/* ラップ一覧 */}
      {sw.laps.length > 0 && (
        <div className="ck-section">
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: ck.text.secondary }}>
            {t('timer.laps')}
          </p>
          <ul>
            {sw.laps.map((l) => (
              <li
                key={l.index}
                className="flex items-center justify-between py-2 text-sm tabular-nums"
                style={{ borderTop: `1px solid ${ck.border.default}` }}
              >
                <span className="font-black" style={{ color: ck.text.secondary }}>
                  {t('timer.lapN', { n: l.index })}
                </span>
                <span className="font-black" style={{ color: ck.text.primary }}>{formatStopwatch(l.split)}</span>
                <span className="font-bold text-xs" style={{ color: ck.text.muted }}>{formatStopwatch(l.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
