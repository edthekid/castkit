'use client';

import { Toaster } from 'sonner';
import { IconCheck, IconAlert, IconInfo } from './icons';
import { ck } from '../_theme/colors';

/**
 * サイトのデザインに合わせたトースト通知。
 * sonner の richColors（緑/赤）をやめ、モノクロ基調 + 角ばり +
 * シグネチャーのハードオフセット影で統一する。アイコンも線画モノクロに揃える。
 */
export function AppToaster() {
  const iconStyle = { color: ck.text.primary };

  return (
    <Toaster
      position="bottom-right"
      gap={10}
      toastOptions={{
        style: {
          background: ck.bg.page,
          color: ck.text.primary,
          border: `1.5px solid ${ck.text.primary}`,
          borderRadius: 0,
          boxShadow: `4px 4px 0 0 ${ck.border.strong}`,
          fontFamily: 'inherit',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.02em',
        },
      }}
      icons={{
        success: <IconCheck size={16} style={iconStyle} />,
        error: <IconAlert size={16} style={iconStyle} />,
        warning: <IconAlert size={16} style={iconStyle} />,
        info: <IconInfo size={16} style={iconStyle} />,
      }}
    />
  );
}
