'use client';

import { useAmida } from './_hooks/useAmida';
import { InputPanel } from './_components/InputPanel';
import { AmidaCanvas } from './_components/AmidaCanvas';
import { ResultPanel } from './_components/ResultPanel';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';

export default function AmidaPage() {
  const amida = useAmida();

  return (
    <div className="max-w-4xl mx-auto">

      <ToolHeader titleKey="amida.title" subtitleKey="amida.subtitle" />

      {/* 入力フォーム */}
      {amida.phase === 'input' && (
        <InputPanel
          playersText={amida.playersText}
          players={amida.players}
          resultsText={amida.resultsText}
          resultCount={amida.results.length}
          winCount={amida.winCount}
          onPlayersChange={amida.setPlayersText}
          onResultsChange={amida.setResultsText}
          onWinCountChange={amida.changeWinCount}
          onGenerate={amida.generate}
        />
      )}

      {/* あみだ描画 */}
      {(amida.phase === 'ready' || amida.phase === 'tracing' || amida.phase === 'done') && (
        <div className="ck-section ck-slide-up">
          <AmidaCanvas
            players={amida.players}
            results={amida.results}
            rows={amida.rows}
            rungs={amida.rungs}
            tracePaths={amida.tracePaths}
            phase={amida.phase}
            activeSet={amida.activeSet}
            doneSet={amida.doneSet}
            editingIdx={amida.editingIdx}
            scrollTrigger={amida.scrollTrigger}
            onStartEdit={amida.startEdit}
            onSwapPlayers={amida.swapPlayers}
            onStart={amida.startTrace}
            onRegenerate={amida.regenerate}
            onReset={amida.reset}
          />
        </div>
      )}

      {/* 結果パネル */}
      <ResultPanel
        players={amida.players}
        resultMap={amida.resultMap}
        doneSet={amida.doneSet}
        show={amida.phase === 'done'}
      />

      <ToolFooter />
    </div>
  );
}
