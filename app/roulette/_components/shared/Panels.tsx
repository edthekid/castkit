'use client';

import type { DesignType } from '../../_constants';
import { useTranslation } from '../../../_i18n/useTranslation';
import { ck } from '../../../_theme/colors';
import { IconWheel, IconSlot, IconUndo } from '../../../_components/icons';

// ─── デザイン切り替えタブ ────────────────────────────────
interface DesignTabsProps {
  current: DesignType;
  isSpinning: boolean;
  onChange: (d: DesignType) => void;
}

export function DesignTabs({ current, isSpinning, onChange }: DesignTabsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center">
      <div className="flex gap-2 p-1.5"
        style={{ background: ck.bg.muted, border: '1px solid #e4e4e7' }}>
        {([1, 2] as const).map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            disabled={isSpinning}
            className="flex items-center gap-2 font-black text-sm h-10 px-6 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={current === d ? {
              background: ck.text.onDark, color: ck.text.primary,
              boxShadow: '0 2px 8px rgba(17,17,20, 0.15)',
            } : { color: ck.text.muted }}
          >
            {d === 1 ? <IconWheel size={16} /> : <IconSlot size={16} />}
            {d === 1 ? t('roulette.tabWheel') : t('roulette.tabSlot')}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 候補者リスト ────────────────────────────────────────
interface CandidatePanelProps {
  inputText: string;
  count: number;
  autoMove: boolean;
  onTextChange: (text: string) => void;
  onAutoMoveChange: (v: boolean) => void;
}

export function CandidatePanel({
  inputText, count, autoMove, onTextChange, onAutoMoveChange,
}: CandidatePanelProps) {
  const { t } = useTranslation();
  return (
    <div className="ck-section ck-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">①</span> {t('candidatePanel.title')}
        </h3>
        <div className="flex items-center gap-3">
          <span className="ck-badge">{t('candidatePanel.count', { count })}</span>
          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none" style={{ color: ck.text.secondary }}>
            <input
              type="checkbox"
              className="sr-only"
              checked={autoMove}
              onChange={(e) => onAutoMoveChange(e.target.checked)}
            />
            <span
              className="flex items-center justify-center w-4 h-4 shrink-0"
              style={{
                border: `1.5px solid ${autoMove ? ck.text.primary : ck.border.strong}`,
                background: autoMove ? ck.text.primary : 'transparent',
              }}
            >
              {autoMove && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke={ck.text.onDark} strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              )}
            </span>
            {t('candidatePanel.autoMove')}
          </label>
        </div>
      </div>
      <textarea
        className="ck-textarea w-full h-48 p-3 font-medium text-sm"
        placeholder={t('candidatePanel.placeholder')}
        value={inputText}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </div>
  );
}

// ─── 当選者リスト ────────────────────────────────────────
interface WinnersPanelProps {
  winners: string[];
  onReturnOne: (i: number) => void;
  onReturnAll: () => void;
}

export function WinnersPanel({ winners, onReturnOne, onReturnAll }: WinnersPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="ck-section ck-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">②</span> {t('winnersPanel.title')}
        </h3>
        <div className="flex items-center gap-2">
          <span className="ck-badge">{t('winnersPanel.count', { count: winners.length })}</span>
          <button
            onClick={onReturnAll}
            className="ck-btn text-xs px-3 py-1.5"
            style={{ background: ck.bg.muted, color: ck.accent.default, border: '1px solid #e4e4e7' }}
          >
            {t('winnersPanel.returnAll')}
          </button>
        </div>
      </div>
      <div className="h-48 overflow-y-auto flex flex-col gap-2">
        {winners.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm opacity-40 font-bold">
            {t('winnersPanel.empty')}
          </div>
        ) : (
          winners.map((item, i) => (
            <div key={i}
              className="flex items-center justify-between px-3 py-2 text-sm font-bold"
              style={{ background: ck.text.onDark, border: '1px solid #e4e4e7' }}>
              <span>{item}</span>
              <button
                onClick={() => onReturnOne(i)}
                className="opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: ck.text.primary }}
              >
                <IconUndo size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
