import { appIconResponse } from '../_lib/appIcon';

export const runtime = 'edge';

// PWA manifest 用 512x512 アイコン
export function GET() {
  return appIconResponse(512);
}
