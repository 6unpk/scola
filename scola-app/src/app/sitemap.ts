import type { MetadataRoute } from 'next';
import { REGIONS } from '@/data/regions';

const BASE = 'https://scola.kr';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

async function fetchAllPlaceIds(): Promise<number[]> {
  try {
    // sort=name 으로 결정적 순서 확보 (기본 random 정렬은 페이지네이션 시 중복/누락 발생)
    const seen = new Set<number>();
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const res = await fetch(`${API_BASE}/places?per=100&page=${page}&sort=name`, { next: { revalidate: 86400 } });
      if (!res.ok) break;
      const data = await res.json();
      const items: { id: number }[] = data.data ?? [];
      if (items.length === 0) break;
      items.forEach((p) => seen.add(p.id));
      totalPages = data.meta?.total_pages ?? page;
      page++;
    }
    return [...seen];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const placeIds = await fetchAllPlaceIds();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/map`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/reviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/guide/finland`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guide/japan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  const regionRoutes: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${BASE}/sauna/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const placeRoutes: MetadataRoute.Sitemap = placeIds.map((id) => ({
    url: `${BASE}/place/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...regionRoutes, ...placeRoutes];
}
