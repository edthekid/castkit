'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { IconCopy, IconRefresh, IconArrowUp } from '../../_components/icons';
import { type DesignMode, type SortMode, DESIGN_MODES, FONTS, MIN_TEAMS, MAX_TEAMS } from '../_constants';

interface ControlPanelProps {
  designMode: DesignMode;
  showRank: boolean;
  sortMode: SortMode;
  fontId: string;
  bulkAmount: string;
  teamCount: number;
  onDesignMode: (mode: DesignMode) => void;
  onToggleRank: (next: boolean) => void;
  onFont: (id: string) => void;
  onBulkAmount: (value: string) => void;
  onTeamCount: (count: number) => void;
  onToggleSort: () => void;
  onRecord: () => void;
  onCopy: () => void;
  onReset: () => void;
  onResetAll: () => void;
}

export function ControlPanel({
  designMode, showRank, sortMode, fontId, bulkAmount, teamCount,
  onDesignMode, onToggleRank, onFont, onBulkAmount, onTeamCount,
  onToggleSort, onRecord, onCopy, onReset, onResetAll,
}: ControlPanelProps) {
  const { t } = useTranslation();
  const fontDisabled = designMode === 'segment';

  const designLabel: Record<DesignMode, string> = {
    segment: t('scoreboard.design.segment'),
    minimal: t('scoreboard.design.minimal'),
    card:    t('scoreboard.design.card'),
  };

  return (
    <div className="ck-section flex flex-col gap-5 mb-8">
      {/* チーム数 */}
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs font-black tracking-widest uppercase text-ck-subtle">{t('scoreboard.teamCount')}</span>
        <div className="flex items-center gap-2">
          <button
            className="ck-btn ck-btn-ghost w-8 h-8 text-lg font-black disabled:opacity-30"
            onClick={() => onTeamCount(teamCount - 1)}
            disabled={teamCount <= MIN_TEAMS}
            aria-label={t('scoreboard.removeTeam')}
          >
            −
          </button>
          <span className="w-6 text-center text-base font-black tabular-nums text-ck-ink">{teamCount}</span>
          <button
            className="ck-btn ck-btn-ghost w-8 h-8 text-lg font-black disabled:opacity-30"
            onClick={() => onTeamCount(teamCount + 1)}
            disabled={teamCount >= MAX_TEAMS}
            aria-label={t('scoreboard.addTeam')}
          >
            +
          </button>
        </div>
      </div>

      {/* 順位表示トグル（チーム数の下） */}
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs font-black tracking-widest uppercase text-ck-subtle">{t('scoreboard.showRank')}</span>
        <button
          className="flex items-center"
          onClick={() => onToggleRank(!showRank)}
          aria-pressed={showRank}
          aria-label={t('scoreboard.showRank')}
        >
          <span
            className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors"
            style={{ background: showRank ? 'var(--ck-text-primary)' : 'var(--ck-border-strong)' }}
          >
            <span
              className="absolute w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: showRank ? 'translateX(20px)' : 'translateX(2px)' }}
            />
          </span>
        </button>
      </div>

      {/* デザインモード切替 */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="w-20 text-xs font-black tracking-widest uppercase text-ck-subtle">{t('scoreboard.designMode')}</span>
        <div className="inline-flex border border-ck-line-bold">
          {DESIGN_MODES.map((mode) => {
            const active = mode === designMode;
            return (
              <button
                key={mode}
                onClick={() => onDesignMode(mode)}
                aria-pressed={active}
                className="px-3 py-1.5 text-xs font-black transition-colors"
                style={{
                  background: active ? 'var(--ck-text-primary)' : 'transparent',
                  color: active ? 'var(--ck-text-on-dark)' : 'var(--ck-text-secondary)',
                }}
              >
                {designLabel[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* フォント選択（デザインの下。ミニマル/カードのみ反映。7セグでは非活性） */}
      <div className="flex items-center gap-3">
        <span className={`w-20 text-xs font-black tracking-widest uppercase ${fontDisabled ? 'text-ck-muted' : 'text-ck-subtle'}`}>
          {t('scoreboard.font')}
        </span>
        <select
          value={fontId}
          onChange={(e) => onFont(e.target.value)}
          disabled={fontDisabled}
          className="ck-input px-2 py-1.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={t('scoreboard.font')}
          title={fontDisabled ? t('scoreboard.fontSegmentNote') : undefined}
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id} style={{ fontFamily: f.stack || undefined }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* スコア増減値の一括設定（フォントの下）。変更すると全チームの増減値に反映 */}
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs font-black tracking-widest uppercase text-ck-subtle leading-tight">{t('scoreboard.bulkAmount')}</span>
        <input
          type="text"
          inputMode="numeric"
          value={bulkAmount}
          onChange={(e) => onBulkAmount(e.target.value.replace(/\D/g, ''))}
          className="ck-input w-20 px-2 py-1.5 text-center text-sm font-bold"
          aria-label={t('scoreboard.bulkAmount')}
        />
      </div>

      {/* アクション（モバイルは2列グリッド、5つ目は全幅。sm以上は横並び） */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          className="ck-btn ck-btn-ghost flex items-center justify-center gap-1.5 px-3 py-2 text-sm"
          onClick={onToggleSort}
          aria-pressed={sortMode === 'score'}
        >
          <IconArrowUp size={16} /> {sortMode === 'default' ? t('scoreboard.sort') : t('scoreboard.sortDefault')}
        </button>
        <button className="ck-btn ck-btn-ghost flex items-center justify-center gap-1.5 px-3 py-2 text-sm" onClick={onRecord}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--ck-series-1)' }} aria-hidden="true" /> {t('scoreboard.record')}
        </button>
        <button className="ck-btn ck-btn-ghost flex items-center justify-center gap-1.5 px-3 py-2 text-sm" onClick={onCopy}>
          <IconCopy size={16} /> {t('scoreboard.copy')}
        </button>
        <button className="ck-btn ck-btn-ghost flex items-center justify-center gap-1.5 px-3 py-2 text-sm" onClick={onReset}>
          <IconRefresh size={16} /> {t('scoreboard.reset')}
        </button>
        <button className="ck-btn ck-btn-ghost flex items-center justify-center gap-1.5 px-3 py-2 text-sm col-span-2 sm:col-span-1" onClick={onResetAll}>
          <IconRefresh size={16} /> {t('scoreboard.resetAll')}
        </button>
      </div>
    </div>
  );
}
