'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import type { TranslationKey } from '../../_i18n/translations';
import { ck } from '../../_theme/colors';
import { type TimerTab, TIMER_TABS } from '../_constants';

const TAB_LABEL: Record<TimerTab, TranslationKey> = {
  countdown: 'timer.tab.countdown',
  stopwatch: 'timer.tab.stopwatch',
  until: 'timer.tab.until',
  pomodoro: 'timer.tab.pomodoro',
};

/** 4モードのタブ切替（値はモードごとの hook が保持し、切替で壊れない）。 */
export function TimerTabs({ tab, setTab }: { tab: TimerTab; setTab: (t: TimerTab) => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label={t('timer.title')}>
      {TIMER_TABS.map((m) => {
        const active = tab === m;
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setTab(m)}
            className="ck-btn text-sm font-black py-2.5"
            style={{
              background: active ? ck.text.primary : ck.bg.muted,
              color:      active ? ck.text.onDark  : ck.text.primary,
              border: `1.5px solid ${active ? ck.text.primary : ck.border.default}`,
            }}
          >
            {t(TAB_LABEL[m])}
          </button>
        );
      })}
    </div>
  );
}
