'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import { IconUndo } from '../../_components/icons';
import { ScoreDisplay } from './ScoreDisplay';
import { type Team, type DesignMode, TEAM_COLORS } from '../_constants';

interface TeamControlProps {
  team: Team;
  displayName: string;
  rank: number | null; // 1始まりの順位（順位表示OFFなら null）
  mode: DesignMode;
  bumped: boolean;
  canUndo: boolean;
  fontStack: string;
  /** このチームのスコア増減値（文字列。一括設定 or 個別上書き） */
  amount: string;
  onRename: (id: string, name: string) => void;
  onRecolor: (id: string, color: string) => void;
  onChangeScore: (id: string, delta: number) => void;
  onSetScore: (id: string, value: number) => void;
  onAmountChange: (id: string, value: string) => void;
  onUndo: (id: string) => void;
}

export function TeamControl({
  team, displayName, rank, mode, bumped, canUndo, fontStack, amount: amountStr,
  onRename, onRecolor, onChangeScore, onSetScore, onAmountChange, onUndo,
}: TeamControlProps) {
  const { t } = useTranslation();

  const [editingName, setEditingName]   = useState(false);
  const [editingScore, setEditingScore] = useState(false);
  const [scoreDraft, setScoreDraft]     = useState('');
  const [paletteOpen, setPaletteOpen]   = useState(false);
  const [hexDraft, setHexDraft]         = useState(team.color);
  const [lastColor, setLastColor]       = useState(team.color);

  // 外部からの色変更（プリセット/カラーピッカー）にカラーコード入力欄を追従させる。
  // レンダリング中の state 調整（React 推奨パターン。同期用 effect を避ける）。
  if (team.color !== lastColor) {
    setLastColor(team.color);
    setHexDraft(team.color);
  }

  const scoreInputRef = useRef<HTMLInputElement>(null);

  // 直接入力に入ったらフォーカス＋全選択（操作に不慣れでも迷わないように）
  useEffect(() => {
    if (editingScore && scoreInputRef.current) {
      scoreInputRef.current.focus();
      scoreInputRef.current.select();
    }
  }, [editingScore]);

  const startScoreEdit = () => {
    setScoreDraft(String(team.score));
    setEditingScore(true);
  };
  const commitScoreEdit = () => {
    const parsed = parseInt(scoreDraft, 10);
    if (!Number.isNaN(parsed)) onSetScore(team.id, parsed);
    setEditingScore(false);
  };

  // 数値のみ許可（先頭の負号は得点欄のみ可、カスタム加減算は正の整数）
  const sanitizeScore  = (v: string) => v.replace(/[^\d-]/g, '').replace(/(?!^)-/g, '');
  const sanitizeAmount = (v: string) => v.replace(/\D/g, '');

  // カラーコード（#RRGGBB）から色を適用。無効なら現在色に戻す。
  const applyHex = () => {
    const v = hexDraft.trim().replace(/^#?/, '#');
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onRecolor(team.id, v.toLowerCase());
    else setHexDraft(team.color);
  };

  const amount = Math.max(1, parseInt(amountStr, 10) || 1);

  return (
    <div
      className="ck-card p-4 flex flex-col gap-3"
      style={{ borderTop: `4px solid ${team.color}` }}
    >
      {/* チーム名 + 順位 + カラー */}
      <div className="flex items-center gap-2 min-h-8">
        {rank !== null && (
          <span
            className="shrink-0 inline-flex items-center justify-center w-6 h-6 text-xs font-black text-white tabular-nums"
            style={{ background: team.color }}
            aria-label={t('scoreboard.rankLabel', { n: rank })}
          >
            {rank}
          </span>
        )}

        {editingName ? (
          <input
            autoFocus
            className="ck-input flex-1 min-w-0 px-2 py-1 text-sm font-bold"
            value={team.name}
            placeholder={displayName}
            onChange={(e) => onRename(team.id, e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingName(false); }}
          />
        ) : (
          <button
            className="flex-1 min-w-0 text-left text-sm font-black text-ck-ink truncate hover:text-ck-body transition-colors"
            onClick={() => setEditingName(true)}
            title={t('scoreboard.editName')}
          >
            {displayName}
          </button>
        )}

        <button
          className="shrink-0 w-6 h-6 rounded-full border border-ck-line"
          style={{ background: team.color }}
          onClick={() => setPaletteOpen((o) => !o)}
          aria-label={t('scoreboard.pickColor')}
          aria-expanded={paletteOpen}
        />
      </div>

      {/* カラーパレット（プリセット + 自由な色 + カラーコード） */}
      {paletteOpen && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {TEAM_COLORS.map((c) => (
              <button
                key={c}
                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{ background: c, borderColor: c === team.color ? 'var(--ck-text-primary)' : 'transparent' }}
                onClick={() => onRecolor(team.id, c)}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* カラーピッカー（自由な色を選ぶ） */}
            <input
              type="color"
              value={team.color}
              onChange={(e) => onRecolor(team.id, e.target.value)}
              className="w-8 h-8 p-0 border border-ck-line cursor-pointer bg-transparent"
              aria-label={t('scoreboard.customColor')}
            />
            {/* カラーコード入力 */}
            <input
              type="text"
              value={hexDraft}
              onChange={(e) => setHexDraft(e.target.value)}
              onBlur={applyHex}
              onKeyDown={(e) => { if (e.key === 'Enter') applyHex(); }}
              placeholder="#RRGGBB"
              spellCheck={false}
              className="ck-input w-28 px-2 py-1 text-sm font-mono"
              aria-label={t('scoreboard.colorCode')}
            />
          </div>
        </div>
      )}

      {/* 得点表示 / 直接入力（ダブルクリック） */}
      {editingScore ? (
        <input
          ref={scoreInputRef}
          type="text"
          inputMode="numeric"
          className="ck-input w-full py-3 text-center font-black tabular-nums"
          style={{ fontSize: 'clamp(2rem, 9vw, 3.5rem)' }}
          value={scoreDraft}
          onChange={(e) => setScoreDraft(sanitizeScore(e.target.value))}
          onBlur={commitScoreEdit}
          onKeyDown={(e) => { if (e.key === 'Enter') commitScoreEdit(); }}
        />
      ) : (
        <div
          onDoubleClick={startScoreEdit}
          className="cursor-pointer select-none"
          title={t('scoreboard.doubleClickHint')}
        >
          <ScoreDisplay score={team.score} color={team.color} mode={mode} bump={bumped} fontStack={fontStack} />
        </div>
      )}

      {/* カスタム加算・減算（デフォルト 1） */}
      <div className="flex items-center gap-1.5">
        <button
          className="ck-btn ck-btn-ghost flex-1 py-2.5 text-lg font-black"
          onClick={() => onChangeScore(team.id, -amount)}
          aria-label={t('scoreboard.subtractPoints', { name: displayName, amount })}
        >
          −{amount}
        </button>
        <input
          type="text"
          inputMode="numeric"
          className="ck-input w-16 px-1 py-2.5 text-center text-base font-bold"
          value={amountStr}
          onChange={(e) => onAmountChange(team.id, sanitizeAmount(e.target.value))}
          aria-label={t('scoreboard.customAmount')}
        />
        <button
          className="ck-btn ck-btn-primary flex-1 py-2.5 text-lg font-black"
          onClick={() => onChangeScore(team.id, amount)}
          aria-label={t('scoreboard.addPoints', { name: displayName, amount })}
        >
          +{amount}
        </button>
      </div>

      {/* チームごとの「1つ戻る」 */}
      <button
        className="ck-btn ck-btn-ghost flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold disabled:opacity-30"
        onClick={() => onUndo(team.id)}
        disabled={!canUndo}
        aria-label={t('scoreboard.undoTeam', { name: displayName })}
      >
        <IconUndo size={14} /> {t('scoreboard.undoOne')}
      </button>
    </div>
  );
}
