import { SITE, indexablePlaceIds, urlset } from '@/lib/sitemap';

export const revalidate = 86400;

export async function GET() {
  const ids = await indexablePlaceIds();
  return urlset(ids.map((id) => `${SITE}/place/${id}`));
}
