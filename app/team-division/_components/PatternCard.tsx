import type { TeamPattern } from '../_constants';
import { sortTeamMembers, getTeamColor } from '../_utils';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconCopy, IconUndo, IconCheck } from '../../_components/icons';

interface PatternCardProps {
  pattern: TeamPattern;
  isPlayed: boolean;
  fixedMembers: Record<string, number>;
  getTeamName: (i: number) => string;
  onCopy: () => void;
  onTogglePlay: () => void;
}

export function PatternCard({
  pattern,
  isPlayed,
  fixedMembers,
  getTeamName,
  onCopy,
  onTogglePlay,
}: PatternCardProps) {
  const { t } = useTranslation();
  return (
    <div className="ck-fade-in" style={{
      borderTop: `1px dashed ${ck.border.default}`,
      paddingTop: 24,
    }}>

      {/* ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center flex-wrap gap-2">
          <div className="ck-badge text-sm px-4 py-1.5">{pattern.patternName}</div>

          <button
            onClick={onCopy}
            className="ck-btn ck-btn-ghost text-xs px-4 py-1.5 flex items-center gap-1.5"
          >
            <IconCopy size={13} />{t('patternCard.copy')}
          </button>

          <button
            onClick={onTogglePlay}
            className="ck-btn ck-btn-ghost text-xs px-4 py-1.5 flex items-center gap-1.5"
          >
            {isPlayed ? <IconUndo size={13} /> : <IconCheck size={13} />}
            {isPlayed ? t('patternCard.markUnplayed') : t('patternCard.markPlayed')}
          </button>
        </div>
      </div>

      {/* チームカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pattern.teams.map((teamMembers, teamIndex) => {
          const sorted = sortTeamMembers(teamMembers, teamIndex, fixedMembers);
          const color  = getTeamColor(teamIndex);
          return (
            <div
              key={teamIndex}
              className="overflow-hidden"
              style={{ border: `1px solid ${color}30`, background: ck.text.onDark }}
            >
              <div className="px-4 py-3 flex items-center gap-2"
                style={{ background: `${color}10`, borderBottom: `1px solid ${color}20` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
                <span className="font-black text-sm" style={{ color }}>
                  {getTeamName(teamIndex)}
                </span>
                <span className="opacity-40 font-medium text-xs ml-auto">{t('patternCard.memberCount', { count: teamMembers.length })}</span>
              </div>

              <div className="divide-y" style={{ borderColor: ck.bg.muted }}>
                {sorted.map((member, i) => {
                  const isFixed = fixedMembers[member] === teamIndex;
                  return (
                    <div
                      key={i}
                      className="flex items-center px-4 py-2.5 text-sm font-bold"
                      style={isFixed ? {
                        background: `${color}08`,
                        borderLeft: `3px solid ${color}`,
                        color: ck.text.primary,
                      } : { color: ck.text.secondary }}
                    >
                      <span className="truncate flex-1">{member}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
