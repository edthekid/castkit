'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconDice } from '../../_components/icons';
import {
  type DiceMode,
  type RollPhase,
  BASIC_SIDES,
  TRPG_SIDES,
  TRPG_PRESETS,
  MIN_DICE,
  MAX_DICE,
  D100,
} from '../_constants';
import { notation } from '../_utils';

interface DiceControlsProps {
  mode: DiceMode;
  setMode: (m: DiceMode) => void;
  count: number;
  incDie: () => void;
  decDie: () => void;
  sides: number;
  setSides: (s: number) => void;
  setPreset: (count: number, sides: number) => void;
  isD100: boolean;
  phase: RollPhase;
  onRoll: () => void;
}

const dieLabel = (s: number) => (s === D100 ? 'd100' : `d${s}`);

export function DiceControls({
  mode, setMode, count, incDie, decDie, sides, setSides, setPreset, isD100, phase, onRoll,
}: DiceControlsProps) {
  const { t } = useTranslation();
  const sidesOptions = mode === 'trpg' ? TRPG_SIDES : BASIC_SIDES;
  const rolling = phase === 'rolling';

  return (
    <div className="ck-section flex flex-col gap-5">
      {/* モード切替 */}
      <div className="flex gap-2" role="group" aria-label={t('dice.mode.basic')}>
        {(['basic', 'trpg'] as DiceMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className="ck-btn flex-1 text-sm font-black py-2"
            style={{
              background: mode === m ? ck.text.primary : ck.bg.muted,
              color:      mode === m ? ck.text.onDark  : ck.text.primary,
              border: `1.5px solid ${mode === m ? ck.text.primary : ck.border.default}`,
            }}
          >
            {m === 'basic' ? t('dice.mode.basic') : t('dice.mode.trpg')}
          </button>
        ))}
      </div>

      {/* サイコロの数 */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('dice.diceCount')}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decDie}
            disabled={count <= MIN_DICE}
            aria-label={t('dice.removeDie')}
            className="ck-btn w-9 h-9 text-lg font-black leading-none disabled:opacity-30"
            style={{ border: `1.5px solid ${ck.border.default}`, background: ck.bg.muted, color: ck.text.primary }}
          >
            −
          </button>
          <span className="w-8 text-center text-xl font-black tabular-nums" style={{ color: ck.text.primary }}>
            {count}
          </span>
          <button
            type="button"
            onClick={incDie}
            disabled={count >= MAX_DICE}
            aria-label={t('dice.addDie')}
            className="ck-btn w-9 h-9 text-lg font-black leading-none disabled:opacity-30"
            style={{ border: `1.5px solid ${ck.border.default}`, background: ck.bg.muted, color: ck.text.primary }}
          >
            +
          </button>
        </div>
      </div>

      {/* TRPGクイックプリセット（ダイスセット） */}
      {mode === 'trpg' && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
            {t('dice.trpgPreset')}
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('dice.trpgPreset')}>
            {TRPG_PRESETS.map((p) => {
              const active = count === p.count && sides === p.sides;
              return (
                <button
                  key={`${p.count}d${p.sides}`}
                  type="button"
                  onClick={() => setPreset(p.count, p.sides)}
                  aria-pressed={active}
                  className="ck-btn text-sm font-black px-3 py-1.5"
                  style={{
                    background: active ? ck.text.primary : ck.bg.muted,
                    color:      active ? ck.text.onDark  : ck.text.primary,
                    border: `1.5px solid ${active ? ck.text.primary : ck.border.default}`,
                  }}
                >
                  {notation(p.count, p.sides)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 面数 / ダイス種別 */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('dice.sides')}
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('dice.sides')}>
          {sidesOptions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSides(s)}
              aria-pressed={sides === s}
              className="ck-btn text-sm font-black px-3 py-1.5 min-w-[3rem]"
              style={{
                background: sides === s ? ck.text.primary : ck.bg.muted,
                color:      sides === s ? ck.text.onDark  : ck.text.primary,
                border: `1.5px solid ${sides === s ? ck.text.primary : ck.border.default}`,
              }}
            >
              {dieLabel(s)}
            </button>
          ))}
        </div>
        {mode === 'trpg' && <p className="text-xs" style={{ color: ck.text.muted }}>{t('dice.trpgHint')}</p>}
        {isD100 && <p className="text-xs font-bold" style={{ color: ck.text.secondary }}>{t('dice.d100Note')}</p>}
      </div>

      {/* ロールボタン */}
      <button
        type="button"
        onClick={onRoll}
        disabled={rolling}
        aria-label={t('dice.rollAria')}
        className="ck-btn ck-btn-primary w-full text-base h-14 tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <IconDice size={20} aria-hidden="true" />
        <span>{rolling ? t('dice.rolling') : t('dice.roll')}</span>
        <span className="text-xs font-bold opacity-70 tabular-nums">{notation(count, sides)}</span>
      </button>
    </div>
  );
}
