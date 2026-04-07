import type { Metadata } from 'next';
import JapanGuidePage from './content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
  description: '일본 사우나 문화의 핵심 토토노우(整う)의 뜻과 방법, 사우너 문화, 사메시까지. 일본식 사우나 즐기는 법을 완벽하게 알아보세요.',
  keywords: ['일본 사우나', '토토노우', '사우너', '사메시', '아우프구스', '사우나 즐기는 법'],
  openGraph: {
    title: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
    description: '토토노우의 뜻과 일본 사우나 문화를 완벽하게 알아보세요.',
    url: 'https://scola.kr/guide/japan',
    type: 'article',
  },
  twitter: { card: 'summary_large_image' },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '일본식 사우나 즐기기 — 토토노우·사우너·사메시',
  description: '토토노우의 뜻과 일본 사우나 문화',
  author: { '@type': 'Organization', name: '아온미디어', url: 'https://scola.kr' },
  publisher: { '@type': 'Organization', name: 'Scola', url: 'https://scola.kr' },
  url: 'https://scola.kr/guide/japan',
  inLanguage: 'ko',
  about: [{ '@type': 'Thing', name: '일본 사우나' }, { '@type': 'Thing', name: '토토노우' }],
};

export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JapanGuidePage />
    </>
  );
}
