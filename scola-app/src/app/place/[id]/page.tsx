import type { Metadata } from 'next';
import PlaceDetailClient from './PlaceDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import type { Place } from '@/types/place';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

async function fetchPlace(id: string): Promise<Place | null> {
  try {
    const res = await fetch(`${API_BASE}/places/${id}`, {
      next: { revalidate: 3600 },
    });
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

  if (!place) {
    return { title: '장소를 찾을 수 없습니다' };
  }

  const addr = place.road_address ?? place.address ?? '';
  const categories = (place.app_category ?? [])
    .map((c: string) => ({ sauna: '사우나', jjimjilbang: '찜질방', spa: '스파' }[c] ?? c))
    .join(', ');
  const description = [
    place.description,
    addr && `위치: ${addr}`,
    categories && `시설 유형: ${categories}`,
  ].filter(Boolean).join(' | ').slice(0, 160) || `${place.name} 정보, 위치, 이용 후기를 확인하세요.`;

  const images = place.thumbnail ? [{ url: place.thumbnail, width: 1200, height: 630, alt: place.name }] : [];

  return {
    title: place.name,
    description,
    openGraph: {
      siteName: '스콜라',
      title: place.name,
      description,
      url: `https://scola.kr/place/${id}`,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: place.name,
      description,
      images: place.thumbnail ? [place.thumbnail] : [],
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
    openingHours: place.open_hours ?? place.business_hours ?? undefined,
    aggregateRating: (place.visitor_review_count ?? 0) > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: place.rating ?? 4,
      reviewCount: place.visitor_review_count,
    } : undefined,
  };
}

export default async function PlaceDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const place = await fetchPlace(id);

  return (
    <>
      {place && <JsonLd data={buildJsonLd(place, id)} />}
      <PlaceDetailClient place={place} />
    </>
  );
}
