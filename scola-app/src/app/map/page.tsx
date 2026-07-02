import type { Metadata } from 'next';
import MapContent from './content';

export const metadata: Metadata = {
  title: '지도에서 찾기',
  description: '전국 사우나, 찜질방, 스파를 지도에서 한눈에 탐색하세요. 위치 기반으로 가까운 곳을 찾아보세요.',
  openGraph: {
    siteName: '스콜라',
    title: '지도에서 찾기 | 스콜라',
    description: '전국 사우나, 찜질방, 스파를 지도에서 한눈에 탐색하세요.',
    url: 'https://scola.kr/map',
    type: 'website',
  },
};

export default function Page() {
  return <MapContent />;
}
