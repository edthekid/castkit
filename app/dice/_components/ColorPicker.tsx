'use client';

import { useState } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { COLOR_PRESETS } from '../_constants';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

/** ダイスの色を選ぶ（プリセット＋自由な色＋カラーコード入力）。 */
export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const { t } = useTranslation();
  const [hexDraft, setHexDraft]   = useState(color);
  const [lastColor, setLastColor] = useState(color);

  // 外部からの色変更にカラーコード入力欄を追従（レンダリング中の state 調整）。
  if (color !== lastColor) {
    setLastColor(color);
    setHexDraft(color);
  }

  const applyHex = () => {
    const v = hexDraft.trim().replace(/^#?/, '#');
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v.toLowerCase());
    else setHexDraft(color);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
        {t('dice.color')}
      </p>

      {/* プリセット */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('dice.colorPresets')}>
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            style={{ background: c, borderColor: c === color ? ck.text.primary : 'transparent' }}
            onClick={() => onChange(c)}
            aria-label={c}
            aria-pressed={c === color}
          />
        ))}

        {/* 自由な色を選ぶ */}
        <label
          className="relative w-7 h-7 rounded-full border border-ck-line overflow-hidden cursor-pointer"
          style={{ background: color }}
          title={t('dice.customColor')}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label={t('dice.customColor')}
          />
        </label>
      </div>

      {/* カラーコード入力 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={hexDraft}
          onChange={(e) => setHexDraft(e.target.value)}
          onBlur={applyHex}
          onKeyDown={(e) => { if (e.key === 'Enter') applyHex(); }}
          spellCheck={false}
          className="w-28 text-sm font-mono px-2 py-1.5 outline-none"
          style={{ border: `1.5px solid ${ck.border.default}`, background: ck.bg.muted, color: ck.text.primary }}
          aria-label={t('dice.colorCode')}
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  );
}
