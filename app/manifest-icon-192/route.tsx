import { appIconResponse } from '../_lib/appIcon';

// ビルド時に静的生成する（リクエストごとに変化しないため）
export const dynamic = 'force-static';

// PWA manifest 用 192x192 アイコン
export function GET() {
  return appIconResponse(192);
}
