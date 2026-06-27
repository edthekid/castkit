'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { IconTrash, IconCopy } from '../../_components/icons';
import type { ScoreRecord } from '../_constants';

interface RecordListProps {
  records: ScoreRecord[];
  onDelete: (id: string) => void;
  onCopy: (record: ScoreRecord) => void;
  onClear: () => void;
}

const MEDAL = ['🥇', '🥈', '🥉'];

/** 「記録」ボタンで積んだスコアのスナップショット一覧。得点の高い順に並べて表示する。 */
export function RecordList({ records, onDelete, onCopy, onClear }: RecordListProps) {
  const { t } = useTranslation();

  if (records.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-black tracking-widest uppercase text-ck-subtle">
          {t('scoreboard.records')}
        </h2>
        <span className="ck-badge text-[10px]">{records.length}</span>
        <button
          className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-ck-subtle hover:text-ck-ink border border-ck-line transition-colors"
          onClick={onClear}
        >
          <IconTrash size={14} /> {t('scoreboard.clearRecords')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {records.map((rec) => {
          const ranked = [...rec.entries].sort((a, b) => b.score - a.score);
          const top = ranked[0]?.score ?? 0;
          return (
            <div key={rec.id} className="ck-card p-0 overflow-hidden">
              {/* ヘッダー：時刻 + 削除 */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-ck-line bg-ck-surface">
                <span className="inline-flex items-center gap-1.5 text-xs font-black tabular-nums text-ck-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-ck-muted" aria-hidden="true" />
                  {rec.label}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    className="opacity-40 hover:opacity-90 transition-opacity"
                    onClick={() => onCopy(rec)}
                    aria-label={t('scoreboard.copyRecord')}
                  >
                    <IconCopy size={15} />
                  </button>
                  <button
                    className="opacity-40 hover:opacity-90 transition-opacity"
                    onClick={() => onDelete(rec.id)}
                    aria-label={t('scoreboard.deleteRecord')}
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </div>

              {/* 順位表 */}
              <ul className="divide-y divide-ck-line">
                {ranked.map((e, i) => {
                  const isLeader = e.score === top && top !== 0;
                  return (
                    <li key={i} className="flex items-center gap-2.5 px-3 py-1.5">
                      <span className="w-5 shrink-0 text-center text-xs font-black tabular-nums text-ck-muted">
                        {MEDAL[i] ?? i + 1}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} aria-hidden="true" />
                      <span className={`flex-1 min-w-0 truncate text-sm ${isLeader ? 'font-black text-ck-ink' : 'font-bold text-ck-body'}`}>
                        {e.name}
                      </span>
                      <span className={`shrink-0 tabular-nums text-base ${isLeader ? 'font-black text-ck-ink' : 'font-bold text-ck-subtle'}`}>
                        {e.score}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
