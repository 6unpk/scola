import type { Metadata } from 'next';
import JapanGuidePage from './content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
  description: '일본 사우나 문화의 핵심 토토노우(整う)의 뜻과 방법, 사우너 문화, 사메시까지. 일본식 사우나 즐기는 법을 완벽하게 알아보세요.',
  keywords: ['일본 사우나', '토토노우', '사우너', '사메시', '아우프구스', '사우나 즐기는 법'],
  alternates: { canonical: 'https://scola.kr/guide/japan' },
  openGraph: {
    siteName: '스콜라',
    title: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
    description: '토토노우의 뜻과 일본 사우나 문화를 완벽하게 알아보세요.',
    url: 'https://scola.kr/guide/japan',
    type: 'article',
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라 — 일본식 사우나 가이드' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
    description: '토토노우의 뜻과 일본 사우나 문화를 완벽하게 알아보세요.',
    images: ['https://scola.kr/og-image.png'],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
  description: '토토노우의 뜻과 일본 사우나 문화',
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
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://scola.kr/guide/japan' },
  url: 'https://scola.kr/guide/japan',
  inLanguage: 'ko',
  about: [{ '@type': 'Thing', name: '일본 사우나' }, { '@type': 'Thing', name: '토토노우' }],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
    { '@type': 'ListItem', position: 2, name: '사우나 즐기는 법', item: 'https://scola.kr/guide' },
    { '@type': 'ListItem', position: 3, name: '일본식 사우나', item: 'https://scola.kr/guide/japan' },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JapanGuidePage />
    </>
  );
}
