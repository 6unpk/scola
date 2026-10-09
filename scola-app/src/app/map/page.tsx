import type { Metadata } from 'next';
import MapContent from './content';
import JsonLd from '@/components/seo/JsonLd';
import type { Place, PlaceMarker } from '@/types/place';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

async function fetchRecommended(): Promise<PlaceMarker[]> {
  try {
    const res = await fetch(`${API_BASE}/places?sort=recommend&per=10&has_image=true`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items: Place[] = data.data ?? [];
    return items
      .filter((p) => p.latitude != null && p.longitude != null)
      .map((p) => ({
        id: p.id,
        name: p.name,
        latitude: p.latitude as number,
        longitude: p.longitude as number,
        app_category: p.app_category,
        thumbnail: p.thumbnail,
        road_address: p.road_address ?? p.address,
      }));
  } catch {
    return [];
  }
}

const title = '전국 사우나·찜질방 지도';
const description =
  '전국 사우나, 찜질방, 스파, 불한증막, 온천을 지도에서 한눈에. 지역별로 내 주변 가까운 곳을 찾고 위치·후기까지 확인하세요.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['전국 사우나 지도', '사우나 지도', '찜질방 지도', '내 주변 사우나', '사우나 찾기', '지역별 사우나'],
  alternates: { canonical: 'https://scola.kr/map' },
  openGraph: {
    siteName: '스콜라',
    title: `${title} | 스콜라`,
    description,
    url: 'https://scola.kr/map',
    type: 'website',
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '전국 사우나·찜질방 지도' }],
  },
  twitter: { card: 'summary_large_image', title: `${title} | 스콜라`, description, images: ['https://scola.kr/og-image.png'] },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: 'https://scola.kr/map',
  isPartOf: { '@type': 'WebSite', name: '스콜라', url: 'https://scola.kr' },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
    { '@type': 'ListItem', position: 2, name: title, item: 'https://scola.kr/map' },
  ],
};

export default async function Page() {
  const recommended = await fetchRecommended();
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <MapContent recommended={recommended} />
    </>
  );
}
