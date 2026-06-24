import type { TeamPattern, TabType } from '../_constants';
import { PatternCard } from './PatternCard';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';

interface PatternListProps {
  patterns: TeamPattern[];
  filteredPatterns: TeamPattern[];
  playedKeys: Set<string>;
  activeTab: TabType;
  unplayedCount: number;
  playedCount: number;
  fixedMembers: Record<string, number>;
  getTeamName: (i: number) => string;
  onTabChange: (tab: TabType) => void;
  onCopy: (pattern: TeamPattern) => void;
  onTogglePlay: (pattern: TeamPattern) => void;
}

export function PatternList({
  filteredPatterns,
  playedKeys,
  activeTab,
  unplayedCount,
  playedCount,
  fixedMembers,
  getTeamName,
  onTabChange,
  onCopy,
  onTogglePlay,
}: PatternListProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">

      {/* タブバー（スクロール追従）。モバイルは上部ヘッダー(lg:hidden)の高さ分だけ下げる */}
      <div className="sticky top-14 lg:top-0 z-30 py-3 -mx-4 px-4 md:-mx-8 md:px-8"
        style={{ background: ck.text.onDark }}>
        <div className="flex gap-2 p-1.5"
          style={{ background: ck.bg.muted, border: `1px solid ${ck.border.default}` }}>
          <button
            onClick={() => onTabChange('unplayed')}
            className="flex-1 font-black text-sm h-10 transition-all"
            style={activeTab === 'unplayed' ? {
              background: ck.text.onDark, color: ck.text.primary,
              boxShadow: '0 2px 8px rgba(var(--ck-ink-rgb), 0.15)',
            } : { color: ck.text.muted }}
          >
            {t('patternList.unplayed', { count: unplayedCount })}
          </button>
          <button
            onClick={() => onTabChange('played')}
            className="flex-1 font-black text-sm h-10 transition-all"
            style={activeTab === 'played' ? {
              background: ck.text.onDark, color: ck.text.primary,
              boxShadow: '0 2px 8px rgba(5,150,105,0.15)',
            } : { color: ck.text.muted }}
          >
            {t('patternList.played', { count: playedCount })}
          </button>
        </div>
      </div>

      {/* パターンリスト */}
      <div className="space-y-10">
        {filteredPatterns.length === 0 ? (
          <div className="text-center py-12 text-sm font-bold opacity-40"
            style={{ border: `1px dashed ${ck.border.default}` }}>
            {activeTab === 'played'
              ? t('patternList.emptyPlayed')
              : t('patternList.emptyUnplayed')}
          </div>
        ) : (
          filteredPatterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              isPlayed={playedKeys.has(JSON.stringify(pattern.teams))}
              fixedMembers={fixedMembers}
              getTeamName={getTeamName}
              onCopy={() => onCopy(pattern)}
              onTogglePlay={() => onTogglePlay(pattern)}
            />
          ))
        )}
      </div>
    </div>
  );
}
