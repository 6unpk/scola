import type { Metadata } from 'next';
import SearchPage from './content';

export const metadata: Metadata = {
  title: '사우나·찜질방 검색',
  description: '전국 사우나, 찜질방, 스파를 지역·카테고리·시설 조건으로 검색하세요. 평점, 리뷰 수 기반 필터 제공.',
  openGraph: {
    siteName: '스콜라',
    title: '사우나·찜질방 검색 | 스콜라',
    description: '전국 사우나, 찜질방, 스파를 지역·카테고리·시설 조건으로 검색하세요.',
    url: 'https://scola.kr/search',
    type: 'website',
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라 — 사우나·찜질방 검색' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '사우나·찜질방 검색 | 스콜라',
    description: '전국 사우나, 찜질방, 스파를 지역·카테고리·시설 조건으로 검색하세요.',
    images: ['https://scola.kr/og-image.png'],
  },
};

export default function Page() {
  return <SearchPage />;
}
