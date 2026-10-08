import api from '@/lib/api';

const SITE = 'https://scola.kr';

export type ShareResult = 'shared' | 'copied' | 'failed';

export const SITE_URL = SITE;

export async function shareLink(url: string, title: string): Promise<ShareResult> {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title, url });
      return 'shared';
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return 'copied';
    }
    return 'failed';
  } catch {
    return 'failed';
  }
}

export async function sharePlace(id: number | string, name: string): Promise<ShareResult> {
  const result = await shareLink(`${SITE}/place/${id}`, name ? `${name} | 스콜라` : '스콜라');
  if (result !== 'failed') {
    api.post(`/places/${id}/events`, { event_type: 'share' }).catch(() => {});
  }
  return result;
}
