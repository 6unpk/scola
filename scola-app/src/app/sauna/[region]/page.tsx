import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { REGIONS, regionBySlug } from '@/data/regions';
import { fetchSubregions, sigunguSlug, MIN_SUBREGION_PLACES, excludeWaterparks } from '@/lib/sigungu';
import RegionContent from './content';
import JsonLd from '@/components/seo/JsonLd';
import { topPlaceNames, pickOgImage, seoTitle, areaDescription } from '@/lib/regionSeo';
import regionDescriptions from '@/data/regionDescriptions.json';
import type { Place } from '@/types/place';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

export const dynamicParams = false;          // 정의된 17개 지역만 (그 외 404)
export const revalidate = 86400;             // 하루 1회 재생성

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.slug }));
}

async function fetchRegionPlaces(name: string): Promise<Place[]> {
  try {
    const res = await fetch(
      `${API_BASE}/places?region=${encodeURIComponent(name)}&per=60&sort=rating`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return excludeWaterparks(data.data ?? []);
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ region: string }> },
): Promise<Metadata> {
  const { region } = await params;
  const info = regionBySlug(region);
  if (!info) return { title: '지역을 찾을 수 없습니다' };

  const places = await fetchRegionPlaces(info.name);
  const count = places.length;
  const names = topPlaceNames(places);

  const title = seoTitle(`${info.name} 사우나, 찜질방 추천`, count, names);
  const description = count > 0
    ? (regionDescriptions as Record<string, string>)[region] ?? areaDescription(info.name, places, 'sigungu')
    : `${info.name} 사우나, 찜질방 목록.`;
  const url = `https://scola.kr/sauna/${region}`;
  const images = [{ url: pickOgImage(places), width: 1200, height: 630, alt: `${info.name} 사우나, 찜질방` }];

  return {
    title,
    description,
    keywords: [`${info.name} 사우나`, `${info.name} 찜질방`, `${info.name} 스파`, `${info.name} 사우나 추천`, `${info.name} 24시 찜질방`],
    alternates: { canonical: url },
    openGraph: { siteName: '스콜라', title, description, url, type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images: [images[0].url] },
  };
}

export default async function RegionPage(
  { params }: { params: Promise<{ region: string }> },
) {
  const { region } = await params;
  const info = regionBySlug(region);
  if (!info) notFound();

  const places = await fetchRegionPlaces(info.name);

  const subs = await fetchSubregions(info.name);
  const subLinks = subs
    .filter((s) => s.count >= MIN_SUBREGION_PLACES)
    .map((s) => ({ href: `/sauna/${region}/${sigunguSlug(s.label)}`, label: s.label, count: s.count }));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${info.name} 사우나, 찜질방, 스파`,
    numberOfItems: places.length,
    itemListElement: places.slice(0, 25).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://scola.kr/place/${p.id}`,
      name: p.name,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
      { '@type': 'ListItem', position: 2, name: '지도', item: 'https://scola.kr/map' },
      { '@type': 'ListItem', position: 3, name: `${info.name} 사우나`, item: `https://scola.kr/sauna/${region}` },
    ],
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <RegionContent region={info} places={places} subLinks={subLinks} />
    </>
  );
}
