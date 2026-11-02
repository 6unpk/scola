import { REGIONS } from '@/data/regions';
import { fetchSubregions, sigunguSlug, MIN_SUBREGION_PLACES } from '@/lib/sigungu';

export const SITE = 'https://scola.kr';
export const MIN_INDEX_REVIEWS = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

async function fetchPaged<T>(path: string, per: number): Promise<T[]> {
  const rows: T[] = [];
  let page = 1;
  let totalPages = 1;
  try {
    while (page <= totalPages) {
      const res = await fetch(`${API_BASE}${path}${path.includes('?') ? '&' : '?'}per=${per}&page=${page}`, { next: { revalidate: 86400 } });
      if (!res.ok) break;
      const data = await res.json();
      const items: T[] = data.data ?? [];
      if (items.length === 0) break;
      rows.push(...items);
      totalPages = data.meta?.total_pages ?? page;
      page++;
    }
  } catch {
    return rows;
  }
  return rows;
}

export async function indexablePlaceIds(): Promise<number[]> {
  const places = await fetchPaged<{ id: number; visitor_review_count: number | null }>('/places?sort=name', 100);
  return [...new Set(places.filter((p) => (p.visitor_review_count ?? 0) >= MIN_INDEX_REVIEWS).map((p) => p.id))];
}

export async function postSlugs(): Promise<string[]> {
  const posts = await fetchPaged<{ slug: string }>('/posts', 50);
  return [...new Set(posts.map((p) => p.slug))];
}

export async function regionUrls(): Promise<string[]> {
  const subs = await Promise.all(REGIONS.map((r) => fetchSubregions(r.name)));
  return REGIONS.flatMap((r, i) => [
    `${SITE}/sauna/${r.slug}`,
    ...subs[i].filter((s) => s.count >= MIN_SUBREGION_PLACES).map((s) => `${SITE}/sauna/${r.slug}/${sigunguSlug(s.label)}`),
  ]);
}

export function xml(body: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

export function urlset(urls: string[]) {
  const items = urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n');
  return xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`);
}
