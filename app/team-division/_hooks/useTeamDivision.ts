'use client';

import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { toast } from 'sonner';
import type { TeamPattern, TabType } from '../_constants';
import { MAX_RESULTS } from '../_constants';
import {
  generateAllCombinations,
  calcTeamSizes,
  buildCopyText,
} from '../_utils';
import { useTranslation } from '../../_i18n/useTranslation';

export function useTeamDivision() {
  const { t } = useTranslation();

  // ─── State ──────────────────────────────────────────────
  const [inputText, setInputText]       = useState('');
  const [teamCount, setTeamCount]       = useState(2);
  const [teamNames, setTeamNames]       = useState<Record<number, string>>({});
  const [fixedMembers, setFixedMembers] = useState<Record<string, number>>({});
  const [patterns, setPatterns]         = useState<TeamPattern[]>([]);
  const [playedKeys, setPlayedKeys]     = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab]       = useState<TabType>('unplayed');

  // ─── 派生データ ──────────────────────────────────────────
  const deferredInputText = useDeferredValue(inputText);
  const currentMembers = useMemo(
    () => deferredInputText.split('\n').map((s) => s.trim()).filter(Boolean),
    [deferredInputText],
  );

  // 重複した名前（複数回登場する名前の一覧）。重複はエラー扱いにする。
  const duplicateMembers = useMemo(() => {
    const seen = new Set<string>();
    const dups = new Set<string>();
    for (const m of currentMembers) {
      if (seen.has(m)) dups.add(m);
      else seen.add(m);
    }
    return [...dups];
  }, [currentMembers]);

  const playedCount   = useMemo(
    () => patterns.filter((p) => playedKeys.has(JSON.stringify(p.teams))).length,
    [patterns, playedKeys],
  );
  const unplayedCount = patterns.length - playedCount;

  const filteredPatterns = useMemo(
    () => patterns.filter((p) => {
      const isPlayed = playedKeys.has(JSON.stringify(p.teams));
      return activeTab === 'played' ? isPlayed : !isPlayed;
    }),
    [patterns, playedKeys, activeTab],
  );

  // ─── チーム名取得 ────────────────────────────────────────
  const getTeamName = useCallback(
    (index: number) => teamNames[index]?.trim() || t('teamSettings.namePlaceholder', { n: index + 1 }),
    [teamNames, t],
  );

  // ─── チーム名変更 ────────────────────────────────────────
  const handleTeamNameChange = useCallback((index: number, val: string) => {
    setTeamNames((prev) => ({ ...prev, [index]: val }));
  }, []);

  // ─── チーム数変更（固定・チーム名をリセット） ────────────
  const handleTeamCountChange = useCallback((count: number) => {
    setTeamCount(count);
    setFixedMembers({});
    setTeamNames({});
  }, []);

  // ─── メンバー固定トグル ──────────────────────────────────
  const toggleMemberFix = useCallback((memberName: string) => {
    setFixedMembers((prev) => {
      const currentTeam = prev[memberName] ?? -1;
      const nextTeam    = currentTeam + 1;
      const updated     = { ...prev };
      if (nextTeam >= teamCount) {
        delete updated[memberName];
      } else {
        updated[memberName] = nextTeam;
      }
      return updated;
    });
  }, [teamCount]);

  // ─── 組み合わせ生成 ──────────────────────────────────────
  const divideTeams = useCallback(() => {
    if (currentMembers.length === 0) {
      toast.error(t('toast.errorEmptyMembers'));
      return;
    }
    if (currentMembers.length < teamCount) {
      toast.error(t('toast.errorTooFewMembers'));
      return;
    }
    if (duplicateMembers.length > 0) {
      toast.error(t('toast.errorDuplicateMembers', { names: duplicateMembers.join(', ') }));
      return;
    }

    // 有効な固定メンバーのみ抽出
    const validFixedMap: Record<string, number> = {};
    Object.keys(fixedMembers).forEach((name) => {
      if (currentMembers.includes(name) && fixedMembers[name] < teamCount) {
        validFixedMap[name] = fixedMembers[name];
      }
    });

    // 固定過多チェック
    const teamSizes  = calcTeamSizes(currentMembers.length, teamCount);
    const fixCounts  = Array.from({ length: teamCount }, () => 0);
    Object.values(validFixedMap).forEach((idx) => { fixCounts[idx]++; });
    for (let i = 0; i < teamCount; i++) {
      if (fixCounts[i] > teamSizes[i]) {
        toast.error(t('toast.errorFixedTooMany', { team: getTeamName(i) }));
        return;
      }
    }

    if (currentMembers.length > 10) {
      toast.warning(t('toast.errorTooMany', { max: MAX_RESULTS }));
    }

    const allCombos = generateAllCombinations(currentMembers, teamCount, validFixedMap);

    if (allCombos.length === 0) {
      toast.error(t('toast.errorNoCombination'));
      return;
    }

    // ペア重複の厳密な除外により生成数が少なくなることがあるため、目安として5件未満なら案内する
    if (allCombos.length < 5) {
      toast.info(t('toast.fewPatternsNote', { count: allCombos.length }));
    }

    setPatterns(
      allCombos.map((combo, i) => ({
        id: i,
        patternName: t('teamDivision.patternName', { n: i + 1 }),
        teams: combo,
      })),
    );
    setPlayedKeys(new Set());
    setActiveTab('unplayed');
  }, [currentMembers, duplicateMembers, teamCount, fixedMembers, getTeamName, t]);

  // ─── クリップボードコピー ────────────────────────────────
  const copyPattern = useCallback((pattern: TeamPattern) => {
    const text = buildCopyText(pattern.patternName, pattern.teams, getTeamName, fixedMembers, t('toast.copyHeader'));
    navigator.clipboard.writeText(text).then(() => {
      toast.success(t('toast.copiedPattern', { pattern: pattern.patternName }));
    }).catch(() => {
      toast.error(t('toast.errorCopyFailed'));
    });
  }, [getTeamName, fixedMembers, t]);

  // ─── 試合済みトグル ──────────────────────────────────────
  const togglePlayStatus = useCallback((pattern: TeamPattern) => {
    const key = JSON.stringify(pattern.teams);
    const isPlayed = playedKeys.has(key);

    // 状態更新は純粋に保つ（updater内で副作用を起こさない）。
    // Strict Modeでupdaterが2回実行されてもトーストが重複しないよう、副作用は外で1回だけ。
    setPlayedKeys((prev) => {
      const next = new Set(prev);
      if (isPlayed) next.delete(key);
      else next.add(key);
      return next;
    });

    if (isPlayed) {
      toast.info(t('toast.markedUnplayed', { pattern: pattern.patternName }));
    } else {
      toast.success(t('toast.markedPlayed', { pattern: pattern.patternName }));
    }
  }, [playedKeys, t]);

  return {
    // state
    inputText, setInputText,
    teamCount,
    teamNames,
    fixedMembers,
    patterns,
    activeTab, setActiveTab,
    // 派生
    currentMembers,
    duplicateMembers,
    playedCount,
    unplayedCount,
    filteredPatterns,
    playedKeys,
    // actions
    getTeamName,
    handleTeamNameChange,
    handleTeamCountChange,
    toggleMemberFix,
    divideTeams,
    copyPattern,
    togglePlayStatus,
  };
}
