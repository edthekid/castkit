'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from '../_i18n/useTranslation';
import { getToolShare } from '../_lib/tools';
import { ToolArticleLink } from './ToolArticleLink';
import { ShareButton } from './ShareButton';
import { RelatedTools } from './RelatedTools';

/**
 * 全ツールページ共通のフッター。
 * ツール利用後の「次に読む（記事）→ シェア → 他のツール」の導線をまとめる。
 * シェア文言は app/_lib/tools.ts からパスに応じて取得する。
 */
export function ToolFooter() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const tool = getToolShare(pathname);

  return (
    <>
      <ToolArticleLink />
      {tool && (
        <div className="flex justify-center mt-12">
          <ShareButton text={tool.shareText[locale]} />
        </div>
      )}
      <RelatedTools />
    </>
  );
}
