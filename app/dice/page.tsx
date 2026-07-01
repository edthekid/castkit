'use client';

import { useDice } from './_hooks/useDice';
import { DiceStage } from './_components/DiceStage';
import { DiceControls } from './_components/DiceControls';
import { ColorPicker } from './_components/ColorPicker';
import { DiceHistoryPanel } from './_components/DiceHistory';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';

export default function DicePage() {
  const dice = useDice();

  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader titleKey="dice.title" subtitleKey="dice.subtitle" />

      <div className="flex flex-col gap-4">
        {/* サイコロ表示エリア */}
        <DiceStage
          phase={dice.phase}
          current={dice.current}
          color={dice.color}
          rollKey={dice.rollKey}
        />

        {/* 操作パネル + 色設定 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DiceControls
            mode={dice.mode}
            setMode={dice.setMode}
            count={dice.count}
            incDie={dice.incDie}
            decDie={dice.decDie}
            sides={dice.sides}
            setSides={dice.setSides}
            isD100={dice.isD100}
            phase={dice.phase}
            onRoll={dice.roll}
          />

          <div className="flex flex-col gap-4">
            <div className="ck-section">
              <ColorPicker color={dice.color} onChange={dice.setColor} />
            </div>
            <DiceHistoryPanel
              history={dice.history}
              onCopy={dice.copyRecord}
              onClear={dice.clearHistory}
            />
          </div>
        </div>
      </div>

      <ToolFooter />
    </div>
  );
}
