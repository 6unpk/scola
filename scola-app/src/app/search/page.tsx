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
  },
};

export default function Page() {
  return <SearchPage />;
}
