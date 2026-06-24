import { appIconResponse } from './_lib/appIcon';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return appIconResponse(32);
}
