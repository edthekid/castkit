'use client';

import { useState } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import type { TranslationKey } from '../../_i18n/translations';
import { ck } from '../../_theme/colors';
import { IconDice } from '../../_components/icons';
import {
  type DiceMode,
  type RollPhase,
  TRPG_PRESETS,
  MIN_DICE,
  MAX_DICE,
  MIN_SIDES,
  MAX_SIDES,
} from '../_constants';
import { type ChinchiroTurn, CHINCHIRO_MAX_ROLLS } from '../_chinchiro';
import { notation } from '../_utils';

interface DiceControlsProps {
  mode: DiceMode;
  setMode: (m: DiceMode) => void;
  count: number;
  setCount: (n: number) => void;
  sides: number;
  setSides: (n: number) => void;
  setPreset: (count: number, sides: number) => void;
  isD100: boolean;
  phase: RollPhase;
  onRoll: () => void;
  chinchiroTurn: ChinchiroTurn;
}

const MODES: DiceMode[] = ['basic', 'trpg', 'chinchiro'];
const MODE_LABEL: Record<DiceMode, TranslationKey> = {
  basic: 'dice.mode.basic',
  trpg: 'dice.mode.trpg',
  chinchiro: 'dice.mode.chinchiro',
};

// チンチロの役と倍率（強い順）。pip=true は倍率が「目の数」で可変、loss=true は敗北役。
const CHINCHIRO_LEGEND: { name: TranslationKey; mult?: number; pip?: boolean; loss?: boolean }[] = [
  { name: 'dice.chinchiro.legendPinzoro', mult: 3 },
  { name: 'dice.chinchiro.legendZorome',  mult: 3 },
  { name: 'dice.chinchiro.legendShigoro', mult: 2 },
  { name: 'dice.chinchiro.legendNormal',  pip: true },
  { name: 'dice.chinchiro.legendHifumi',  mult: 1, loss: true },
  { name: 'dice.chinchiro.legendMenashi', mult: 0, loss: true },
];

// ─── 数値入力ステッパー（− [入力] +） ───────────────────
function NumberStepper({
  value, min, max, onChange, ariaLabel, ariaDec, ariaInc,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  ariaLabel: string;
  ariaDec: string;
  ariaInc: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const [last, setLast]   = useState(value);

  // 外部からの変更（プリセット等）に入力欄を追従（レンダリング中の state 調整）。
  if (value !== last) {
    setLast(value);
    setDraft(String(value));
  }

  const commit = () => {
    const n = parseInt(draft, 10);
    if (Number.isFinite(n)) onChange(n);
    else setDraft(String(value));
  };

  const btnStyle = { border: `1.5px solid ${ck.border.default}`, background: ck.bg.muted, color: ck.text.primary };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={ariaDec}
        className="ck-btn w-9 h-9 text-lg font-black leading-none disabled:opacity-30"
        style={btnStyle}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={draft}
        min={min}
        max={max}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { commit(); e.currentTarget.blur(); } }}
        aria-label={ariaLabel}
        className="w-16 h-9 text-center text-lg font-black tabular-nums outline-none"
        style={{ border: `1.5px solid ${ck.border.default}`, background: ck.bg.page, color: ck.text.primary }}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={ariaInc}
        className="ck-btn w-9 h-9 text-lg font-black leading-none disabled:opacity-30"
        style={btnStyle}
      >
        +
      </button>
    </div>
  );
}

