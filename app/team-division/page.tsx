'use client';

import { useTeamDivision } from './_hooks/useTeamDivision';
import { useTranslation } from '../_i18n/useTranslation';
import { MemberInput } from './_components/MemberInput';
import { TeamSettings } from './_components/TeamSettings';
import { MemberFixPanel } from './_components/MemberFixPanel';
import { PatternList } from './_components/PatternList';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';

export default function TeamDivider() {
  const td = useTeamDivision();
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader titleKey="teamDivision.title" subtitleKey="teamDivision.subtitle" />

      {/* STEP 1: メンバー入力 */}
      <MemberInput
        inputText={td.inputText}
        memberCount={td.currentMembers.length}
        duplicateMembers={td.duplicateMembers}
        onChange={td.setInputText}
      />

      {/* STEP 2: チーム数・チーム名 */}
      <TeamSettings
        teamCount={td.teamCount}
        teamNames={td.teamNames}
        onTeamCountChange={td.handleTeamCountChange}
        onTeamNameChange={td.handleTeamNameChange}
      />

      {/* STEP 3: メンバー固定 */}
      <MemberFixPanel
        members={td.currentMembers}
        teamCount={td.teamCount}
        fixedMembers={td.fixedMembers}
        teamNames={td.teamNames}
        getTeamName={td.getTeamName}
        onToggle={td.toggleMemberFix}
      />

      {/* STEP 4: 結果ボタン */}
      <div className="mt-6 mb-10">
        <button
          onClick={td.divideTeams}
          className="ck-btn ck-btn-primary w-full text-xl h-14 tracking-widest"
        >
          {t('divideButton')}
        </button>
      </div>

      {/* 結果表示 */}
      {td.patterns.length > 0 && (
        <PatternList
          patterns={td.patterns}
          filteredPatterns={td.filteredPatterns}
          playedKeys={td.playedKeys}
          activeTab={td.activeTab}
          unplayedCount={td.unplayedCount}
          playedCount={td.playedCount}
          fixedMembers={td.fixedMembers}
          getTeamName={td.getTeamName}
          onTabChange={td.setActiveTab}
          onCopy={td.copyPattern}
          onTogglePlay={td.togglePlayStatus}
        />
      )}

      <ToolFooter />
    </div>
  );
}
