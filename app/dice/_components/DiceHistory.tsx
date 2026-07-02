'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconCopy, IconTrash } from '../../_components/icons';
import type { RollRecord } from '../_constants';
import { chinchiroName } from '../_utils';

interface DiceHistoryProps {
  history: RollRecord[];
  onCopy: (record: RollRecord) => void;
  onClear: () => void;
}

export function DiceHistoryPanel({ history, onCopy, onClear }: DiceHistoryProps) {
  const { t } = useTranslation();

  return (
    <div className="ck-section flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('dice.history')}
        </p>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-bold hover:text-ck-ink transition-colors"
            style={{ color: ck.text.muted }}
          >
            <IconTrash size={13} aria-hidden="true" />
            {t('dice.clearHistory')}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: ck.text.muted }}>
          {t('dice.emptyHistory')}
        </p>
      ) : (
        <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {history.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 px-3 py-2"
              style={{ border: `1px solid ${ck.border.default}`, background: ck.bg.card }}
            >
              <span className="text-xs font-black tabular-nums shrink-0 w-14" style={{ color: ck.text.secondary }}>
                {r.notation}
              </span>
              <span className="text-xs font-medium tabular-nums truncate flex-1" style={{ color: ck.text.primary }}>
                [{r.values.join(', ')}]
              </span>
              {r.chinchiro ? (
                <span className="text-sm font-black shrink-0" style={{ color: ck.text.primary }}>
                  {chinchiroName(r.chinchiro.role, r.chinchiro.value, t)}
                  {r.chinchiro.multiplier !== 0 && (
                    <span className="ml-1 text-xs" style={{ color: ck.text.secondary }}>
                      {t('dice.chinchiro.multiplier', { n: r.chinchiro.multiplier })}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-sm font-black tabular-nums shrink-0" style={{ color: ck.text.primary }}>
                  = {r.total}
                </span>
              )}
              <button
                type="button"
                onClick={() => onCopy(r)}
                aria-label={t('dice.copyResult')}
                title={t('dice.copy')}
                className="shrink-0 p-1.5 hover:text-ck-ink transition-colors"
                style={{ color: ck.text.muted }}
              >
                <IconCopy size={15} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