export function DiceControls({
  mode, setMode, count, setCount, sides, setSides, setPreset, isD100, phase, onRoll, chinchiroTurn,
}: DiceControlsProps) {
  const { t } = useTranslation();
  const rolling = phase === 'rolling';
  const isChin = mode === 'chinchiro';

  // チンチロのロールボタン表示（振る / 振り直す / もう一度）とサブラベル。
  const rollsLeft = CHINCHIRO_MAX_ROLLS - chinchiroTurn.rollsUsed;
  let mainLabel = t('dice.roll');
  let subLabel = notation(count, sides);
  if (isChin) {
    subLabel = `3d6`;
    if (chinchiroTurn.rollsUsed === 0) mainLabel = t('dice.roll');
    else if (!chinchiroTurn.decided) { mainLabel = t('dice.chinchiro.reroll'); subLabel = t('dice.chinchiro.rollsLeft', { n: rollsLeft }); }
    else mainLabel = t('dice.chinchiro.again');
  }

  return (
    <div className="ck-section flex flex-col gap-5">
      {/* モード切替 */}
      <div className="flex gap-2" role="group" aria-label={t('dice.mode.basic')}>
        {MODES.map((m) => (
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
            {t(MODE_LABEL[m])}
          </button>
        ))}
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
          <p className="text-xs" style={{ color: ck.text.muted }}>{t('dice.trpgHint')}</p>
        </div>
      )}

      {/* 個数・面数（基本 / TRPG のみ） */}
      {!isChin && (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
              {t('dice.diceCount')}
            </span>
            <NumberStepper
              value={count}
              min={MIN_DICE}
              max={MAX_DICE}
              onChange={setCount}
              ariaLabel={t('dice.diceCount')}
              ariaDec={t('dice.removeDie')}
              ariaInc={t('dice.addDie')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
                {t('dice.sides')}
              </span>
              <NumberStepper
                value={sides}
                min={MIN_SIDES}
                max={MAX_SIDES}
                onChange={setSides}
                ariaLabel={t('dice.sides')}
                ariaDec={t('dice.sidesDown')}
                ariaInc={t('dice.sidesUp')}
              />
            </div>
            {isD100 && <p className="text-xs font-bold" style={{ color: ck.text.secondary }}>{t('dice.d100Note')}</p>}
          </div>
        </>
      )}

      {/* チンチロ：ルール説明＋役一覧（倍率表）＋投数インジケータ */}
      {isChin && (
        <div className="flex flex-col gap-3">
          <p className="text-xs leading-relaxed" style={{ color: ck.text.muted }}>{t('dice.chinchiro.hint')}</p>

          {/* 役と倍率の一覧（強い順） */}
          <div style={{ border: `1px solid ${ck.border.default}`, background: ck.bg.card }}>
            <p className="text-[10px] font-black tracking-widest uppercase px-3 pt-2 pb-1" style={{ color: ck.text.secondary }}>
              {t('dice.chinchiro.legendTitle')}
            </p>
            <ul>
              {CHINCHIRO_LEGEND.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between px-3 py-1 text-xs"
                  style={{ borderTop: `1px solid ${ck.border.default}`, opacity: row.loss ? 0.6 : 1 }}
                >
                  <span className="font-bold" style={{ color: ck.text.primary }}>{t(row.name)}</span>
                  <span className="font-black tabular-nums shrink-0" style={{ color: row.loss ? ck.text.secondary : ck.text.primary }}>
                    {row.pip ? t('dice.chinchiro.multiplierPip') : t('dice.chinchiro.multiplier', { n: row.mult! })}
                    {row.loss && <span className="ml-1 font-bold" style={{ color: ck.text.muted }}>{t('dice.chinchiro.lose')}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2" aria-label={t('dice.chinchiro.rollsLabel')}>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
              {t('dice.chinchiro.rollsLabel')}
            </span>
            <span className="flex gap-1.5">
              {Array.from({ length: CHINCHIRO_MAX_ROLLS }, (_, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: i < chinchiroTurn.rollsUsed ? ck.text.primary : ck.border.default }}
                  aria-hidden="true"
                />
              ))}
            </span>
          </div>
        </div>
      )}

      {/* ロールボタン */}
      <button
        type="button"
        onClick={onRoll}
        disabled={rolling}
        aria-label={t('dice.rollAria')}
        className="ck-btn ck-btn-primary w-full text-base h-14 tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <IconDice size={20} aria-hidden="true" />
        <span>{rolling ? t('dice.rolling') : mainLabel}</span>
        <span className="text-xs font-bold opacity-70 tabular-nums">{subLabel}</span>
      </button>
    </div>
  );
}
