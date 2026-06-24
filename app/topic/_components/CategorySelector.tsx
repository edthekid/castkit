import type { TopicCategory } from '../_data/topics';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import type { TranslationKey } from '../../_i18n/translations';
import { ICON_MAP } from '../../_components/icons';

interface CategorySelectorProps {
  categories: TopicCategory[];
  activeIds: Set<string>;
  onToggle: (id: string) => void;
  onClear: () => void;
}

export function CategorySelector({ categories, activeIds, onToggle, onClear }: CategorySelectorProps) {
  const { t } = useTranslation();
  const allSelected = activeIds.size === 0;

  return (
    <div className="ck-section ck-slide-up" style={{ animationDelay: '0.05s' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">①</span> {t('topic.categoryTitle')}
        </h3>
        {!allSelected && (
          <button onClick={onClear} className="text-xs font-bold" style={{ color: ck.text.secondary }}>
            {t('topic.clearFilter')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => {
          const isActive = activeIds.has(cat.id);
          const Icon = ICON_MAP[cat.icon];
          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold transition-colors"
              style={{
                background: isActive ? ck.text.primary : ck.bg.card,
                color: isActive ? ck.text.onDark : ck.text.primary,
                border: `1.5px solid ${isActive ? ck.text.primary : ck.border.default}`,
              }}
            >
              {Icon && <Icon size={16} />}
              <span className="truncate">{t(cat.labelKey as TranslationKey)}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs mt-3" style={{ color: ck.text.muted }}>
        {allSelected ? t('topic.allCategoriesNote') : t('topic.filteredNote')}
      </p>
    </div>
  );
}
