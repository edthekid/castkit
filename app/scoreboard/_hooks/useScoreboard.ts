'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../../_i18n/useTranslation';
import {
  type Team,
  type ScoreRecord,
  type DesignMode,
  type SortMode,
  MIN_TEAMS,
  MAX_TEAMS,
  MAX_HISTORY,
  MAX_RECORDS,
  TEAM_COLORS,
  STORAGE_KEY,
  DEFAULT_FONT_ID,
} from '../_constants';
import { buildCopyText, formatScores } from '../_utils';

interface PersistedState {
  teams: Team[];
  designMode: DesignMode;
  showRank: boolean;
  sortMode: SortMode;
  fontId: string;
  bulkAmount: string;
  records: ScoreRecord[];
}

function makeTeam(index: number): Team {
  return {
    id: `team-${index}`,
    name: '',
    seq: index + 1,
    score: 0,
    color: TEAM_COLORS[index % TEAM_COLORS.length],
  };
}

/** SSR とハイドレーションを一致させるため、初期値は常に固定（2チーム）。 */
const INITIAL_TEAMS: Team[] = [makeTeam(0), makeTeam(1)];

export function useScoreboard() {
  const { t } = useTranslation();

  const [teams, setTeams]           = useState<Team[]>(INITIAL_TEAMS);
  const [designMode, setDesignMode] = useState<DesignMode>('minimal');
  const [showRank, setShowRank]     = useState(true);
  const [sortMode, setSortMode]     = useState<SortMode>('default');
  const [fontId, setFontId]         = useState<string>(DEFAULT_FONT_ID);
  // スコア増減値：一括設定（bulkAmount）＋チーム個別の上書き（amountOverrides）。
  // 各チームの実効値 = amountOverrides[id] ?? bulkAmount。
  const [bulkAmount, setBulkAmount] = useState<string>('1');
  const [amountOverrides, setAmountOverrides] = useState<Record<string, string>>({});
  const [records, setRecords]       = useState<ScoreRecord[]>([]);
  // チームごとの得点の履歴（Undo 用）。id → 過去スコアのスタック。永続化しない。
  const [undoStacks, setUndoStacks] = useState<Record<string, number[]>>({});
  const [hydrated, setHydrated]     = useState(false);

  // ─── オートセーブ（LocalStorage） ───────────────────────
  // 初回マウント後に読み込み（SSR は固定値のままにしてハイドレーション不一致を避ける）。
  useEffect(() => {
    // SSR は固定の初期値のままにし、保存値はマウント後に反映する（ハイドレーション不一致回避）。
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PersistedState>;
        if (Array.isArray(saved.teams) && saved.teams.length >= MIN_TEAMS) {
          // 旧データ（seq なし）は読み込み時に補完する。
          setTeams(saved.teams.map((tm, i) => ({ ...tm, seq: tm.seq ?? i + 1 })));
        }
        if (saved.designMode) setDesignMode(saved.designMode);
        if (typeof saved.showRank === 'boolean') setShowRank(saved.showRank);
        if (saved.sortMode === 'default' || saved.sortMode === 'score') setSortMode(saved.sortMode);
        if (typeof saved.fontId === 'string') setFontId(saved.fontId);
        if (typeof saved.bulkAmount === 'string') setBulkAmount(saved.bulkAmount);
        if (Array.isArray(saved.records)) setRecords(saved.records);
      }
    } catch {
      // 破損データは無視して初期状態で続行
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // 読み込み後の変更を保存する。
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedState = { teams, designMode, showRank, sortMode, fontId, bulkAmount, records };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // 容量超過などは無視
    }
  }, [hydrated, teams, designMode, showRank, sortMode, fontId, bulkAmount, records]);

  // ─── 直近の操作で得点が動いたチーム（アニメーション用） ───
  const [bumpedId, setBumpedId] = useState<string | null>(null);
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flagBump = useCallback((id: string | null) => {
    if (bumpTimer.current) clearTimeout(bumpTimer.current);
    setBumpedId(id);
    if (id) bumpTimer.current = setTimeout(() => setBumpedId(null), 450);
  }, []);
  useEffect(() => () => { if (bumpTimer.current) clearTimeout(bumpTimer.current); }, []);

  // ─── 得点変更系は変更前スコアをチームごとの Undo スタックに積む ──
  const pushUndo = useCallback((id: string, prevScore: number) => {
    setUndoStacks((s) => ({ ...s, [id]: [...(s[id] ?? []), prevScore].slice(-MAX_HISTORY) }));
  }, []);

  const changeScore = useCallback((id: string, delta: number) => {
    const cur = teams.find((tm) => tm.id === id);
    if (!cur) return;
    pushUndo(id, cur.score);
    setTeams((prev) => prev.map((tm) => (tm.id === id ? { ...tm, score: tm.score + delta } : tm)));
    flagBump(id);
  }, [teams, pushUndo, flagBump]);

  const setScore = useCallback((id: string, value: number) => {
    const cur = teams.find((tm) => tm.id === id);
    if (!cur || cur.score === value) return;
    pushUndo(id, cur.score);
    setTeams((prev) => prev.map((tm) => (tm.id === id ? { ...tm, score: value } : tm)));
    flagBump(id);
  }, [teams, pushUndo, flagBump]);

  const resetScores = useCallback(() => {
    if (teams.every((tm) => tm.score === 0)) return;
    // 各チームの現在値をスタックに積んでから 0 にする（チームごとに「1つ戻る」で復元可能）。
    setUndoStacks((s) => {
      const next = { ...s };
      teams.forEach((tm) => { next[tm.id] = [...(next[tm.id] ?? []), tm.score].slice(-MAX_HISTORY); });
      return next;
    });
    setTeams((prev) => prev.map((tm) => ({ ...tm, score: 0 })));
    flagBump(null);
    toast.success(t('scoreboard.toast.reset'));
  }, [teams, flagBump, t]);

  // チーム名・得点・増減値・記録の履歴をまとめて初期化（チーム数・色・デザインは保持）。Undo 履歴もクリア。
  const resetAll = useCallback(() => {
    setTeams((prev) => prev.map((tm) => ({ ...tm, name: '', score: 0 })));
    setUndoStacks({});
    setBulkAmount('1');
    setAmountOverrides({});
    setRecords([]);
    flagBump(null);
    toast.success(t('scoreboard.toast.resetAll'));
  }, [flagBump, t]);

  // ─── スコア増減値（一括設定 + チーム個別） ──────────────
  const getAmount = useCallback(
    (id: string) => amountOverrides[id] ?? bulkAmount,
    [amountOverrides, bulkAmount],
  );

  // チーム個別に増減値を変更（そのチームだけ上書き）。
  const setTeamAmount = useCallback((id: string, value: string) => {
    setAmountOverrides((prev) => ({ ...prev, [id]: value }));
  }, []);

  // 一括設定：全チームの増減値をこの値に揃える（個別の上書きはクリア）。
  const applyBulkAmount = useCallback((value: string) => {
    setBulkAmount(value);
    setAmountOverrides({});
  }, []);

  // 「点数順」⇄「デフォルト（seq順）」をトグルで切り替える。得点は変えない（順序のみ）。
  const toggleSort = useCallback(() => {
    const next: SortMode = sortMode === 'default' ? 'score' : 'default';
    setSortMode(next);
    setTeams((prev) => [...prev].sort(
      next === 'score' ? (a, b) => b.score - a.score : (a, b) => a.seq - b.seq,
    ));
    flagBump(null);
  }, [sortMode, flagBump]);

  const undoTeam = useCallback((id: string) => {
    const stack = undoStacks[id];
    if (!stack || stack.length === 0) return;
    const prevScore = stack[stack.length - 1];
    setUndoStacks((s) => ({ ...s, [id]: (s[id] ?? []).slice(0, -1) }));
    setTeams((prev) => prev.map((tm) => (tm.id === id ? { ...tm, score: prevScore } : tm)));
    flagBump(id);
  }, [undoStacks, flagBump]);

  // ─── チーム編集（Undo 対象外） ──────────────────────────
  const renameTeam = useCallback((id: string, name: string) => {
    setTeams((prev) => prev.map((tm) => (tm.id === id ? { ...tm, name } : tm)));
  }, []);

  const recolorTeam = useCallback((id: string, color: string) => {
    setTeams((prev) => prev.map((tm) => (tm.id === id ? { ...tm, color } : tm)));
  }, []);

  const setTeamCount = useCallback((count: number) => {
    const clamped = Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, count));
    setTeams((prev) => {
      if (clamped === prev.length) return prev;
      if (clamped < prev.length) return prev.slice(0, clamped);
      const added = Array.from({ length: clamped - prev.length }, (_, i) => {
        const index = prev.length + i;
        return { ...makeTeam(index), id: `team-${index}-${Date.now()}-${i}` };
      });
      return [...prev, ...added];
    });
  }, []);

  // ─── チーム名の表示解決（空ならプレースホルダ） ───────────
  // プレースホルダはチーム固有の seq を使う（配列位置ではない）。
  // これにより並べ替えてもデフォルト名がチームと一緒に移動する。
  const getTeamName = useCallback(
    (team: Team) => team.name.trim() || t('scoreboard.teamPlaceholder', { n: team.seq }),
    [t],
  );

  // ─── 記録（スナップショット） ───────────────────────────
  const recordSnapshot = useCallback(() => {
    const now = new Date();
    const label = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const snapshot: ScoreRecord = {
      id: `rec-${now.getTime()}`,
      label,
      entries: teams.map((tm) => ({ name: getTeamName(tm), score: tm.score, color: tm.color })),
    };
    setRecords((prev) => [snapshot, ...prev].slice(0, MAX_RECORDS));
    toast.success(t('scoreboard.toast.recorded'));
  }, [teams, getTeamName, t]);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearRecords = useCallback(() => {
    if (records.length === 0) return;
    setRecords([]);
    toast.success(t('scoreboard.toast.recordsCleared'));
  }, [records, t]);

  // ─── クリップボードコピー ────────────────────────────────
  const copyText = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(t('scoreboard.toast.copied')))
      .catch(() => toast.error(t('scoreboard.toast.copyFailed')));
  }, [t]);

  const copyScores = useCallback(() => {
    copyText(buildCopyText(teams, getTeamName, t('scoreboard.copyHeading')));
  }, [teams, getTeamName, t, copyText]);

  const copyRecord = useCallback((record: ScoreRecord) => {
    const heading = `${t('scoreboard.copyHeading')} (${record.label})`;
    copyText(formatScores(record.entries, heading));
  }, [t, copyText]);

  return {
    // state
    teams,
    designMode,
    showRank,
    sortMode,
    fontId,
    bulkAmount,
    records,
    bumpedId,
    undoStacks,
    // setters / actions
    setDesignMode,
    setShowRank,
    setFontId,
    getAmount,
    setTeamAmount,
    applyBulkAmount,
    changeScore,
    setScore,
    resetScores,
    resetAll,
    toggleSort,
    undoTeam,
    renameTeam,
    recolorTeam,
    setTeamCount,
    recordSnapshot,
    deleteRecord,
    clearRecords,
    copyScores,
    copyRecord,
    getTeamName,
  };
}
