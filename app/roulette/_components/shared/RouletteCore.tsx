'use client';

import { RouletteWheel } from '../wheel/RouletteWheel';
import { SlotMachine } from '../slot/SlotMachine';
import type { useRouletteGame } from '../../_hooks/useRouletteGame';
import { useTranslation } from '../../../_i18n/useTranslation';
import { ck } from '../../../_theme/colors';

interface RouletteCoreProps {
  game: ReturnType<typeof useRouletteGame>;
}

export function RouletteCore({ game }: RouletteCoreProps) {
  const { t } = useTranslation();
  return (
    <div
      className="ck-section mb-6 flex flex-col items-center gap-6 ck-slide-up"
      style={{ animationDelay: '0.1s' }}
    >
      {game.design === 1 ? (
        <RouletteWheel
          items={game.currentItems}
          svgRef={game.svgRef}
          winner={game.winner}
          animKey={game.animKey}
          bounceKey={game.bounceKey}
        />
      ) : (
        <SlotMachine
          items={game.currentItems}
          triggerKey={game.slotTriggerKey}
          winnerIdx={game.slotWinnerIdx}
          winner={game.winner}
          isSpinning={game.isSpinning}
        />
      )}

      <button
        onClick={game.startDraw}
        disabled={game.isSpinning}
        className="ck-btn ck-btn-primary w-full max-w-xs text-xl h-14 tracking-widest disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {t('roulette.start')}
      </button>

      {game.emptyError && (
        <p className="text-sm font-semibold animate-pulse" style={{ color: ck.text.primary }}>
          {t('roulette.emptyError')}
        </p>
      )}
    </div>
  );
}
