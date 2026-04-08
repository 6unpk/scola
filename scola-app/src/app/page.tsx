import type { Metadata } from 'next';
import HomePage from './home-content';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: '스콜라 - 사우나 찜질방 정보 후기',
  description: '전국 사우나, 찜질방, 스파를 한 곳에서 찾아보세요. 위치, 시설 정보, 이용 후기까지.',
  openGraph: {
    siteName: '스콜라',
    title: '스콜라 - 사우나 찜질방 정보 후기',
    description: '전국 사우나, 찜질방, 스파를 한 곳에서 찾아보세요.',
    url: 'https://scola.kr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '스콜라 - 사우나 찜질방 정보 후기',
    description: '전국 사우나, 찜질방, 스파를 한 곳에서 찾아보세요.',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '스콜라',
  url: 'https://scola.kr',
  description: '전국 사우나, 찜질방, 스파 정보 플랫폼',
  inLanguage: 'ko',
  publisher: { '@type': 'Organization', name: '아온미디어', url: 'https://scola.kr' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://scola.kr/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <HomePage />
    </>
  );
}
