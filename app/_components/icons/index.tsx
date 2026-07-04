/**
 * CastKit共通アイコンセット（モノクロ線画SVG）。
 *
 * 全てのアイコンは絵文字を使わず、currentColorのストロークのみで描画する。
 * 色は呼び出し側で `style={{ color: ... }}` や Tailwindの text-* で指定する。
 *
 * 使い方:
 *   <IconBolt size={20} />
 *   <IconBolt size={20} style={{ color: ck.text.primary }} />
 */
import type { SVGProps, ComponentType } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

// ─── ナビゲーション / ホーム ─────────────────────────────

export function IconHome({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M9.5 19.5v-6h5v6" />
    </svg>
  );
}

export function IconBolt({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z" />
    </svg>
  );
}

export function IconTarget({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconLadder({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M7 3v18M17 3v18M7 8h10M7 14h10" />
    </svg>
  );
}

export function IconChat({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 5.5h16v10H9.5L5 19.5V15.5H4Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

// ─── アクション ──────────────────────────────────────────

export function IconFilm({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="0" />
      <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
    </svg>
  );
}

export function IconWheel({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v8.5l6.5 4.3M12 12 5.5 16.3" />
    </svg>
  );
}

export function IconSlot({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="0" />
      <path d="M9 4.5v15M15 4.5v15" />
      <circle cx="6.25" cy="9" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="17.75" cy="15" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconRefresh({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    </svg>
  );
}

export function IconPlay({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M6 4.5v15l13-7.5L6 4.5Z" />
    </svg>
  );
}

export function IconArrowLeft({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconArrowUp({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function IconCopy({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="0" />
      <path d="M15.5 8.5V4.5H4v11.5h4" />
    </svg>
  );
}

export function IconCheck({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

export function IconAlert({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 4 22 19.5H2L12 4Z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function IconInfo({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

export function IconUndo({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    </svg>
  );
}

export function IconTrash({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
      <path d="M10 10.5v6M14 10.5v6" />
    </svg>
  );
}

export function IconPencil({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 20l1-4.5L15.5 5 19 8.5 8.5 19 4 20Z" />
      <path d="M13 7l4 4" />
    </svg>
  );
}

// ─── お題カテゴリアイコン ────────────────────────────────

export function IconNews({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3.5" y="5.5" width="13" height="13" rx="0" />
      <path d="M7 9.5h6M7 12.5h6M7 15.5h3" />
      <path d="M16.5 8.5h4v8a2 2 0 0 1-2 2h-2" />
    </svg>
  );
}

export function IconJoystick({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="9.5" width="18" height="9" rx="0" />
      <path d="M7.5 12.5v3M6 14h3" />
      <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.2" cy="15.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBowl({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3.5 11.5h17a8.5 5 0 0 1-17 0Z" />
      <path d="M5.5 16.5 6.5 20h11l1-3.5" />
      <path d="M12 4v3.5M9 5l1 2.5M15 5l-1 2.5" />
    </svg>
  );
}

export function IconPlane({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3 13.5 21 7l-7 7 1.5 6.5-2.5-3.5L9 19l-1-5-5-2.5Z" />
    </svg>
  );
}

export function IconBriefcase({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="8" width="18" height="11.5" rx="0" />
      <path d="M8.5 8V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function IconSparkle({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
    </svg>
  );
}

export function IconHouse({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M9.5 19.5v-6h5v6" />
    </svg>
  );
}

export function IconBrain({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M9 4.5a3 3 0 0 0-3 3v1a3 3 0 0 0-1.5 5.5A3 3 0 0 0 7 19.5h2v-15Z" />
      <path d="M15 4.5a3 3 0 0 1 3 3v1a3 3 0 0 1 1.5 5.5A3 3 0 0 1 17 19.5h-2v-15Z" />
      <path d="M9 8.5h2M9 12.5h2M13 8.5h2M13 12.5h2" />
    </svg>
  );
}

export function IconSchool({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 4 21 8l-9 4-9-4 9-4Z" />
      <path d="M6 10v5.5c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5V10" />
      <path d="M21 8v6" />
    </svg>
  );
}

export function IconDesktop({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="4.5" width="18" height="12" rx="0" />
      <path d="M9 20h6M12 16.5V20" />
    </svg>
  );
}

export function IconLeaf({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M5 19c-1.5-7 3-13.5 14-14.5 1 11-5.5 15.5-14 14.5Z" />
      <path d="M5 19c2-4 5-7 9.5-10" />
    </svg>
  );
}

export function IconHeart({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 19.5 4.5 12A4.5 4.5 0 0 1 12 6.5 4.5 4.5 0 0 1 19.5 12L12 19.5Z" />
    </svg>
  );
}

export function IconGear({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function IconScales({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 4v16M12 4l-7 5M12 4l7 5" />
      <path d="M5 9l-3 6h6L5 9ZM19 9l-3 6h6L19 9Z" />
      <path d="M8 20h8" />
    </svg>
  );
}

export function IconTrophy({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M7 4.5h10v4a5 5 0 0 1-10 0v-4Z" />
      <path d="M7 6H4.5v1.5A3 3 0 0 0 7 10.5M17 6h2.5v1.5a3 3 0 0 1-2.5 4.5" />
      <path d="M12 13.5V17M9 20h6M9.5 20l.5-3h4l.5 3" />
    </svg>
  );
}

export function IconBook({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

export function IconShare({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export function IconX({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function IconDice({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTimer({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9" />
      <path d="M9.5 2.5h5" />
      <path d="M19 6l1.5-1.5" />
    </svg>
  );
}

export function IconPause({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M8 4.5v15M16 4.5v15" />
    </svg>
  );
}

export function IconExpand({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

export function IconVolume({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

export function IconVolumeMute({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function IconFlag({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M5.5 21V3.5" />
      <path d="M5.5 4.5h11l-2 3.5 2 3.5h-11" />
    </svg>
  );
}

// ─── アイコンID → コンポーネントのマップ ─────────────────
// topic/_data/topics.ts のような、データファイル側で文字列として
// アイコンを指定したい場合に使う（JSXを直接データに書けないため）。
export const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  news: IconNews,
  joystick: IconJoystick,
  bowl: IconBowl,
  plane: IconPlane,
  briefcase: IconBriefcase,
  sparkle: IconSparkle,
  house: IconHouse,
  brain: IconBrain,
  school: IconSchool,
  desktop: IconDesktop,
  leaf: IconLeaf,
  heart: IconHeart,
};
