import type { TopicHistoryItem } from '../_hooks/useTopicPicker';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { ICON_MAP, IconTrash } from '../../_components/icons';

interface TopicHistoryProps {
  history: TopicHistoryItem[];
  onClear: () => void;
}

export function TopicHistoryPanel({ history, onClear }: TopicHistoryProps) {
  const { t } = useTranslation();

  return (
    <div className="ck-section ck-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">②</span> {t('topic.historyTitle')}
        </h3>
        <div className="flex items-center gap-2">
          <span className="ck-badge">{t('topic.historyCount', { count: history.length })}</span>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="ck-btn text-xs px-3 py-1.5 flex items-center gap-1.5"
              style={{ background: ck.bg.muted, color: ck.text.secondary, border: `1px solid ${ck.border.default}` }}
            >
              <IconTrash size={13} />
              {t('topic.clearHistory')}
            </button>
          )}
        </div>
      </div>

      <div className="h-56 overflow-y-auto flex flex-col gap-2">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm font-bold" style={{ color: ck.text.muted }}>
            {t('topic.historyEmpty')}
          </div>
        ) : (
          history.map((item) => {
            const Icon = ICON_MAP[item.categoryIcon];
            return (
              <div
                key={item.id}
                className="flex items-start gap-2 px-3 py-2 text-sm"
                style={{ background: ck.bg.card, border: `1px solid ${ck.border.default}` }}
              >
                <span className="shrink-0 mt-0.5" style={{ color: ck.text.secondary }}>
                  {Icon && <Icon size={14} />}
                </span>
                <span className="font-bold" style={{ color: ck.text.primary }}>{item.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
