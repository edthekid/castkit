'use client';

import { ROULETTE_STYLES } from './_styles';
import { useRouletteGame } from './_hooks/useRouletteGame';
import { RouletteCore } from './_components/shared/RouletteCore';
import { DesignTabs, CandidatePanel, WinnersPanel } from './_components/shared/Panels';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';

export default function RoulettePage() {
  const game = useRouletteGame();

  return (
    <>
      <style>{ROULETTE_STYLES}</style>
      <div className="max-w-4xl mx-auto">

        <ToolHeader titleKey="roulette.title" subtitleKey="roulette.subtitle" />

        {/* デザイン切り替えタブ */}
        <div className="ck-section mb-4 ck-slide-up" style={{ animationDelay: '0.05s' }}>
          <DesignTabs
            current={game.design}
            isSpinning={game.isSpinning}
            onChange={game.handleDesignChange}
          />
        </div>

        {/* ルーレット / スロット */}
        <RouletteCore game={game} />

        {/* 候補者リスト・当選者 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CandidatePanel
            inputText={game.inputText}
            count={game.currentItems.length}
            autoMove={game.autoMove}
            onTextChange={(text) => { game.setInputText(text); game.setWinner(null); }}
            onAutoMoveChange={game.setAutoMove}
          />

          {game.autoMove && (
            <WinnersPanel
              winners={game.selectedHistory}
              onReturnOne={game.returnOne}
              onReturnAll={game.returnAll}
            />
          )}
        </div>

        <ToolFooter />
      </div>
    </>
  );
}
