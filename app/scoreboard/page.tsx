'use client';

import { useMemo } from 'react';
import { useScoreboard } from './_hooks/useScoreboard';
import { ControlPanel } from './_components/ControlPanel';
import { TeamControl } from './_components/TeamControl';
import { RecordList } from './_components/RecordList';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';
import { getFontStack } from './_constants';

export default function ScoreboardPage() {
  const sb = useScoreboard();

  // 同点は同順位（dense rank）。順位表示OFFのときは計算を省く。
  const rankById = useMemo(() => {
    const uniqueDesc = Array.from(new Set(sb.teams.map((tm) => tm.score))).sort((a, b) => b - a);
    const map = new Map<string, number>();
    sb.teams.forEach((tm) => map.set(tm.id, uniqueDesc.indexOf(tm.score) + 1));
    return map;
  }, [sb.teams]);

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader titleKey="scoreboard.title" subtitleKey="scoreboard.subtitle" />

      <ControlPanel
        designMode={sb.designMode}
        showRank={sb.showRank}
        sortMode={sb.sortMode}
        fontId={sb.fontId}
        bulkAmount={sb.bulkAmount}
        teamCount={sb.teams.length}
        onDesignMode={sb.setDesignMode}
        onToggleRank={sb.setShowRank}
        onFont={sb.setFontId}
        onBulkAmount={sb.applyBulkAmount}
        onTeamCount={sb.setTeamCount}
        onToggleSort={sb.toggleSort}
        onRecord={sb.recordSnapshot}
        onCopy={sb.copyScores}
        onReset={sb.resetScores}
        onResetAll={sb.resetAll}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sb.teams.map((team) => (
          <TeamControl
            key={team.id}
            team={team}
            displayName={sb.getTeamName(team)}
            rank={sb.showRank ? (rankById.get(team.id) ?? null) : null}
            mode={sb.designMode}
            bumped={sb.bumpedId === team.id}
            canUndo={(sb.undoStacks[team.id]?.length ?? 0) > 0}
            fontStack={getFontStack(sb.fontId)}
            amount={sb.getAmount(team.id)}
            onRename={sb.renameTeam}
            onRecolor={sb.recolorTeam}
            onChangeScore={sb.changeScore}
            onSetScore={sb.setScore}
            onAmountChange={sb.setTeamAmount}
            onUndo={sb.undoTeam}
          />
        ))}
      </div>

      <RecordList records={sb.records} onDelete={sb.deleteRecord} onCopy={sb.copyRecord} onClear={sb.clearRecords} />

      <ToolFooter />
    </div>
  );
}
