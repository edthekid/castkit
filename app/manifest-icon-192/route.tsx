import { appIconResponse } from '../_lib/appIcon';

export const runtime = 'edge';

// PWA manifest 用 192x192 アイコン
export function GET() {
  return appIconResponse(192);
}
