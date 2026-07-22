import type { Metadata } from 'next';
import FinlandGuidePage from './content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
  description: '핀란드 사우나의 3대 키워드 뢰윌뤼(Löyly), 비흐타(Vihta), 아반토(Avanto)의 의미와 즐기는 방법. 사우나→냉탕→외기욕 루틴과 핀란드 사우나 에티켓을 알아보세요.',
  keywords: ['핀란드 사우나', '뢰윌뤼', '비흐타', '아반토', '핀란드 사우나 즐기는 법', '사우나 루틴'],
  alternates: { canonical: 'https://scola.kr/guide/finland' },
  openGraph: {
    siteName: '스콜라',
    title: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
    description: '핀란드 사우나의 3대 키워드와 올바른 즐기는 방법을 알아보세요.',
    url: 'https://scola.kr/guide/finland',
    type: 'article',
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라 — 핀란드식 사우나 가이드' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
    description: '핀란드 사우나의 3대 키워드와 올바른 즐기는 방법을 알아보세요.',
    images: ['https://scola.kr/og-image.png'],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
  description: '핀란드 사우나의 3대 키워드와 올바른 즐기는 방법',
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
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://scola.kr/guide/finland' },
  url: 'https://scola.kr/guide/finland',
  inLanguage: 'ko',
  about: [{ '@type': 'Thing', name: '핀란드 사우나' }, { '@type': 'Thing', name: '뢰윌뤼' }],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
    { '@type': 'ListItem', position: 2, name: '사우나 즐기는 법', item: 'https://scola.kr/guide' },
    { '@type': 'ListItem', position: 3, name: '핀란드식 사우나', item: 'https://scola.kr/guide/finland' },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <FinlandGuidePage />
    </>
  );
}
