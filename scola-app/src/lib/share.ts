import api from '@/lib/api';

const SITE = 'https://scola.kr';

export type ShareResult = 'shared' | 'copied' | 'failed';

export async function sharePlace(id: number | string, name: string): Promise<ShareResult> {
  const url = `${SITE}/place/${id}`;
  const title = name ? `${name} | 스콜라` : '스콜라';

  let result: ShareResult = 'failed';
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title, url });
      result = 'shared';
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      result = 'copied';
    }
  } catch {
    return 'failed';
  }

  if (result !== 'failed') {
    api.post(`/places/${id}/events`, { event_type: 'share' }).catch(() => {});
  }
  return result;
}
