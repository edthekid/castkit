'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import type { TranslationKey } from '../../_i18n/translations';
import { ck } from '../../_theme/colors';
import { TIMER_FONTS } from '../_constants';

/** 大型表示の数字フォントを選ぶセレクト（全モード共通）。 */
export function FontSelect({ font, onChange }: { font: string; onChange: (id: string) => void }) {
  const { t } = useTranslation();
  return (
    <label className="flex items-center gap-2">
      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
        {t('timer.fontLabel')}
      </span>
      <select
        value={font}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('timer.fontLabel')}
        className="ck-input h-9 px-2 text-xs font-bold"
      >
        {TIMER_FONTS.map((f) => (
          <option key={f.id} value={f.id}>{t(f.labelKey as TranslationKey)}</option>
        ))}
      </select>
    </label>
  );
}
