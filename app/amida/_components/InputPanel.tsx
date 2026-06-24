import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';

interface InputPanelProps {
  playersText: string;
  players: string[];
  resultsText: string;
  resultCount: number;
  winCount: number;
  onPlayersChange: (v: string) => void;
  onResultsChange: (v: string) => void;
  onWinCountChange: (n: number) => void;
  onGenerate: () => void;
}

export function InputPanel({
  playersText, players, resultsText, resultCount,
  winCount, onPlayersChange, onResultsChange, onWinCountChange, onGenerate,
}: InputPanelProps) {
  const { t } = useTranslation();
  const playerCount = players.length;
  const isValid     = playerCount >= 2 && playerCount === resultCount;

  return (
    <div className="flex flex-col gap-4">

      {/* 参加者・結果 横並び */}
      <div className="grid grid-cols-2 gap-4 items-stretch">

        {/* 参加者 */}
        <div className="ck-section flex flex-col gap-2 ck-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
              <span className="ck-gradient-text">①</span> {t('amidaInput.players')}
            </h3>
            <span className="ck-badge">{t('amidaInput.playersCount', { count: playerCount })}</span>
          </div>
          <textarea
            className="ck-textarea flex-1 w-full p-3 font-medium text-sm"
            style={{ minHeight: 240 }}
            placeholder={t('amidaInput.playersPlaceholder')}
            value={playersText}
            onChange={(e) => onPlayersChange(e.target.value)}
          />
        </div>

        {/* 結果 */}
        <div className="ck-section flex flex-col gap-2 ck-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
            <span className="ck-gradient-text">②</span> {t('amidaInput.results')}
          </h3>
          <textarea
            className="ck-textarea flex-1 w-full p-3 font-medium text-sm"
            style={{ minHeight: 240 }}
            placeholder={t('amidaInput.resultsPlaceholder')}
            value={resultsText}
            onChange={(e) => onResultsChange(e.target.value)}
          />
        </div>
      </div>

      {/* 当たりの数（全幅） */}
      <div className="ck-section flex items-center gap-3 ck-slide-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">③</span> {t('amidaInput.winCount')}
        </h3>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => onWinCountChange(winCount - 1)}
            disabled={winCount <= 1}
            className="ck-btn ck-btn-ghost w-9 h-9 flex items-center justify-center text-lg disabled:opacity-30"
          >−</button>
          <span className="w-8 text-center font-black text-lg ck-gradient-text">{winCount}</span>
          <button
            onClick={() => onWinCountChange(winCount + 1)}
            disabled={winCount >= playerCount - 1 || playerCount < 2}
            className="ck-btn ck-btn-ghost w-9 h-9 flex items-center justify-center text-lg disabled:opacity-30"
          >＋</button>
        </div>
      </div>

      {/* バリデーション */}
      {playerCount > 0 && resultCount > 0 && playerCount !== resultCount && (
        <p className="text-center text-sm font-semibold" style={{ color: ck.text.primary }}>
          {t('amidaInput.errorCountMismatch', { playerCount, resultCount })}
        </p>
      )}
      {playerCount === 1 && (
        <p className="text-center text-sm font-semibold" style={{ color: ck.text.primary }}>
          {t('amidaInput.errorMinPlayers')}
        </p>
      )}

      {/* あみだを作るボタン */}
      <div className="mt-1">
        <button
          onClick={onGenerate}
          disabled={!isValid}
          className="ck-btn ck-btn-primary w-full text-xl h-14 tracking-widest disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {t('amidaInput.generate')}
        </button>
      </div>
    </div>
  );
}
