'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { FONTS } from '../../_lib/fonts';

/**
 * 大型表示の数字フォントを選ぶセレクト（全モード共通）。
 * フォント一覧はスコアボードと同じ共通定義（app/_lib/fonts.ts）を使う。
 */
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
        className="ck-input px-2 py-1.5 text-sm font-bold"
      >
        {FONTS.map((f) => (
          <option key={f.id} value={f.id} style={{ fontFamily: f.stack || undefined }}>
            {f.label}
          </option>
        ))}
      </select>
    </label>
  );
}
