'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconDice } from '../../_components/icons';
import type { RollPhase, RollRecord } from '../_constants';

// Three.js / cannon-es は重いので、初回ロール時にだけ動的読み込みする。
// ssr:false でサーバー実行を避け、他ページのバンドルにも含めない。
const DiceCanvas = dynamic(
  () => import('./DiceCanvas').then((m) => ({ default: m.DiceCanvas })),
  { ssr: false },
);

interface DiceStageProps {
  phase: RollPhase;
  current: RollRecord | null;
  rollKey: number;
  /** 今回振る本数と面数（出目は物理が自然な着地で決める） */
  activeCount: number;
  activeSides: number;
  /** 着地して上面が確定したときに、実際の出目を渡して呼ばれる */
  onSettled: (values: number[]) => void;
}

export function DiceStage({
  phase, current, rollKey, activeCount, activeSides, onSettled,
}: DiceStageProps) {
  const { t } = useTranslation();
  const showResult = phase === 'result' && current;
  const started = rollKey > 0;

  return (
    <div
      className="relative w-full overflow-hidden ck-section"
      style={{ minHeight: 320, background: '#591616' }}
      aria-label={t('dice.canvasLabel')}
    >
      {started ? (
        <DiceCanvas
          count={activeCount}
          sides={activeSides}
          rollKey={rollKey}
          onSettled={onSettled}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3" style={{ color: '#e6bcbc' }}>
            <IconDice size={48} aria-hidden="true" />
            <span className="text-sm font-bold">{t('dice.emptyHistory')}</span>
          </div>
        </div>
      )}

      {/* 合計ポップアップ（静止後に表示）。濃色トレイ上で目立つよう白基調。 */}
      {showResult && (
        <div
          key={`total-${rollKey}`}
          className="absolute left-1/2 bottom-5 -translate-x-1/2 ck-dice-pop pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-baseline gap-2 px-5 py-2.5 shadow-xl"
            style={{ background: ck.text.onDark, color: ck.text.primary }}
          >
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>{t('dice.total')}</span>
            <span className="text-3xl font-black tabular-nums leading-none">{current.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
