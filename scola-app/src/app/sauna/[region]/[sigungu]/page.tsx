import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { REGIONS, regionBySlug } from '@/data/regions';
import { fetchSubregions, sigunguSlug, MIN_SUBREGION_PLACES, excludeWaterparks } from '@/lib/sigungu';
import RegionContent from '../content';
import JsonLd from '@/components/seo/JsonLd';
import type { Place } from '@/types/place';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  const params: { region: string; sigungu: string }[] = [];
  for (const r of REGIONS) {
    const subs = await fetchSubregions(r.name);
    for (const s of subs) {
      if (s.count >= MIN_SUBREGION_PLACES) params.push({ region: r.slug, sigungu: sigunguSlug(s.label) });
    }
  }
  return params;
}

async function resolve(regionSlug: string, sigungu: string) {
  const info = regionBySlug(regionSlug);
  if (!info) return null;
  const subs = await fetchSubregions(info.name);
  const sub = subs.find((s) => s.count >= MIN_SUBREGION_PLACES && sigunguSlug(s.label) === sigungu);
  return sub ? { info, sub } : null;
}

async function fetchPlaces(subValue: string): Promise<Place[]> {
  try {
    const res = await fetch(
      `${API_BASE}/places?subregion=${encodeURIComponent(subValue)}&per=60&sort=rating`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    return excludeWaterparks((await res.json()).data ?? []);
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ region: string; sigungu: string }> },
): Promise<Metadata> {
  const { region, sigungu } = await params;
  const r = await resolve(region, sigungu);
  if (!r) return { title: '지역을 찾을 수 없습니다' };

  const places = await fetchPlaces(r.sub.value);
  const heroImg = places.find((p) => p.thumbnail)?.thumbnail;
  const name = r.sub.label;
  const title = `${name} 사우나·찜질방·목욕탕 추천`;
  const description = places.length > 0
    ? `${r.info.name} ${name} 사우나·찜질방·목욕탕·스파 ${places.length.toLocaleString()}곳. 위치·요금·이용 후기를 비교하고 가까운 곳을 찾아보세요.`
    : `${r.info.name} ${name}의 사우나·찜질방·목욕탕을 스콜라에서 확인하세요.`;
  const url = `https://scola.kr/sauna/${region}/${sigungu}`;
  const images = [{ url: heroImg || 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: `${name} 사우나` }];

  return {
    title,
    description,
    keywords: [`${name} 사우나`, `${name} 찜질방`, `${name} 목욕탕`, `${name} 사우나 추천`, `${r.info.name} ${name} 사우나`],
    alternates: { canonical: url },
    openGraph: { siteName: '스콜라', title, description, url, type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images: [images[0].url] },
  };
}

export default async function SigunguPage(
  { params }: { params: Promise<{ region: string; sigungu: string }> },
) {
  const { region, sigungu } = await params;
  const r = await resolve(region, sigungu);
  if (!r) notFound();

  const places = await fetchPlaces(r.sub.value);
  const name = r.sub.label;

  const regionInfo = {
    slug: region,
    name,
    blurb: `${r.info.name} ${name}의 사우나, 찜질방, 목욕탕, 스파를 한곳에 모았습니다.`,
  };

  const url = `https://scola.kr/sauna/${region}/${sigungu}`;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${name} 사우나·찜질방·목욕탕`,
    numberOfItems: places.length,
    itemListElement: places.slice(0, 25).map((p, i) => ({
      '@type': 'ListItem', position: i + 1, url: `https://scola.kr/place/${p.id}`, name: p.name,
    })),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
      { '@type': 'ListItem', position: 2, name: `${r.info.name} 사우나`, item: `https://scola.kr/sauna/${region}` },
      { '@type': 'ListItem', position: 3, name: `${name} 사우나`, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <RegionContent region={regionInfo} places={places} />
    </>
  );
}
