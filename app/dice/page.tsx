'use client';

import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';

export default function DicePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ToolHeader titleKey="dice.title" subtitleKey="dice.subtitle" />

      {/* UI・物理演算は後続ステップで実装 */}

      <ToolFooter />
    </div>
  );
}
