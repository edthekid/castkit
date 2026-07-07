'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from '../_i18n/useTranslation';
import { ToolCard } from './ToolCard';
import { TOOL_CARDS } from './toolList';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// SSR は false、クライアントは true を返す。hydration mismatch を避けるための判定。
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function RelatedTools() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const isClient = useIsClient();

  // SSR／初回レンダーは決定論的に先頭3つ、マウント後は毎表示ランダム3つ。
  const related = useMemo(() => {
    const candidates = TOOL_CARDS.filter((tool) => tool.href !== pathname);
    return (isClient ? shuffle(candidates) : candidates).slice(0, 3);
  }, [pathname, isClient]);

  const label = locale === 'ja' ? '他のツールも使ってみる' : 'Try other tools';

  return (
    <div className="mt-16 pt-10 border-t border-ck-line">
      <p className="ck-eyebrow mb-5">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((tool) => (
          <ToolCard key={tool.href} {...tool} variant="compact" />
        ))}
      </div>
    </div>
  );
}
