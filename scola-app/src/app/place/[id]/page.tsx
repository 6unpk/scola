import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlaceDetailClient from './PlaceDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { resolvePlaceLinks } from '@/lib/sigungu';
import type { Place } from '@/types/place';
import { categoryLabel } from '@/data/categories';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

async function fetchPlace(id: string): Promise<Place | null | undefined> {
  try {
    const res = await fetch(`${API_BASE}/places/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.status === 404) return undefined;
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const place = await fetchPlace(id);
  if (place === undefined) notFound();

  if (!place) {
    return { title: '장소를 찾을 수 없습니다' };
  }

  const addr = place.road_address ?? place.address ?? '';
  const links = await resolvePlaceLinks(addr);
  const sigungu = addr.split(/\s+/)[1];
  const area = [links?.region.name, sigungu && /[시군구]$/.test(sigungu) ? sigungu : null].filter(Boolean).join(' ');
  const mainCategory = place.app_category?.[0] ? categoryLabel(place.app_category[0]) : '';
  const title = [place.name, [area, mainCategory].filter(Boolean).join(' ')].filter(Boolean).join(' - ');
  const categories = (place.app_category ?? [])
    .map((c: string) => categoryLabel(c))
    .join(', ');
  const description = [
    place.description,
    addr && `위치: ${addr}`,
    categories && `시설 유형: ${categories}`,
  ].filter(Boolean).join(' | ').slice(0, 160) || `${place.name} 정보, 위치, 이용 후기를 확인하세요.`;

  // 크기는 이미지마다 달라 하드코딩하지 않음(잘못된 1200×630 선언 제거). R2 호스팅 최적화 이미지.
  const images = [{ url: place.thumbnail ?? 'https://scola.kr/og-image.png', alt: place.name }];

  return {
    title,
    description,
    alternates: { canonical: `https://scola.kr/place/${id}` },
    openGraph: {
      siteName: '스콜라',
      title,
      description,
      url: `https://scola.kr/place/${id}`,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [place.thumbnail ?? 'https://scola.kr/og-image.png'],
    },
  };
}

function buildJsonLd(place: Place, id: string) {
  const addr = place.road_address ?? place.address ?? '';
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    description: place.description ?? undefined,
    url: `https://scola.kr/place/${id}`,
    image: place.thumbnail ?? undefined,
    address: addr ? { '@type': 'PostalAddress', streetAddress: addr, addressCountry: 'KR' } : undefined,
    telephone: place.phone ?? undefined,
    geo: place.latitude && place.longitude
      ? { '@type': 'GeoCoordinates', latitude: place.latitude, longitude: place.longitude }
      : undefined,
  };
}

export default async function PlaceDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const place = await fetchPlace(id);
  if (place === undefined) notFound();
  const regionLinks = place ? await resolvePlaceLinks(place.road_address ?? place.address) : null;

  return (
    <>
      {place && <JsonLd data={buildJsonLd(place, id)} />}
      <PlaceDetailClient place={place} regionLinks={regionLinks} />
    </>
  );
}
