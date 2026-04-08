import type { Metadata } from 'next';
import FinlandGuidePage from './content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
  description: '핀란드 사우나의 3대 키워드 뢰윌뤼(Löyly), 비흐타(Vihta), 아반토(Avanto)의 의미와 즐기는 방법. 사우나→냉탕→외기욕 루틴과 핀란드 사우나 에티켓을 알아보세요.',
  keywords: ['핀란드 사우나', '뢰윌뤼', '비흐타', '아반토', '핀란드 사우나 즐기는 법', '사우나 루틴'],
  openGraph: {
    siteName: '스콜라',
    title: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
    description: '핀란드 사우나의 3대 키워드와 올바른 즐기는 방법을 알아보세요.',
    url: 'https://scola.kr/guide/finland',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
    description: '핀란드 사우나의 3대 키워드와 올바른 즐기는 방법을 알아보세요.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '핀란드식 사우나 즐기기 — 뢰윌뤼·비흐타·아반토',
  description: '핀란드 사우나의 3대 키워드와 올바른 즐기는 방법',
  author: { '@type': 'Organization', name: '아온미디어', url: 'https://scola.kr' },
  publisher: { '@type': 'Organization', name: '스콜라', url: 'https://scola.kr' },
  url: 'https://scola.kr/guide/finland',
  inLanguage: 'ko',
  about: [{ '@type': 'Thing', name: '핀란드 사우나' }, { '@type': 'Thing', name: '뢰윌뤼' }],
};

export default function Page() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <FinlandGuidePage />
    </>
  );
}
