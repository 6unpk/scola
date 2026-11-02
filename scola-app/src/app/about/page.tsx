import type { Metadata } from 'next';
import AboutPage from './content';
import JsonLd from '@/components/seo/JsonLd';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '스콜라에 대해 - 쉼에서 온 이름',
  description: '스콜라(schola)는 그리스어 스콜레(σχολή), 곧 쉼에서 온 말입니다. 로마 목욕탕의 머무는 자리에서 한국 찜질방까지, 스콜라가 하는 일을 소개합니다.',
  alternates: { canonical: 'https://scola.kr/about' },
  openGraph: {
    siteName: '스콜라',
    title: '스콜라에 대해 - 쉼에서 온 이름',
    description: '스콜라는 당신이 머물 자리를 찾아주는 곳입니다.',
    url: 'https://scola.kr/about',
    type: 'website',
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라에 대해' }],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: '스콜라에 대해',
  url: 'https://scola.kr/about',
  inLanguage: 'ko',
  mainEntity: {
    '@type': 'Organization',
    name: '스콜라',
    url: 'https://scola.kr',
    logo: 'https://scola.kr/web-app-manifest-512x512.png',
    sameAs: ['https://www.instagram.com/scolakr'],
  },
};

async function fetchPlaceCount(): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/places?per=1`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.meta?.total ?? null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const placeCount = await fetchPlaceCount();
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutPage placeCount={placeCount} />
    </>
  );
}
