import { getTeamColor } from '../_utils';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';

interface MemberFixPanelProps {
  members: string[];
  teamCount: number;
  fixedMembers: Record<string, number>;
  teamNames: Record<number, string>;
  getTeamName: (index: number) => string;
  onToggle: (member: string) => void;
}

export function MemberFixPanel({
  members,
  teamCount,
  fixedMembers,
  teamNames,
  getTeamName,
  onToggle,
}: MemberFixPanelProps) {
  if (members.length === 0) return null;

  const { t } = useTranslation();
  return (
    <div className="ck-section ck-slide-up" style={{ animationDelay: '0.15s' }}>
      <h3 className="font-black text-sm tracking-wide mb-1 flex items-center gap-2">
        <span className="ck-gradient-text">④</span> {t('memberFix.title')}
      </h3>
      <p className="text-xs text-ck-muted mb-4 font-medium">
        {t('memberFix.subtitle')}
      </p>

      {/* 色ガイド */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 text-xs font-bold"
        style={{ background: ck.bg.card, border: `1px solid ${ck.border.default}` }}>
        <span className="flex items-center gap-1 opacity-50">{t('memberFix.colorGuide')}</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: ck.border.default }} />
          {t('memberFix.noFix')}
        </span>
        {Array.from({ length: teamCount }).map((_, idx) => {
          const color = getTeamColor(idx);
          return (
            <span key={idx} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
              {getTeamName(idx)}
            </span>
          );
        })}
      </div>

      {/* メンバーチップ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {members.map((member) => {
          const teamIdx = fixedMembers[member];
          const isFixed = teamIdx !== undefined;
          const color   = isFixed ? getTeamColor(teamIdx) : null;
          return (
            <button
              key={member}
              onClick={() => onToggle(member)}
              className="ck-chip w-full justify-start flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                background: isFixed ? `${color}15` : ck.bg.card,
                borderColor: isFixed ? `${color}60` : ck.border.default,
                color: isFixed ? color! : ck.text.secondary,
              }}
            >
              <span className="truncate flex-1 text-left">{member}</span>
              {isFixed && (
                <span className="text-[10px] uppercase opacity-85 shrink-0 font-black max-w-[45px] truncate">
                  {teamNames[teamIdx]?.trim()
                    ? teamNames[teamIdx].substring(0, 3)
                    : t('memberFix.tag', { n: teamIdx + 1 })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
