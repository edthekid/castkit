'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconDice } from '../../_components/icons';
import type { RollPhase, RollRecord } from '../_constants';

interface DiceStageProps {
  phase: RollPhase;
  current: RollRecord | null;
  color: string;
  /** roll ごとに変わるキー（アニメーション再生用） */
  rollKey: number;
}

/** #RRGGBB の明度から、上に載せる文字色（黒/白）を選ぶ。 */
function readableText(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  // 相対輝度（近似）
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#18181b' : '#ffffff';
}

export function DiceStage({ phase, current, color, rollKey }: DiceStageProps) {
  const { t } = useTranslation();
  const textColor = readableText(color);
  const showResult = phase === 'result' && current;

  return (
    <div
      className="relative w-full overflow-hidden ck-section"
      style={{ minHeight: 320 }}
      aria-label={t('dice.canvasLabel')}
    >
      {/* サイコロ表示（Step 3 で3Dキャンバスに置き換える） */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {current ? (
          <div key={rollKey} className="flex flex-wrap items-center justify-center gap-3">
            {current.values.map((v, i) => (
              <div
                key={i}
                className="ck-dice-pop flex items-center justify-center rounded-xl font-black tabular-nums shadow-lg"
                style={{
                  width: 64,
                  height: 64,
                  background: color,
                  color: textColor,
                  fontSize: 24,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {v}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3" style={{ color: ck.text.muted }}>
            <IconDice size={48} aria-hidden="true" />
            <span className="text-sm font-bold">{t('dice.emptyHistory')}</span>
          </div>
        )}
      </div>

      {/* 合計ポップアップ（静止後に表示） */}
      {showResult && (
        <div
          key={`total-${rollKey}`}
          className="absolute left-1/2 bottom-5 -translate-x-1/2 ck-dice-pop"
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-baseline gap-2 px-5 py-2.5 shadow-xl"
            style={{ background: ck.text.primary, color: ck.text.onDark }}
          >
            <span className="text-xs font-black tracking-widest uppercase opacity-70">{t('dice.total')}</span>
            <span className="text-3xl font-black tabular-nums leading-none">{current.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
