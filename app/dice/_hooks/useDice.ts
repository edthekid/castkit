'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../../_i18n/useTranslation';
import {
  type DiceMode,
  type RollPhase,
  type RollRecord,
  MIN_DICE,
  MAX_DICE,
  MIN_SIDES,
  MAX_SIDES,
  D100,
  MAX_HISTORY,
  ROLL_DURATION_MS,
  STORAGE_KEY,
} from '../_constants';
import { notation, rollOne, formatRoll } from '../_utils';

interface PersistedState {
  mode: DiceMode;
  count: number;
  sides: number;
  history: RollRecord[];
}

const clampCount = (n: number) => Math.max(MIN_DICE, Math.min(MAX_DICE, n));
const clampSides = (n: number) => Math.max(MIN_SIDES, Math.min(MAX_SIDES, Math.round(n)));

export function useDice() {
  const { t } = useTranslation();

  // ─── 設定（SSR と一致させるため初期値は固定） ───────────
  const [mode, setModeState]   = useState<DiceMode>('basic');
  const [count, setCountState] = useState(2);
  const [sides, setSidesState] = useState(6);

  // 個数・面数は数値入力。範囲外はクランプする。
  const setCount = useCallback((n: number) => setCountState(clampCount(n)), []);
  const setSides = useCallback((n: number) => setSidesState(clampSides(n)), []);

  // ─── ロール状態 ─────────────────────────────────────────
  const [phase, setPhase]     = useState<RollPhase>('idle');
  const [current, setCurrent] = useState<RollRecord | null>(null);
  const [history, setHistory] = useState<RollRecord[]>([]);
  // 物理演算の再生をやり直すためのキー（roll ごとに +1）。
  const [rollKey, setRollKey] = useState(0);
  // 3D描画に渡す、今回振る本数と面数（出目は物理が自然に決める）。
  const [activeRoll, setActiveRoll] = useState<{ count: number; sides: number } | null>(null);

  const [hydrated, setHydrated] = useState(false);

  // 出目は物理演算（DiceCanvas）が自然な着地で決める。確定は reveal(values) で1回だけ。
  const revealedRef = useRef(true);      // 今回のロールが確定済みか（二重確定防止）
  const rollSidesRef = useRef(6);        // 今回のロールの面数（確定時に使用）
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef      = useRef(0);

  const isD100 = mode === 'trpg' && sides === D100;

  // ─── 読み込み（マウント後） ─────────────────────────────
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PersistedState>;
        if (saved.mode === 'basic' || saved.mode === 'trpg') setModeState(saved.mode);
        if (typeof saved.count === 'number') setCountState(clampCount(saved.count));
        if (typeof saved.sides === 'number') setSidesState(clampSides(saved.sides));
        if (Array.isArray(saved.history)) setHistory(saved.history.slice(0, MAX_HISTORY));
      }
    } catch {
      // 破損データは無視
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ─── 保存 ───────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedState = { mode, count, sides, history };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // 容量超過などは無視
    }
  }, [hydrated, mode, count, sides, history]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ─── 設定変更 ───────────────────────────────────────────
  // モードは個数・面数の入力方法（プリセット有無）が異なるだけで、値は引き継ぐ。
  const setMode = useCallback((next: DiceMode) => setModeState(next), []);

  // TRPGプリセット：個数と面数をまとめて設定する。
  const setPreset = useCallback((nextCount: number, nextSides: number) => {
    setCountState(clampCount(nextCount));
    setSidesState(clampSides(nextSides));
  }, []);

  // ─── 出目の確定（静止後、物理側が実際の出目を渡して呼ぶ） ──
  // 各サイコロは自然に着地し、上を向いた面の値がそのまま出目になる。
  const reveal = useCallback((values: number[]) => {
    if (revealedRef.current) return;      // 既に確定済み（二重確定を防ぐ）
    if (values.length === 0) return;
    revealedRef.current = true;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }

    const rollSides = rollSidesRef.current;
    const total = values.reduce((a, b) => a + b, 0);
    const record: RollRecord = {
      id: `roll-${Date.now()}-${idRef.current++}`,
      notation: notation(values.length, rollSides),
      values,
      total,
      sides: rollSides,
      count: values.length,
      isD100: rollSides === D100,
    };
    setCurrent(record);
    setHistory((prev) => [record, ...prev].slice(0, MAX_HISTORY));
    setPhase('result');
  }, []);

  // ─── ロール開始 ─────────────────────────────────────────
  const roll = useCallback(() => {
    if (phase === 'rolling') return;
    if (timerRef.current) clearTimeout(timerRef.current);

    revealedRef.current = false;
    rollSidesRef.current = sides;
    setActiveRoll({ count, sides });
    setPhase('rolling');
    setRollKey((k) => k + 1);

    // セーフティ：物理側の settle 通知が来なくてもこの時間で確定する
    // （通常は DiceCanvas が自然な着地後に実際の出目を渡して確定する）。
    const fallbackCount = count;
    const fallbackSides = sides;
    timerRef.current = setTimeout(() => {
      reveal(Array.from({ length: fallbackCount }, () => rollOne(fallbackSides)));
    }, ROLL_DURATION_MS);
  }, [phase, count, sides, reveal]);

  // ─── 履歴 ───────────────────────────────────────────────
  const clearHistory = useCallback(() => {
    if (history.length === 0) return;
    setHistory([]);
    toast.success(t('dice.toast.cleared'));
  }, [history.length, t]);

  const copyText = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(t('dice.toast.copied')))
      .catch(() => toast.error(t('dice.toast.copyFailed')));
  }, [t]);

  const copyRecord = useCallback((record: RollRecord) => {
    copyText(formatRoll(record));
  }, [copyText]);

  return {
    // 設定
    mode, setMode,
    count, setCount,
    sides, setSides, setPreset,
    isD100,
    // ロール
    phase,
    current,
    rollKey,
    activeRoll,
    roll,
    reveal,
    // 履歴
    history,
    clearHistory,
    copyRecord,
  };
}
