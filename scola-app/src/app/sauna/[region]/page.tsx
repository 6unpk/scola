import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { REGIONS, regionBySlug } from '@/data/regions';
import RegionContent from './content';
import JsonLd from '@/components/seo/JsonLd';
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
    return data.data ?? [];
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

  const title = `${info.name} 사우나·찜질방·스파 추천`;
  const description =
    `${info.name} 지역의 사우나, 찜질방, 스파, 불한증막, 세신샵을 한눈에. ` +
    `위치·시설 정보·이용 후기까지 스콜라에서 확인하세요.`;
  const url = `https://scola.kr/sauna/${region}`;

  return {
    title,
    description,
    keywords: [`${info.name} 사우나`, `${info.name} 찜질방`, `${info.name} 스파`, `${info.name} 사우나 추천`, `${info.name} 24시 찜질방`],
    alternates: { canonical: url },
    openGraph: { siteName: '스콜라', title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function RegionPage(
  { params }: { params: Promise<{ region: string }> },
) {
  const { region } = await params;
  const info = regionBySlug(region);
  if (!info) notFound();

  const places = await fetchRegionPlaces(info.name);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${info.name} 사우나·찜질방·스파`,
    numberOfItems: places.length,
    itemListElement: places.slice(0, 25).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://scola.kr/place/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <RegionContent region={info} places={places} />
    </>
  );
}
