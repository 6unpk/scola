import type { Metadata } from 'next';
import GuidePage from './content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '사우나 즐기는 법 — 완벽 가이드',
  description: '사우나 올바르게 즐기는 방법. 사우나→냉탕→외기욕 루틴, 핀란드식 vs 일본식 차이, 사우나 에티켓까지 한눈에 알아보세요.',
  keywords: ['사우나 즐기는 법', '사우나 루틴', '사우나 에티켓', '냉탕 효능', '외기욕', '사우나 입문'],
  openGraph: {
    title: '사우나 즐기는 법 — 완벽 가이드',
    description: '사우나 올바르게 즐기는 방법과 루틴을 알아보세요.',
    url: 'https://scola.kr/guide',
    type: 'article',
  },
  twitter: { card: 'summary_large_image' },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '사우나 즐기는 법 — 완벽 가이드',
  description: '사우나 올바르게 즐기는 방법과 루틴',
  author: { '@type': 'Organization', name: '아온미디어', url: 'https://scola.kr' },
  publisher: { '@type': 'Organization', name: 'Scola', url: 'https://scola.kr' },
  url: 'https://scola.kr/guide',
  inLanguage: 'ko',
};

export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <GuidePage />
    </>
  );
}
