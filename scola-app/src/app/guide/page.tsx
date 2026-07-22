import type { Metadata } from 'next';
import GuidePage from './content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '사우나 즐기는 법 — 완벽 가이드',
  description: '사우나 올바르게 즐기는 방법. 사우나→냉탕→외기욕 루틴, 핀란드식 vs 일본식 차이, 사우나 에티켓까지 한눈에 알아보세요.',
  keywords: ['사우나 즐기는 법', '사우나 루틴', '사우나 에티켓', '냉탕 효능', '외기욕', '사우나 입문'],
  alternates: { canonical: 'https://scola.kr/guide' },
  openGraph: {
    siteName: '스콜라',
    title: '사우나 즐기는 법 — 완벽 가이드',
    description: '사우나 올바르게 즐기는 방법과 루틴을 알아보세요.',
    url: 'https://scola.kr/guide',
    type: 'article',
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라 — 사우나 즐기는 법 가이드' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '사우나 즐기는 법 — 완벽 가이드',
    description: '사우나 올바르게 즐기는 방법과 루틴을 알아보세요.',
    images: ['https://scola.kr/og-image.png'],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '사우나 즐기는 법 — 완벽 가이드',
  description: '사우나 올바르게 즐기는 방법과 루틴',
  image: 'https://scola.kr/og-image.png',
  datePublished: '2026-04-07',
  dateModified: '2026-04-13',
  author: { '@type': 'Organization', name: '아온미디어', url: 'https://scola.kr' },
  publisher: {
    '@type': 'Organization',
    name: '스콜라',
    url: 'https://scola.kr',
    logo: { '@type': 'ImageObject', url: 'https://scola.kr/web-app-manifest-512x512.png' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://scola.kr/guide' },
  url: 'https://scola.kr/guide',
  inLanguage: 'ko',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
    { '@type': 'ListItem', position: 2, name: '사우나 즐기는 법', item: 'https://scola.kr/guide' },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <GuidePage />
    </>
  );
}
