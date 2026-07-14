import type { Metadata } from 'next';
import MapContent from './content';
import JsonLd from '@/components/seo/JsonLd';

const title = '전국 사우나·찜질방 지도';
const description =
  '전국 사우나, 찜질방, 스파, 불한증막, 온천을 지도에서 한눈에. 지역별로 내 주변 가까운 곳을 찾고 위치·후기까지 확인하세요.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['전국 사우나 지도', '사우나 지도', '찜질방 지도', '내 주변 사우나', '사우나 찾기', '지역별 사우나'],
  alternates: { canonical: 'https://scola.kr/map' },
  openGraph: {
    siteName: '스콜라',
    title: `${title} | 스콜라`,
    description,
    url: 'https://scola.kr/map',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: `${title} | 스콜라`, description },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: 'https://scola.kr/map',
  isPartOf: { '@type': 'WebSite', name: '스콜라', url: 'https://scola.kr' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <MapContent />
    </>
  );
}
