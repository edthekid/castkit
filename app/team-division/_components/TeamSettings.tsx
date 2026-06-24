import { MIN_TEAM_COUNT, MAX_TEAM_COUNT, TEAM_COLORS } from '../_constants';
import { useTranslation } from '../../_i18n/useTranslation';

interface TeamSettingsProps {
  teamCount: number;
  teamNames: Record<number, string>;
  onTeamCountChange: (count: number) => void;
  onTeamNameChange: (index: number, val: string) => void;
  getTeamName: (index: number) => string;
}

export function TeamSettings({
  teamCount,
  teamNames,
  onTeamCountChange,
  onTeamNameChange,
  getTeamName,
}: TeamSettingsProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* チーム数 */}
      <div className="ck-section mb-4 ck-slide-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="font-black text-sm tracking-wide mb-3 flex items-center gap-2">
          <span className="ck-gradient-text">②</span> {t('teamSettings.countTitle')}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTeamCountChange(Math.max(MIN_TEAM_COUNT, teamCount - 1))}
            className="ck-btn ck-btn-ghost w-10 h-10 flex items-center justify-center text-lg"
          >−</button>
          <input
            type="number"
            min={MIN_TEAM_COUNT}
            max={MAX_TEAM_COUNT}
            className="ck-input flex-1 text-center font-black text-lg py-2"
            value={teamCount}
            onChange={(e) => onTeamCountChange(Number(e.target.value))}
          />
          <button
            onClick={() => onTeamCountChange(Math.min(MAX_TEAM_COUNT, teamCount + 1))}
            className="ck-btn ck-btn-ghost w-10 h-10 flex items-center justify-center text-lg"
          >＋</button>
        </div>
      </div>

      {/* チーム名変更 */}
      <div className="ck-section mb-4 ck-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-black text-sm tracking-wide mb-3 flex items-center gap-2">
          <span className="ck-gradient-text">③</span> {t('teamSettings.namesTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: teamCount }).map((_, idx) => {
            const color = TEAM_COLORS[idx % TEAM_COLORS.length];
            return (
              <div key={idx} className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
                />
                <input
                  type="text"
                  placeholder={t('teamSettings.namePlaceholder', { n: idx + 1 })}
                  className="ck-input w-full pl-7 py-2 text-sm font-semibold"
                  value={teamNames[idx] || ''}
                  onChange={(e) => onTeamNameChange(idx, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
